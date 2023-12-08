import logging
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Album, Image, Post, User, db
from icecream import ic
from .. import helper_functions as hf

# Set up logging to capture error messages and other logs.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

album_routes = Blueprint('albums', __name__)

# ***************************************************************
# Endpoint to Get All Albums
# ***************************************************************
@album_routes.route('')
def get_all_albums():
    try:
        albums_query = Album.query.order_by(Album.created_at.desc())
        result = hf.paginate_query(albums_query)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ***************************************************************
# Endpoint to Get Albums of Current User
# ***************************************************************
@album_routes.route('/current')
def get_albums_of_current_user():
    try:
        albums = (db.session.query(Album)
                     .filter(Album.owner_id == current_user.id)
                     .all())
        return jsonify([resource.to_dict() for resource in albums])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the albums."}), 500

# ***************************************************************
# Endpoint to Get Images of an Album with Pagination
# ***************************************************************
@album_routes.route('/<int:id>/images', methods=['GET'])
def get_album_images(id):
    try:
        # Retrieve the album by its ID with error handling
        album = Album.query.get(id)
        if not album:
            return jsonify({"error": "Album not found."}), 404

        # Query posts associated with the album
        album_posts = Post.query.filter_by(album_id=id).all()

        # Extract post IDs from the album_posts
        post_ids = [post.id for post in album_posts]

        # Query images associated with the album's posts
        album_images_query = Image.query.filter(Image.post_id.in_(post_ids))

        # Use your existing paginate_query function to paginate the images
        paginated_images = hf.paginate_query(album_images_query, 'images')

        # Retrieve user data
        user = User.query.get(album.user_id)
        user_info = {
            "username": user.username if user else None,
            "first_name": user.first_name if user else None,
            "last_name": user.last_name if user else None,
            "profile_picture": user.profile_picture if user else None,
        }
        # Construct the response dictionary
        response_data = {
            **paginated_images,
            "user_info": user_info,
        }
        ic(response_data)
        return jsonify(response_data)

    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error fetching album images: {str(e)}")

        # Return a user-friendly error response
        return jsonify({"error": "An error occurred while fetching album images."}), 500



# ***************************************************************
# Endpoint to Edit a Album
# ***************************************************************
@album_routes.route('/<int:id>', methods=["PUT"])
def update_album(id):
    try:
        resource_to_update = Album.query.get(id)
        if resource_to_update is None:
            return jsonify({"error": "Album not found."}), 404

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        if resource_to_update.owner_id != current_user.id:
            return jsonify(message="Unauthorized"), 403

        data = request.get_json()
        for key, value in data.items():
            setattr(resource_to_update, key, value)

        db.session.commit()
        return jsonify(resource_to_update.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the resource."}), 500

# ***************************************************************
# Endpoint to Create a Album
# ***************************************************************
@album_routes.route('', methods=["POST"])
def create_album():
    try:
        data = request.get_json()
        if not data:
            return jsonify(errors="Invalid data"), 400

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        new_album = Album(**data)
        new_album.owner_id = current_user.id

        db.session.add(new_album)
        db.session.commit()

        return jsonify({
            "message": "Album successfully created",
            "resource": new_album.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the resource."}), 500

# ***************************************************************
# Endpoint to Delete a Album
# ***************************************************************
@album_routes.route('/<int:id>', methods=['DELETE'])
def delete_album(id):
    resource = Album.query.get(id)

    if not resource:
        return jsonify(error="Album not found"), 404
    if current_user.id != resource.owner_id:
        return jsonify(error="Unauthorized to delete this resource"), 403

    try:
        db.session.delete(resource)
        db.session.commit()
        return jsonify(message="Album deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error deleting resource: {e}"), 500
