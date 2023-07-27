from pymongo import MongoClient
# from adafruit_pca9685 import PCA9685
# from adafruit_bo

mongodburl = "mongodb+srv://hdrproject:50230@cluster0.ktm1unb.mongodb.net/?retryWrites=true&w=majority"
try:
    client = MongoClient(mongodburl)
    print(client.get_database())
except Exception as e:
    print(f"err {e}")


# db = client["test"]
# collection = db["datas"]
# print(collection.find_one({"StudentName":13123}))
# print(db)