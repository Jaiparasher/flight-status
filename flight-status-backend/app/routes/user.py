import logging
from flask import Blueprint, request, jsonify, current_app
from app.utils.auth import decode_jwt
from app.utils.decorators import token_required
from bson.objectid import ObjectId

bp = Blueprint('user', __name__)
logger = logging.getLogger(__name__)

@bp.route('/me', methods=['GET'])
@token_required
def get_user_info():
    token = request.headers.get('Authorization').split(" ")[1]
    
    user_id = decode_jwt(token)
    logger.info(user_id)
    user_id = ObjectId(user_id)
    if not user_id:
        logger.warning("Failed to fetch user info: Invalid token")
        return jsonify({"error": "Invalid token"}), 401

    db = current_app.db
    users = db.users
    user = users.find_one({"_id": user_id}, {"password_hash": 0})  # Exclude password_hash from response

    if not user:
        logger.warning("Failed to fetch user info: User not found")
        return jsonify({"error": "User not found"}), 404

    user['_id'] = str(user['_id'])
    return jsonify(user), 200
