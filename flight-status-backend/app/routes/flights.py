import logging
from flask import Blueprint, request, jsonify, current_app
from app.utils.decorators import token_required
from threading import Thread
import time

bp = Blueprint('flights', __name__)
logger = logging.getLogger(__name__)

def serialize_flight(flight):
    flight['_id'] = str(flight['_id'])
    return flight

@bp.route('/flights', methods=['GET'])
@token_required
def get_flights():
    db = current_app.db
    flights = db.flights.find()
    flight_list = [serialize_flight(flight) for flight in flights]
    return jsonify(flight_list), 200

def push_flight_update(socketio, flight_update):
    socketio.emit('flight_update', flight_update)
    logger.info("Pushed flight update: %s", flight_update)

def simulate_flight_update(socketio):
    while True:
        flight_update = {
            '_id': '12345',  # Example flight ID
            'flight_number': 'AA123',
            'status': 'Delayed',
            'departure': '2024-07-31T15:00:00Z',
            'arrival': '2024-07-31T18:00:00Z',
            'origin': 'JFK',
            'destination': 'LAX'
        }
        push_flight_update(socketio, flight_update)
        time.sleep(15)  # Simulate delay between updates

def start_simulation(socketio):
    thread = Thread(target=simulate_flight_update, args=(socketio,))
    thread.start()
