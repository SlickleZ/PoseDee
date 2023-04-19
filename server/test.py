import pandas as pd
from rethinkdb import r
from rethinkdb.errors import RqlError
import json
import datetime

HOST_DB = "172.31.29.127" # private IP

def to_dataFrame():
    msg = """[
        {
          "name": "keyron1",
          "age": 17
        },
        {
          "name": "keyron2",
          "age": 18
        },
        {
          "name": "keyron3",
          "age": 19
        },
        {
          "name": "keyron4",
          "age": 20
        }
    ]"""
    
    data = json.loads(msg)
    df = pd.DataFrame(data)
    print(df)
    
    
    apn = '{"name": "keyron5", "age": 21}'
    print()
    print(df._append(pd.DataFrame(json.loads(apn), index=[0]), ignore_index=True))


def wipeoutDB():
  try:
      conn = r.connect(host=HOST_DB, port=28015, db="posedee")
  except RqlError:
      print("No database connection could be established.")
      
  try:
      r.table("logs_rt_daily").delete().run(conn)
      r.table("logs_summary").delete().run(conn)
  except RqlError:
      print("Error occurred when delete")
  finally:
    conn.close()
      

def readAndInsert(table):
  try:
      conn = r.connect(host=HOST_DB, port=28015, db="posedee")
  except RqlError:
      print("No database connection could be established.")
  
  with open("MOCK_DATA.json") as fromFile:
      data = json.load(fromFile)
      for doc in data:
        neck = float(doc.get("neck_inclination"))
        torso = float(doc.get("torso_inclination"))
                
        # add necessary columns
        doc['Year'] = int(doc.get("Timestamp")[:4])
        doc['Month'] = int(doc.get("Timestamp")[5:7])
        doc['Day'] = int(doc.get("Timestamp")[8:10])
        doc["Day_Name"] = datetime.date(doc["Year"], doc["Month"], doc["Day"]).strftime("%A")
        doc["Week"] = datetime.date(doc["Year"], doc["Month"], doc["Day"]).isocalendar().week
        doc['Hour'] = int(doc.get("Timestamp")[11:13])
        doc['Minute'] = int(doc.get("Timestamp")[14:16])
        
        if (neck < 40 and torso > 10):
            doc["why_bad"] = "torso"
        elif (neck > 40 and torso < 10):
            doc["why_bad"] = "neck"
        elif (neck > 40 and torso > 10):
            doc["why_bad"] = "both"

        r.table(table).insert(doc).run(conn)
      conn.close()

readAndInsert("logs_rt_daily")