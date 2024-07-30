import os
import logging
from flask import Flask
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
from flask_cors import CORS
from flask_socketio import SocketIO
from .config import Config
from dotenv import load_dotenv

load_dotenv()

bcrypt = Bcrypt()
socketio = SocketIO()

def create_app():
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Log starting server
    logger.info("Starting Flask server...")

    client = MongoClient(app.config['MONGO_URI'])
    app.db = client.get_default_database()

    # Log database connection
    logger.info("Connected to MongoDB at %s", app.config['MONGO_URI'])

    # Initialize Flask extensions
    bcrypt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    app.socketio = socketio

    # Register Blueprints
    from .routes import auth, flights, user
    app.register_blueprint(auth.bp)
    app.register_blueprint(flights.bp)
    app.register_blueprint(user.bp)

    # Start the flight update simulation (if needed)
    from .routes.websocket import setup_socketio_events
    setup_socketio_events(socketio)
    

    return app
