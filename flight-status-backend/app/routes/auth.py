import logging
from flask import Blueprint, request, jsonify, current_app
from app.utils.auth import generate_jwt, verify_password, hash_password

bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    flight_ref_id = data.get('flight_ref_id')

    if not all([full_name, email, password]):
        logger.warning("Registration failed: Full name, email, and password are required")
        return jsonify({"error": "Full name, email, and password are required"}), 400

    db = current_app.db
    users = db.users

    if users.find_one({"email": email}):
        logger.warning("Registration failed: User already exists with email %s", email)
        return jsonify({"error": "User already exists"}), 400

    hashed_password = hash_password(password)
    users.insert_one({
        "full_name": full_name,
        "email": email,
        "password_hash": hashed_password,
        "flight_ref_id": flight_ref_id
    })

    logger.info("User registered successfully with email %s", email)
    return jsonify({"message": "User registered successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        logger.warning("Login failed: Email and password are required")
        return jsonify({"error": "Email and password are required"}), 400

    db = current_app.db
    users = db.users
    user = users.find_one({"email": email})

    if not user or not verify_password(password, user['password_hash']):
        logger.warning("Login failed: Invalid credentials for email %s", email)
        return jsonify({"error": "Invalid credentials"}), 400

    token = generate_jwt(user['_id'])
    logger.info("User logged in successfully with email %s", email)
    return jsonify({"token": token}), 200
