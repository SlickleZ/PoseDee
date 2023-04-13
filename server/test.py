import pandas as pd
import json

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
to_dataFrame()