from flask import Flask, Response, request, url_for, jsonify, abort
from rethinkdb import r
from rethinkdb.errors import RqlError, RqlRuntimeError, RqlDriverError
import json
import datetime

app = Flask(__name__)
app.config.from_object(__name__)
# HOST_DB = "172.31.29.127" # private IP
HOST_DB = "172.31.29.127" # private IP


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

def minToHourOfDay(doc):
    doc["Count"] = doc["Count"] / 3600
    return doc

# TODO:
# route to get weekly necessary data of each user for weekly graph (req/res)
@app.route("/api/dash/weekly/<userId>", methods=["GET"])
def getWeeklyData(userId):
    try:
        currentWeek = datetime.datetime.now().isocalendar().week
        
        weeklyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Week"] == currentWeek)
                            )
                            .group("Day","Day_Name", "Posture")
                            .count()
                            .run(app.rdb_conn))
        # print(map(minToHourOfDay, weeklyList))
        print(weeklyList)
        return Response(json.dumps(weeklyList), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


# route to get monthly necessary data of each user for monthly graph (req/res)
@app.route("/api/dash/monthly/<userId>", methods=["GET"])
def getMonthlyData(userId):
    try:
        currentMonth = datetime.datetime.now().month
        
        monthlyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Month"] == currentMonth)
                            )
                            .group("Day", "Posture")
                            .count()
                            .run(app.rdb_conn))
        # print(map(minToHourOfDay, monthlyList))
        print(monthlyList)
        return Response(json.dumps(monthlyList), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


def minToHourOfMonth(doc):
    doc["Count"] = doc["Count"] / 2592000
    return doc

# route to get yearly necessary data of each user for yearly graph (req/res)
@app.route("/api/dash/yearly/<userId>", methods=["GET"])
def getYearlyData(userId):
    try:
        currentYear = datetime.datetime.now().year
        
        yearlyList = list(r.table("logs_summary")
                            .filter(
                                (r.row["userId"] == userId) & (r.row["Year"] == currentYear)
                            )
                            .group("Month", "Posture")
                            .count()
                            .run(app.rdb_conn))
        # print(map(minToHourOfMonth, yearlyList))
        print(yearlyList)
        return Response(json.dumps(yearlyList), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


if __name__ == "__main__":
    app.run()