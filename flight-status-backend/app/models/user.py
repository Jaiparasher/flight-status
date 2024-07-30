# app/models/user.py
from pymongo import ASCENDING

def create_user_collection(db):
    users = db.users
    users.create_index([("email", ASCENDING)], unique=True)
    return users
