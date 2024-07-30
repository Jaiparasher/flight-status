from functools import wraps
from flask import request, jsonify
from app.utils.auth import decode_jwt

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check if the token is in the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Get the token part

        # If no token is provided, return an error response
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        # Decode the JWT token
        user_id = decode_jwt(token)

        # If token is invalid or decoding fails, return an error response
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

        # Add the user_id to the request context for use in the view function
        request.user_id = user_id

        return f(*args, **kwargs)
    
    return decorated_function
