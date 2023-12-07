from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from http import HTTPStatus
from app.models import Post, User, db
from .. import helper_functions as hf
from icecream import ic
import requests
import logging

post_routes = Blueprint('posts', __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# ***************************************************************
# Endpoint to Get All Posts
# ***************************************************************


@post_routes.route('/all')
def get_all_posts():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        if page < 1 or per_page < 1:
            return jsonify({"error": "Invalid page or per_page values"}), 400

        pagination = Post.query.paginate(page=page, per_page=per_page, error_out=False)
        posts = [post.to_dict() for post in pagination.items]
        ic(posts)

        return jsonify({
            "posts": posts,
            "total_items": pagination.total,
            "total_pages": pagination.pages,
            "current_page": page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @post_routes.route('')
# def get_all_posts():
#     """
#     Retrieve all posts from the database.
#     Returns:
#         Response: A JSON object with all posts or an error message.
#     """
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)

#         if page < 1 or per_page < 1:
#             raise ValueError("Page number and per_page must be greater than 0")

#         pagination = Post.query.paginate(page=page, per_page=per_page, error_out=False)

#         all_posts_list = [post.to_dict() for post in pagination.items]
#         normalized_posts = hf.normalize(all_posts_list, 'id')

#         response = {
#             "posts": normalized_posts,
#             "total_items": pagination.total,
#             "total_pages": pagination.pages,
#             "current_page": page
#         }

#         return jsonify(response)

#     except SQLAlchemyError as e:
#         logger.error(f"SQLAlchemy error: {e}", extra={"page": page, "per_page": per_page})
#         return jsonify({"error": "Database query failed", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
#     except ValueError as e:
#         logger.error(f"Value error: {e}", extra={"page": page, "per_page": per_page})
#         return jsonify({"error": "Invalid input", "details": str(e)}), HTTPStatus.BAD_REQUEST
#     except KeyError as e:
#         logger.error(f"Key error in data normalization: {e}")
#         return jsonify({"error": "Key error in processing data", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
#     except Exception as e:
#         logger.error(f"Unexpected error: {e}")
#         return jsonify({"error": "An unexpected error occurred", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

# ***************************************************************
# Endpoint to Get Posts of Current User
# ***************************************************************
@post_routes.route('/current')
@login_required
def get_posts_of_current_user():
    """
    Retrieve posts created by the currently logged-in user.
    Returns:
        Response: A JSON object with user's posts or an error message.
    """
    try:
        posts = Post.query.filter(Post.owner_id == current_user.id).all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        logging.error(f"Error fetching current user's posts: {e}")
        return jsonify({"error": "An error occurred while fetching the posts."}), 500

# ***************************************************************
# Endpoint to Get Details of a Post by Id
# ***************************************************************
@post_routes.route('/<int:id>')
def get_post_detail(id):
    """
    Retrieve the details of a specific post by its ID.
    Parameters:
        - id (int): The ID of the post.
    Returns:
        Response: A JSON object with post details or an error message.
    """
    try:
        post = Post.query.get(id)
        ic(post)
        if not post:
            return jsonify({"error": "Post not found."}), 404
        return jsonify(post.to_dict())
    except Exception as e:
        logging.error(f"Error fetching post detail (ID: {id}): {e}")
        return jsonify({"error": "An error occurred while fetching post detail."}), 500

# ***************************************************************
# Endpoint to Create a Post
# ***************************************************************
@post_routes.route('', methods=["POST"])
@login_required
def create_post():
    """
    Create a new post. Only accessible by authenticated users.
    Returns:
        Response: A JSON object with the newly created post details or an error message.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify(errors="Invalid data"), 400

        new_post = Post(owner_id=current_user.id, **data)

        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            "message": "Post successfully created",
            "post": new_post.to_dict()
        }), 201
    except Exception as e:
        logging.error(f"Error creating a post: {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the post."}), 500

# ***************************************************************
# Endpoint to Edit a Post
# ***************************************************************
@post_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_post(id):
    """
    Update a specific post. Only accessible by the post owner.
    Parameters:
        - id (int): The ID of the post to update.
    Returns:
        Response: A JSON object with the updated post or an error message.
    """
    try:
        post_to_update = Post.query.get(id)
        if not post_to_update:
            return jsonify({"error": "Post not found."}), 404
        if post_to_update.owner_id != current_user.id:
            return jsonify(message="Unauthorized"), 403

        data = request.get_json()
        for key, value in data.items():
            setattr(post_to_update, key, value)

        db.session.commit()
        return jsonify(post_to_update.to_dict())
    except Exception as e:
        logging.error(f"Error updating post (ID: {id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the post."}), 500

# ***************************************************************
# Endpoint to Delete a Post
# ***************************************************************
@post_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    """
    Delete a specific post. Only accessible by the post owner.
    Parameters:
        - id (int): The ID of the post to delete.
    Returns:
        Response: A JSON message confirming deletion or an error message.
    """
    try:
        post = Post.query.get(id)

        if not post:
            return jsonify(error="Post not found"), 404
        if current_user.id != post.owner_id:
            return jsonify(error="Unauthorized to delete this post"), 403

        db.session.delete(post)
        db.session.commit()
        return jsonify(message="Post deleted successfully"), 200
    except Exception as e:
        logging.error(f"Error deleting post (ID: {id}): {e}")
        db.session.rollback()
        return jsonify(error=f"Error deleting post: {e}"), 500
