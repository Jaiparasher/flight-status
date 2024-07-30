# app/models/flight.py
from pymongo import ASCENDING

def create_flight_collection(db):
    flights = db.flights
    flights.create_index([("flight_number", ASCENDING)])
    flights.create_index([("status.current_status", ASCENDING)])
    return flights
