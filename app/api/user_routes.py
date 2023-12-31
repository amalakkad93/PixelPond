from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from werkzeug.security import generate_password_hash
from sqlalchemy import or_, and_
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


@user_routes.route('/<int:id>/info')
def user_info(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


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

@user_routes.route('/update', methods=['PUT'])
@login_required
def update_user():
    data = request.json
    user = current_user

    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.profile_picture = data.get('profile_picture', user.profile_picture)
    user.about_me = data.get('about_me', user.about_me)
    user.country = data.get('country', user.country)
    user.banner_picture = data.get('banner_picture', user.banner_picture)

    if 'password' in data:
        hashed_password = generate_password_hash(data['password'])
        user.hashed_password = hashed_password

    db.session.commit()
    return jsonify(user.to_dict())


@user_routes.route('/search')
def search_users():
    search_term = request.args.get('query', '')

    # Split the search term into words to handle first name and last name separately
    search_words = search_term.split()

    # Construct the query based on the number of words in the search term
    if len(search_words) == 1:
        # If there's only one word, search it against both first and last names
        query = User.query.filter(
            or_(
                User.first_name.ilike(f'%{search_words[0]}%'),
                User.last_name.ilike(f'%{search_words[0]}%')
            )
        )
    elif len(search_words) >= 2:
        # If there are two or more words, use the first two for first and last names
        query = User.query.filter(
            or_(
                and_(User.first_name.ilike(f'%{search_words[0]}%'), User.last_name.ilike(f'%{search_words[1]}%')),
                and_(User.first_name.ilike(f'%{search_words[1]}%'), User.last_name.ilike(f'%{search_words[0]}%'))
            )
        )
    else:
        # If the search term is empty, return all users
        query = User.query

    users = query.all()
    return jsonify([user.to_dict() for user in users])
