from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Favorite, db
from .. import helper_functions as hf

favorite_routes = Blueprint('favorites', __name__)

# ***************************************************************
# Endpoint to Get All Favorites
# ***************************************************************
@favorite_routes.route('/')
def get_all_favorites():
    try:
        favorites = db.session.query(Favorite).all()
        return jsonify([favorite.to_dict() for favorite in favorites])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the favorites."}), 500

# ***************************************************************
# Endpoint to Get Favorites of Current User
# ***************************************************************
@favorite_routes.route('/current')
def get_favorites_of_current_user():
    try:
        favorites = (db.session.query(Favorite)
                     .filter(Favorite.owner_id == current_user.id)
                     .all())
        return jsonify([favorite.to_dict() for favorite in favorites])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the favorites."}), 500

# ***************************************************************
# Endpoint to Get Details of a Favorite by Id
# ***************************************************************
@favorite_routes.route('/<int:id>')
def get_favorite_detail(id):
    try:
        favorite = Favorite.query.get(id)
        if favorite is None:
            return jsonify({"error": "Favorite not found."}), 404
        return jsonify(favorite.to_dict())
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching favorite detail."}), 500

# ***************************************************************
# Endpoint to Edit a Favorite
# ***************************************************************
@favorite_routes.route('/<int:id>', methods=["PUT"])
def update_favorite(id):
    try:
        favorite_to_update = Favorite.query.get(id)
        if favorite_to_update is None:
            return jsonify({"error": "Favorite not found."}), 404

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        if favorite_to_update.owner_id != current_user.id:
            return jsonify(message="Unauthorized"), 403

        data = request.get_json()
        for key, value in data.items():
            setattr(favorite_to_update, key, value)

        db.session.commit()
        return jsonify(favorite_to_update.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the favorite."}), 500

# ***************************************************************
# Endpoint to Create a Favorite
# ***************************************************************
@favorite_routes.route('/', methods=["POST"])
def create_favorite():
    try:
        data = request.get_json()
        if not data:
            return jsonify(errors="Invalid data"), 400

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        new_favorite = Favorite(**data)
        new_favorite.owner_id = current_user.id

        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({
            "message": "Favorite successfully created",
            "favorite": new_favorite.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the favorite."}), 500

# ***************************************************************
# Endpoint to Delete a Favorite
# ***************************************************************
@favorite_routes.route('/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = Favorite.query.get(id)

    if not favorite:
        return jsonify(error="Favorite not found"), 404
    if current_user.id != favorite.owner_id:
        return jsonify(error="Unauthorized to delete this favorite"), 403

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify(message="Favorite deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error deleting favorite: {e}"), 500
