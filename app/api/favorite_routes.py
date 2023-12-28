# from flask import Blueprint, request
# from ..models import Favorite, db
# from flask_login import login_required, current_user

# from datetime import date
# from .auth_routes import validation_errors_to_error_messages

# favorite_routes = Blueprint('favorites', __name__)


# @favorite_routes.route('/<int:id>', methods=["POST"])
# @login_required
# def create_favorite(id):

#     new_form = Favorite(
#         user_id = current_user.id,
#         post_id = id,
#         created_at = date.today()
#     )

#     db.session.add(new_form)
#     db.session.commit()
#     return new_form.to_dict()



# @favorite_routes.route('/delete/<int:id>', methods=['DELETE'])
# @login_required
# def delete_favorite(id):
#     fave_to_delete = Favorite.query.get(id)

#     if (fave_to_delete):

#         db.session.delete(fave_to_delete)
#         db.session.commit()
#         return {"message": "Favorite Deleted!"}
#     else:
#         return {'errors': "No favorite to delete"}


# @favorite_routes.route('/')
# def get_all_favorites():
#     favorites = Favorite.query.all()

#     return [favorite.to_dict() for favorite in favorites]


















from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Favorite, db
from .. import helper_functions as hf
from icecream import ic

favorite_routes = Blueprint('favorites', __name__)

# ***************************************************************
# Endpoint to Create or Delete a Favorite
# ***************************************************************
@favorite_routes.route('', methods=['POST'])
def create_or_delete_favorite():
    data = request.json
    if not data.get('user_id') or not data.get('post_id'):
        return {"error": "Missing required fields"}, 400

    user_id = data['user_id']
    post_id = data['post_id']

    existing_favorite = Favorite.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_favorite:
        try:
            db.session.delete(existing_favorite)
            db.session.commit()
            return {"action": "removed", "favorite": existing_favorite.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": f"Favorite deletion failed: {str(e)}"}, 500

    new_favorite = Favorite(
        user_id=user_id,
        post_id=post_id
    )

    try:
        db.session.add(new_favorite)
        db.session.commit()
        return {"action": "added", "favorite": new_favorite.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"error": f"Favorite creation failed: {str(e)}"}, 500


# ***************************************************************
# Endpoint to Retrieve All Favorites for a User
# ***************************************************************
@favorite_routes.route('/')
def get_favorites():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify(error="User ID is required"), 400

    favorites = Favorite.query.filter_by(user_id=user_id).all()
    ic(favorites)
    results = [favorite.to_dict() for favorite in favorites]
    ic(results)
    return jsonify(results)
    # return jsonify([favorite.to_dict() for favorite in favorites])


# ***************************************************************
# Endpoint to Check if a Favorite Exists
# ***************************************************************
@favorite_routes.route('/check', methods=['GET'])
def check_favorite():
    user_id = request.args.get('user_id')
    post_id = request.args.get('post_id')

    favorite = Favorite.query.filter_by(user_id=user_id, post_id=post_id).first()

    if favorite:
        return {"exists": True}
    else:
        return {"exists": False}
