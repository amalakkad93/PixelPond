from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/update-profile-pic', methods=['PUT'])
@login_required
def update_profile_pic():
    user = User.query.get(current_user.id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    new_profile_pic_url = data.get('profile_picture')

    if new_profile_pic_url:
        user.profile_picture = new_profile_pic_url
        db.session.commit()
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"error": "No profile picture URL provided"}), 400
