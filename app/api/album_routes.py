from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Album, Image, Post, User, PostAlbum, db
from icecream import ic
from .. import helper_functions as hf
import logging

# Set up logging to capture error messages and other logs.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

album_routes = Blueprint('albums', __name__)

# ***************************************************************
# Endpoint to Get All Albums
# ***************************************************************
# @album_routes.route('')
# def get_all_albums():
#     try:
#         albums_query = Album.query.order_by(Album.created_at.desc())
#         return jsonify(albums_query)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

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
# Endpoint to Get Albums of a Specific User
# ***************************************************************
@album_routes.route('/user/<int:user_id>')
def get_albums_by_user_id(user_id):
    """
    Retrieve albums created by a specific user.
    Parameters:
        - user_id (int): The ID of the user whose albums are to be retrieved.
    Returns:
        Response: A JSON object with the user's albums or an error message.
    """
    try:
        albums_query = Album.query.filter_by(user_id=user_id)
        albums_with_images = [album.to_dict() for album in albums_query]

        paginated_albums = hf.paginate_query(albums_with_images, 'albums', per_page_default=4, is_list=True)

        response_data = {
            "albums": paginated_albums['albums'],
            "total_albums": paginated_albums['total_items'],
            "total_pages": paginated_albums['total_pages'],
            "current_page": paginated_albums['current_page'],
            "per_page": paginated_albums['per_page']
        }
        return jsonify(response_data)
    except Exception as e:
        logging.error(f"Error fetching albums for user (ID: {user_id}): {e}")
        return jsonify({"error": "An error occurred while fetching the albums."}), 500

# ***************************************************************
# Endpoint to Get Images of an Album with Pagination
# ***************************************************************
@album_routes.route('/<int:id>', methods=['GET'])
def get_album_images(id):
    try:
        album = Album.query.get(id)
        if not album:
            return jsonify({"error": "Album not found."}), 404

        album_dict = album.to_dict()

        paginated_images = hf.paginate_query(album_dict['images'], 'images', is_list=True)
        response_data = {
            "user_id": album_dict.get("user_id"),
            "images": paginated_images['images'],
            "total_images": paginated_images['total_items'],
            "total_pages": paginated_images['total_pages'],
            "current_page": paginated_images['current_page']
        }

        return jsonify(response_data)
    except Exception as e:
        logger.error(f"Error fetching album images: {str(e)}")
        return jsonify({"error": "An error occurred while fetching album images."}), 500


# # ***************************************************************
# # Endpoint to Get Albums of a Specific User
# # ***************************************************************
# @album_routes.route('/user/<int:user_id>')
# def get_albums_by_user_id(user_id):
#     """
#     Retrieve albums created by a specific user.
#     Parameters:
#         - user_id (int): The ID of the user whose albums are to be retrieved.
#     Returns:
#         Response: A JSON object with the user's albums or an error message.
#     """
#     try:
#         albums_query = Album.query.filter_by(user_id=user_id)

#         albums_with_info_and_images = []
#         for album in albums_query:
#             album_dict = album.to_dict()
#             # album_info = {
#             #     "id": album_dict.get("id"),
#             #     "title": album_dict.get("title"),
#             #     "user_id": album_dict.get("user_id"),
#             #     "username": album_dict.get("username"),
#             #     "first_name": album_dict.get("first_name"),
#             #     "last_name": album_dict.get("last_name"),
#             #     "about_me": album_dict.get("about_me"),
#             #     "profile_picture": album_dict.get("profile_picture")
#             # }

#             # Directly use the images from the album_dict
#             images = album_dict['images']

#             # albums_with_info_and_images.append({"album_info": album_info, "images": images})
#             albums_with_info_and_images.append({"images": images})

#         paginated_albums = hf.paginate_query(albums_with_info_and_images, 'albums', is_list=True)

