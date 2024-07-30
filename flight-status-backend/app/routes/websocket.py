import logging
from flask_socketio import SocketIO, emit
from flask import current_app
from threading import Thread, Event
import time

logger = logging.getLogger(__name__)
simulation_thread = None
stop_event = Event()

def handle_websocket():
    logger.info("Client connected to WebSocket")

def on_disconnect():
    logger.info("Client disconnected from WebSocket")
    stop_event.set()
    logger.info("Stopped flight update simulation")

def send_initial_flight_data():
    db = current_app.db
    flights = db.flights.find()
    flight_list = [serialize_flight(flight) for flight in flights]
    emit('initial_flight_data', flight_list)
    logger.info("Sent initial flight data to client")

def serialize_flight(flight):
    flight['_id'] = str(flight['_id'])
    return flight

def simulate_flight_update(socketio, stop_event):
    while not stop_event.is_set():
        flight_update = {
            'flight_number': 'AA123',
            'status': 'Delayed',
            'gate': 'A5'
        }
        socketio.emit('flight_update', flight_update)
        logger.info("Pushed flight update: %s", flight_update)
        stop_event.wait(15)  # Wait for 15 seconds or until stop_event is set

def setup_socketio_events(socketio: SocketIO):
    @socketio.on('connect')
    def handle_connect():
        global simulation_thread, stop_event
        logger.info("WebSocket connected")
        send_initial_flight_data()
        stop_event.clear()
        simulation_thread = Thread(target=simulate_flight_update, args=(socketio, stop_event))
        simulation_thread.start()

    @socketio.on('disconnect')
    def handle_disconnect():
        global stop_event
        logger.info("WebSocket disconnected")
        stop_event.set()
