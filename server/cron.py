from rethinkdb import r
from rethinkdb.errors import RqlError

# this script runs every midnight

HOST_DB = "172.31.29.127" # private IP

try:
    conn = r.connect(host=HOST_DB, port=28015, db="posedee")
except RqlError:
    print("No database connection could be established.")

curr = r.table("logs_rt_daily").run(conn) # get all daily data
for doc in curr:
    try:
        r.table("logs_summary").insert(doc).run(conn) # and insert into summary
    except RqlError:
        print("Error occurred when insert into summary")

try:
    r.table("logs_rt_daily").delete().run(conn) # delete all daily data
except RqlError:
    print("Error occurred when delete logs_rt_daily")


curr.close()
conn.close()