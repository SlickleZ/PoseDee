from flask import Flask, Response, request, url_for, jsonify, abort
from rethinkdb import r
from rethinkdb.errors import RqlError, RqlRuntimeError, RqlDriverError
import json

app = Flask(__name__)
app.config.from_object(__name__)
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


# route to post camera data into camera database (req/res)
@app.route("/rt/progress", methods=["POST"])
def realtimeProgressPost():
    try:
        r.table("logs_rt_daily").insert(request.get_json()).run(app.rdb_conn)
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


# TODO:
# route to get summary progress of each user (req/res)
@app.route("/svc/progress/<userId>", methods=["GET"])
def get_summary_progress(userId):
    try:
        progressList = list(r.table("logs_summary").get_all(userId, index="userId").run(app.rdb_conn))
        # print(progressList)
        return Response(json.dumps(progressList), status=200, content_type="application/json")
    except RqlError as e:
        return Response(json.dumps({"message": "Error occurred!", "error": e.message}), status=500, content_type="application/json")
    finally:
        app.rdb_conn.close()


if __name__ == "__main__":
    app.run()