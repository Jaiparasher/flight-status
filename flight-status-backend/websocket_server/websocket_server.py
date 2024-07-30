import sys
import os
import logging
from flask_socketio import SocketIO
from threading import Event
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.routes.websocket import simulate_flight_update

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure the root directory is in the Python path


# Create Flask app and SocketIO instance
app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

# Store the thread and stop event objects to stop the thread when the client disconnects
simulation_thread = None
stop_event = None

def handle_websocket():
    global simulation_thread, stop_event
    logger.info("Client connected to WebSocket")
    if simulation_thread is None:
        stop_event = Event()
        simulation_thread = socketio.start_background_task(simulate_flight_update, socketio, stop_event)
        logger.info("Started flight simulation thread")

def handle_disconnect():
    global simulation_thread, stop_event
    logger.info("Client disconnected from WebSocket")
    if simulation_thread is not None:
        stop_event.set()
        simulation_thread = None
        stop_event = None
        logger.info("Stopped flight simulation thread")

# Register WebSocket events
socketio.on_event('connect', handle_websocket)
socketio.on_event('disconnect', handle_disconnect)

if __name__ == '__main__':
    logger.info('Starting WebSocket server...')
    socketio.run(app, host='127.0.0.1', port=8001, debug=True)