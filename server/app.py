from flask import Flask, Response, request, url_for, jsonify, abort
from rethinkdb import r
from rethinkdb.errors import RqlError, RqlRuntimeError, RqlDriverError
import json
import datetime

app = Flask(__name__)
app.config.from_object(__name__)
# HOST_DB = "172.31.29.127" # private IP
HOST_DB = "54.254.243.199" # private IP


@app.before_request
def before_request():
    try:
        app.rdb_conn = r.connect(host=HOST_DB, port=28015, db="posedee")
    except RqlDriverError:
        abort(503, "No database connection could be established.")


@app.route("/")
def index():
    return Response("Yo! stranger", content_type="text/plain")



# =============================================================================
# user routes
# =============================================================================

# route to post user data into user database (req/res)
@app.route("/users", methods=["POST"])
def add_users():
    try:
        data = request.get_json()
        if not list(
            r.table("users").get_all(data["id"], index="id").run(app.rdb_conn)
        ):
            r.table("users").insert(data).run(app.rdb_conn)
            return Response(json.dumps({"message": "Insert successful"}), status=200, content_type="application/json")
        return Response(json.dumps({"message": "Check done!, User has already in."}), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()



# ==============================================================================
# Daily graph routes
# ==============================================================================

# TODO:
# route to insert camera data into daily database (req/res)
@app.route("/api/db/daily", methods=["POST"])
def realtimeProgressPost():
    try:
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

        
        r.table("logs_rt_daily").insert(data).run(app.rdb_conn)
        return Response(json.dumps({"message": "Insert successful"}), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


# route to get all daily progress of each user (event streaming)
@app.route("/rt/progress/<userId>", methods=["GET"])
def realtimeProgressGet(userId):
    def events():
        try:
            cursorAll = r.table("logs_rt_daily").get_all(userId, index="userId").run(app.rdb_conn)
            for doc in cursorAll:
                yield f"data: {json.dumps(doc)}" + "\n\n"
                
            cursorChange = r.table("logs_rt_daily").get_all(userId, index="userId").changes().run(app.rdb_conn)
            for document in cursorChange:
                yield f"data: {json.dumps(document['new_val'])}" + "\n\n"
        except RqlError as e:
            return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
        finally:
            cursorAll.close()
            cursorChange.close()
            app.rdb_conn.close()

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

# TODO:
# route to get weekly necessary data of each user for weekly graph (req/res)
@app.route("/api/dash/weekly/<userId>", methods=["GET"])
def getWeeklyData(userId):
    try:
        currentWeek = datetime.datetime.now().isocalendar().week
        # currentWeek = 21 # test
        
        weeklyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Week"] == currentWeek)
                            )
                            .group("Day","Day_Name", "Posture")
                            .count()
                            .ungroup()
                            .run(app.rdb_conn))
        result = list(map(transformAndMinToHourOfDayOfWeekly, weeklyList))
        # print(weeklyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


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
        currentMonth = datetime.datetime.now().month
        # currentMonth = 6 # test
        
        monthlyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Month"] == currentMonth)
                            )
                            .group("Day", "Posture")
                            .count()
                            .ungroup()
                            .run(app.rdb_conn))
        result = list(map(transformAndMinToHourOfDayOfMonthly, monthlyList))
        # print(monthlyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


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
        currentYear = datetime.datetime.now().year
        # currentYear = 2022 # test
        
        yearlyList = list(r.table("logs_summary").filter(
                                (r.row["userId"] == userId) & (r.row["Year"] == currentYear)
                            )
                          .group("Month","Posture")
                          .count()
                          .ungroup()
                          .run(app.rdb_conn))

        result = list(map(transformAndMinToHourOfMonth, yearlyList))
        # print(yearlyList)
        return Response(json.dumps(result), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


if __name__ == "__main__":
    app.run()