#         response_data = {
#             "albums": paginated_albums['albums'],
#             "total_albums": paginated_albums['total_items'],
#             "total_pages": paginated_albums['total_pages'],
#             "current_page": paginated_albums['current_page']
#         }
#         return jsonify(response_data)
#     except Exception as e:
#         logging.error(f"Error fetching albums for user (ID: {user_id}): {e}")
#         return jsonify({"error": "An error occurred while fetching the albums."}), 500

# # ***************************************************************
# # Endpoint to Get Images of an Album with Pagination
# # ***************************************************************
# @album_routes.route('/<int:id>', methods=['GET'])
# def get_album_images(id):
#     try:
#         album = Album.query.get(id)
#         if not album:
#             return jsonify({"error": "Album not found."}), 404

#         album_dict = album.to_dict()
#         # album_info = {
#         #     "about_me": album_dict.get("about_me"),
#         #     "first_name": album_dict.get("first_name"),
#         #     "id": album_dict.get("id"),
#         #     "last_name": album_dict.get("last_name"),
#         #     "profile_picture": album_dict.get("profile_picture"),
#         #     "title": album_dict.get("title"),
#         #     "user_id": album_dict.get("user_id"),
#         #     "username": album_dict.get("username")
#         # }

#         paginated_images = hf.paginate_query(album_dict['images'], 'images', is_list=True)
#         response_data = {
#             # "album_info": album_info,
#             "images": paginated_images['images'],
#             "total_images": paginated_images['total_items'],
#             "total_pages": paginated_images['total_pages'],
#             "current_page": paginated_images['current_page']
#         }

#         return jsonify(response_data)
#     except Exception as e:
#         logger.error(f"Error fetching album images: {str(e)}")
#         return jsonify({"error": "An error occurred while fetching album images."}), 500


# ***************************************************************
# Endpoint to Edit a Album
# ***************************************************************
# @album_routes.route('/<int:id>', methods=["PUT"])
# def update_album(id):
#     try:
#         resource_to_update = Album.query.get(id)
#         if resource_to_update is None:
#             return jsonify({"error": "Album not found."}), 404

#         if not current_user.is_authenticated:
#             return jsonify(message="You need to be logged in"), 401

#         if resource_to_update.owner_id != current_user.id:
#             return jsonify(message="Unauthorized"), 403

#         data = request.get_json()
#         for key, value in data.items():
#             setattr(resource_to_update, key, value)

#         db.session.commit()
#         return jsonify(resource_to_update.to_dict())
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": "An error occurred while updating the resource."}), 500
@album_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_album(id):
    """
    Update an existing album.
    Parameters:
        - id (int): The ID of the album to be updated.
    Returns:
        Response: JSON object with updated album data or an error message.
    """
    album = Album.query.get(id)
    if not album:
        return jsonify({"error": "Album not found"}), 404

    if album.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if 'title' in data:
        album.title = data['title']

    try:
        db.session.commit()
        return jsonify(album.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the album"}), 500

# ***************************************************************
# Endpoint to Create a Album
# ***************************************************************
@album_routes.route('', methods=["POST"])
@login_required
def create_album():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid data'}), 400

        if 'title' not in data or not data['title'].strip():
            return jsonify({'error': 'Title is required'}), 400

        new_album = Album(
            user_id=current_user.id,
            title=data['title']
        )

        db.session.add(new_album)
        db.session.commit()

        return jsonify(new_album.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in create_album: {e}")
        return jsonify({'error': 'An error occurred while creating the album.'}), 500

# ***************************************************************
# Endpoint to Delete a Album
# ***************************************************************
@album_routes.route('/<int:id>', methods=['DELETE'])
def delete_album(id):
    try:

        PostAlbum.query.filter_by(album_id=id).delete()

        album = Album.query.get(id)
        if not album:
            return jsonify(error="Album not found"), 404

        if current_user.id != album.user_id:
            return jsonify(error="Unauthorized to delete this resource"), 403

        db.session.delete(album)
        db.session.commit()
        return jsonify(message="Album deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error deleting album: {e}"), 500
