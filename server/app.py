from flask import Flask, Response, request, url_for, jsonify, abort, render_template
from rethinkdb import r
from rethinkdb.errors import RqlError, RqlRuntimeError, RqlDriverError
import json
import datetime
import os

app = Flask(__name__)
app.config.from_object(__name__)
HOST_DB = os.getenv("HOST_DB") # private IP

# index route
@app.route("/")
def index():
    return Response("Yo! stranger", content_type="text/plain")



# =============================================================================
# user routes
# =============================================================================

# route to post user data into user database (req/res)
@app.route("/api/users", methods=["POST"])
def add_users():
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        data = request.get_json()
        if not list(
            r.table("users").get_all(data["userId"], index="userId").run(conn)
        ):
            r.table("users").insert(data).run(conn)
            return Response(json.dumps({"message": "Insert successful"}), status=200, content_type="application/json")
        return Response(json.dumps({"message": "Check done!, User has already in."}), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()



# ==============================================================================
# Daily graph routes
# ==============================================================================


# route to insert camera data into daily database (req/res)
@app.route("/api/db/daily", methods=["POST"])
def realtimeProgressPost():
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        data = request.get_json()
        neck = float(data.get("neck_inclination"))
        torso = float(data.get("torso_inclination"))
                
        # add necessary columns
        data['Year'] = int(data.get("Timestamp")[:4])
        data['Month'] = int(data.get("Timestamp")[5:7])
        data['Day'] = int(data.get("Timestamp")[8:10])
        data["Day_Name"] = datetime.date(data["Year"], data["Month"], data["Day"]).strftime("%A")
        data["Week"] = datetime.date(data["Year"], data["Month"], data["Day"]).isocalendar().week
        data['Hour'] = int(data.get("Timestamp")[11:13])
        data['Minute'] = int(data.get("Timestamp")[14:16])
        
        if (neck < 40 and torso > 10):
            data["why_bad"] = "torso"
        elif (neck > 40 and torso < 10):
            data["why_bad"] = "neck"
        elif (neck > 40 and torso > 10):
            data["why_bad"] = "both"

        
        r.table("logs_rt_daily").insert(data).run(conn)
        return Response(json.dumps({"message": "Insert successful"}), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()
        
        
def transformAndMinToHourOfDay(doc):
    doc["Hour"] = doc["group"][0]
    doc["Posture"] = doc["group"][1]
    doc["Count"] = doc["reduction"] / 60
    doc.pop("group")
    doc.pop("reduction")
    return doc
        
# route to get hourly graph necessary data (req/res)
@app.route("/api/dash/hourly/<userId>", methods=["GET"])
def getHourlyData(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        hourlyList = list(r.table("logs_rt_daily")
                          .filter(
                              (r.row["userId"] == userId) # & (r.row["Timestamp"].match("^2022-04-03.*$")) # test
                          )
                          .group("Hour", "Posture")
                          .count()
                          .ungroup()
                          .run(conn))
        
        result = list(map(transformAndMinToHourOfDay, hourlyList))
        # print(hourlyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


def transformGaugeColumnName(doc):
    doc["Posture"] = doc["group"]
    doc["Count"] = doc["reduction"]
    doc.pop("group")
    doc.pop("reduction")
    return doc

# route to get gauge graph necessary data (req/res)
@app.route("/api/dash/gauge/<userId>", methods=["GET"])
def getGaugeData(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        result = list(r.table("logs_rt_daily")
                          .filter(
                              (r.row["userId"] == userId) # & (r.row["Timestamp"].match("^2022-04-13.*$")) # test
                          )
                          .group("Posture")
                          .count()
                          .ungroup()
                          .run(conn))
        
        result = list(map(transformGaugeColumnName, result))
        # print(result)
        # print(round(result[1]["Count"] / (result[0]["Count"] + result[1]["Count"]) * 100, 2), " %") 
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


@app.route("/api/request/progress/<userId>", methods=["GET"])
def getReqProgress(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        result = list(r.table("logs_rt_daily").filter(
                            (r.row["userId"] == userId) # & (r.row["Timestamp"].match("^2022-04-13.*$")) # test
                        ).group("Posture").count().ungroup().run(conn))
        
        result = list(map(transformGaugeColumnName, result))
        # format -> data: [{"Posture": 0, "Count": 0.0}, {"Posture": 1, "Count": 0.0}]
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()

# route to get all daily posture durations of each user (Bank's duration display) (event streaming)
@app.route("/api/realtime/progress/<userId>", methods=["GET"])
def getRealtimeProgress(userId):
    def events():
        try:
            # create connection
            conn = r.connect(host=HOST_DB, port=28015, db="posedee")
                 
            cursorChange = r.table("logs_rt_daily").filter((r.row["userId"] == userId)).pluck("Posture").changes().run(conn)
            for doc in cursorChange:
                # format -> data: {"new_val": {"Posture": 0}, "old_val": null}
                yield f"data: {json.dumps(doc)}" + "\n\n" # yield only posture and then calculate durations at HTML.
        except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
        # finally:
        #     cursorChange.close()
        #     conn.close()

    return Response(response=events(), status=200, content_type='text/event-stream')


@app.route("/api/request/average/<userId>", methods=["GET"])
def getReqPostureAvg(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        result = r.table("logs_rt_daily").filter(
                              (r.row["userId"] == userId) # & (r.row["Timestamp"].match("^2022-04-13.*$")) # test
                          ).pluck("torso_inclination", "neck_inclination").map(lambda doc: {
                            "total_torso": doc["torso_inclination"],
                            "total_neck": doc["neck_inclination"],
                            "count": 1
                          }).reduce(lambda left, right: {
                            "total_torso": (left["total_torso"] + right["total_torso"]),
                            "total_neck": (left["total_neck"] + right["total_neck"]),
                            "count": (left["count"] + right["count"])
                          }).do(lambda res: {
                            "avg_torso": (res["total_torso"] / res["count"]),
                            "avg_neck": (res["total_neck"] / res["count"]),
                            "total_count": res["count"]  
                          }).run(conn)
            
        # format -> data: {"avg_neck": 45.11833333333333, "avg_torso": 42.59166666666667, "total_count": 6}
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()

# route to get all daily posture average (neck/torso) of each user (Posture stats) (event streaming)
@app.route("/api/realtime/average/<userId>", methods=["GET"])
def getRealtimePostureAvg(userId):
    def events():
        try:
            # create connection
            conn = r.connect(host=HOST_DB, port=28015, db="posedee")
            
            cursorChange = r.table("logs_rt_daily").filter((r.row["userId"] == userId)).pluck("torso_inclination", "neck_inclination").changes().run(conn)
            for doc in cursorChange:
                # format -> data: {"new_val": {"neck_inclination": 17.11, "torso_inclination": 32.36}, "old_val": null}
                yield f"data: {json.dumps(doc)}" + "\n\n" # yield only posture details and then calculate durations at HTML.
        except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
        # finally:
        #     cursorChange.close()
        #     conn.close()

    return Response(response=events(), status=200, content_type='text/event-stream')


def transformCauseKey(doc):
    doc["cause"] = doc["group"]
    doc["count"] = doc["reduction"]
    doc.pop("group")
    doc.pop("reduction")
    return doc

@app.route("/api/request/cause/<userId>", methods=["GET"])
def getReqCause(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        result = list(r.table("logs_rt_daily").filter(
                            (r.row["userId"] == userId) # & (r.row["Timestamp"].match("^2022-04-13.*$")) # test
                        ).group("why_bad").count().ungroup().run(conn))
        
        result = list(map(transformCauseKey, result))
        # format -> data: [{"cause": null, "count": 1}, {"cause": "both", "count": 1}, {"cause": "neck", "count": 1}, {"cause": "torso", "count": 3}]
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


# route to get all daily main bad posture cause of each user (event streaming)
@app.route("/api/realtime/cause/<userId>", methods=["GET"])
def getRealtimeCause(userId):
    def events():
        try:
            # create connection
            conn = r.connect(host=HOST_DB, port=28015, db="posedee")
            
            cursorChange = r.table("logs_rt_daily").filter((r.row["userId"] == userId)).pluck("why_bad").changes().run(conn)
            for doc in cursorChange:
                # format -> data: {"new_val": {"why_bad": "torso"}, "old_val": null}
                yield f"data: {json.dumps(doc)}" + "\n\n" # yield only posture and then calculate durations at HTML.
        except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
        # finally:
        #     cursorChange.close()
        #     conn.close()

    return Response(response=events(), status=200, content_type='text/event-stream')



# =============================================================================
# Summary graph routes
# =============================================================================

def transformAndMinToHourOfDayOfWeekly(doc):
    doc["Day"] = doc["group"][0]
    doc["Day_Name"] = doc["group"][1]
    doc["Posture"] = doc["group"][2]
    doc["Count"] = doc["reduction"] / 3600
    doc.pop("group")
    doc.pop("reduction")
    return doc


# route to get weekly necessary data of each user for weekly graph (req/res)
@app.route("/api/dash/weekly/<userId>", methods=["GET"])
def getWeeklyData(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        currentWeek = datetime.datetime.now().isocalendar().week
        # currentWeek = 21 # test
        
        weeklyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Week"] == currentWeek)
                            )
                            .group("Day","Day_Name", "Posture")
                            .count()
                            .ungroup()
                            .run(conn))
        result = list(map(transformAndMinToHourOfDayOfWeekly, weeklyList))
        # print(weeklyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


def transformAndMinToHourOfDayOfMonthly(doc):
    doc["Day"] = doc["group"][0]
    doc["Posture"] = doc["group"][1]
    doc["Count"] = doc["reduction"] / 3600
    doc.pop("group")
    doc.pop("reduction")
    return doc


# route to get monthly necessary data of each user for monthly graph (req/res)
@app.route("/api/dash/monthly/<userId>", methods=["GET"])
def getMonthlyData(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        currentMonth = datetime.datetime.now().month
        # currentMonth = 6 # test
        
        monthlyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Month"] == currentMonth)
                            )
                            .group("Day", "Posture")
                            .count()
                            .ungroup()
                            .run(conn))
        result = list(map(transformAndMinToHourOfDayOfMonthly, monthlyList))
        # print(monthlyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


def transformAndMinToHourOfMonth(doc):
    doc["Month"] = doc["group"][0]
    doc["Posture"] = doc["group"][1]
    doc["Count"] = float(doc["reduction"] / 2592000)
    doc.pop("group")
    doc.pop("reduction")
    return doc

# route to get yearly necessary data of each user for yearly graph (req/res)
@app.route("/api/dash/yearly/<userId>", methods=["GET"])
def getYearlyData(userId):
    try:
        # create connection
        conn = r.connect(host=HOST_DB, port=28015, db="posedee")
        
        currentYear = datetime.datetime.now().year
        # currentYear = 2022 # test
        
        yearlyList = list(r.table("logs_summary").filter(
                                (r.row["userId"] == userId) & (r.row["Year"] == currentYear)
                            )
                          .group("Month","Posture")
                          .count()
                          .ungroup()
                          .run(conn))

        result = list(map(transformAndMinToHourOfMonth, yearlyList))
        # print(yearlyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        conn.close()


if __name__ == "__main__":
    app.run()