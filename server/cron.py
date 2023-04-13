from rethinkdb import r
from rethinkdb.errors import RqlError

HOST_DB = "172.31.29.127" # private IP

try:
    conn = r.connect(host=HOST_DB, port=28015, db="posedee")
except RqlError:
    print("No database connection could be established.")


curr = r.table("logs_rt_daily").run(conn)
for doc in curr:
    try:
        doc['year'] = int(doc.get("timestamp")[:4])
        doc['month'] = int(doc.get("timestamp")[5:7])
        doc['day'] = int(doc.get("timestamp")[8:10])
        
        r.table("logs_summary").insert(doc).run(conn)
    except RqlError:
        print("Error occurred when insert into summary")


try:
    r.table("logs_rt_daily").delete().run(conn)
except RqlError:
    print("Error occurred when delete logs_rt_daily")


curr.close()
conn.close()