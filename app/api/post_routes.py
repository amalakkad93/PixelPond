from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Post, db

post_routes = Blueprint('posts', __name__)

# ***************************************************************
# Endpoint to Get All Posts
# ***************************************************************
@post_routes.route('/')
def get_all_posts():
    try:
        posts = db.session.query(Post).all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the posts."}), 500

# ***************************************************************
# Endpoint to Get Posts of Current User
# ***************************************************************
@post_routes.route('/current')
def get_posts_of_current_user():
    try:
        posts = (db.session.query(Post)
                     .filter(Post.owner_id == current_user.id)
                     .all())
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the posts."}), 500

# ***************************************************************
# Endpoint to Get Details of a Post by Id
# ***************************************************************
@post_routes.route('/<int:id>')
def get_post_detail(id):
    try:
        post = Post.query.get(id)
        if post is None:
            return jsonify({"error": "Post not found."}), 404
        return jsonify(post.to_dict())
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching post detail."}), 500

# ***************************************************************
# Endpoint to Edit a Post
# ***************************************************************
@post_routes.route('/<int:id>', methods=["PUT"])
def update_post(id):
    try:
        post_to_update = Post.query.get(id)
        if post_to_update is None:
            return jsonify({"error": "Post not found."}), 404

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        if post_to_update.owner_id != current_user.id:
            return jsonify(message="Unauthorized"), 403

        data = request.get_json()
        for key, value in data.items():
            setattr(post_to_update, key, value)

        db.session.commit()
        return jsonify(post_to_update.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the post."}), 500

# ***************************************************************
# Endpoint to Create a Post
# ***************************************************************
@post_routes.route('/', methods=["POST"])
def create_post():
    try:
        data = request.get_json()
        if not data:
            return jsonify(errors="Invalid data"), 400

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        new_post = Post(**data)
        new_post.owner_id = current_user.id

        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            "message": "Post successfully created",
            "post": new_post.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the post."}), 500

# ***************************************************************
# Endpoint to Delete a Post
# ***************************************************************
@post_routes.route('/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = Post.query.get(id)

    if not post:
        return jsonify(error="Post not found"), 404
    if current_user.id != post.owner_id:
        return jsonify(error="Unauthorized to delete this post"), 403

    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify(message="Post deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error deleting post: {e}"), 500
