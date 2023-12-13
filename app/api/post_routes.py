from flask import Blueprint, jsonify, request, current_app
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from http import HTTPStatus
from app.models import Post, User, Image, Comment, db
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
        posts_query = Post.query
        paginated_posts = hf.paginate_query(posts_query, 'posts')

        # Add user information to each post
        for post in paginated_posts['posts']:
            user = User.query.get(post['owner_id'])
            if user:
                post['user_info'] = user.to_dict()
            else:
                post['user_info'] = None

        return jsonify(paginated_posts)
    except Exception as e:
        logging.error(f"Error fetching all posts: {e}")
        return jsonify({"error": str(e)}), 500

# ***************************************************************
# Endpoint to Get Posts of Current User
# ***************************************************************
@post_routes.route('/current')
@login_required
def get_posts_of_current_user():
    """
    Retrieve posts created by the currently logged-in user with pagination.
    Returns:
        Response: A JSON object with user's posts or an error message.
    """
    try:
        paginated_result = hf.paginate_query(
            Post.query.filter(Post.owner_id == current_user.id)
        )
        return jsonify(paginated_result)
    except Exception as e:
        logging.error(f"Error fetching current user's posts: {e}")
        return jsonify({"error": "An error occurred while fetching the posts."}), 500

# ***************************************************************
# Endpoint to Get Posts by User ID
# ***************************************************************
@post_routes.route('/user/<int:user_id>')
def get_posts_by_user_id(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404

        posts_query = Post.query.filter(Post.owner_id == user_id)
        paginated_posts = hf.paginate_query(posts_query, 'user_posts')

        user_posts = []
        for post in paginated_posts['user_posts']:
            if isinstance(post, Post):
                post_dict = post.to_dict()
            else:
                post_dict = post

            user_posts.append(post_dict)

        result = {
            "user_info": user.to_dict(),
            "user_posts": user_posts,
            "total_items": paginated_posts['total_items'],
            "total_pages": paginated_posts['total_pages'],
            "current_page": paginated_posts['current_page']
        }
        ic(result)
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error fetching posts for user (ID: {user_id}): {e}")
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
        if not post:
            return jsonify({"error": "Post not found."}), 404

        user = User.query.get(post.owner_id)
        if user:
            post_info = post.to_dict()
            post_info['user_info'] = user.to_dict()
        else:
            post_info = post.to_dict()
            post_info['user_info'] = None

        return jsonify(post_info)
    except Exception as e:
        logging.error(f"Error fetching post detail (ID: {id}): {e}")
        return jsonify({"error": "An error occurred while fetching post detail."}), 500

# ***************************************************************
# Endpoint to Get Next and Previous Post by Id
# ***************************************************************
# Helper functions to get next and previous post IDs
def get_next_post_id(current_post_id, user_id):
    next_post = Post.query.filter(
        Post.id > current_post_id, Post.owner_id == user_id
    ).order_by(Post.id.asc()).first()
    return next_post.id if next_post else None

def get_prev_post_id(current_post_id, user_id):
    prev_post = Post.query.filter(
        Post.id < current_post_id, Post.owner_id == user_id
    ).order_by(Post.id.desc()).first()
    return prev_post.id if prev_post else None

@post_routes.route('/<int:post_id>/neighbors/<int:user_id>')
def get_neighbor_posts(post_id, user_id):
    current_post = Post.query.get(post_id)
    if not current_post:
        return jsonify({"error": "Post not found"}), 404

    next_post_id = get_next_post_id(post_id, user_id)
    prev_post_id = get_prev_post_id(post_id, user_id)

    return jsonify({
        "next_post_id": next_post_id,
        "prev_post_id": prev_post_id
    })


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

# ***************************************************************
# Endpoint to Get Comments of a Post by Id with Pagination
# ***************************************************************
@post_routes.route('/<int:post_id>/comments')
def get_post_comments(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found."}), 404

        comments_query = Comment.query.filter(Comment.post_id == post_id)

        paginated_comments = hf.paginate_query(
            comments_query,
            'comments',
            process_item_callback=lambda comment, comment_dict: {
                **comment_dict,
                'user_info': User.query.get(comment.user_id).to_dict() if User.query.get(comment.user_id) else None
            }
        )

        return jsonify(paginated_comments)

    except Exception as e:
        logging.error(f"Error fetching comments for post (ID: {post_id}): {e}")
        return jsonify({"error": "An error occurred while fetching the comments."}), 500

# ***************************************************************
# Endpoint to Create a Comment for a Post
# ***************************************************************

@post_routes.route('/<int:post_id>/comments', methods=['POST'])
@login_required
def create_comment(post_id):
    data = request.get_json()
    current_app.logger.info(f"Received data: {data}")

    comment_text = data.get('comment')
    if not comment_text:
        return jsonify({"error": "Comment text is required"}), 400

    comment = Comment(
        user_id=current_user.id,  
        post_id=post_id,
        comment=comment_text
    )
    db.session.add(comment)
    try:
        db.session.commit()
        return comment.to_dict(), 201
    except Exception as e:
        current_app.logger.error(f"Error saving comment: {e}")
        return jsonify({"error": "An error occurred while saving the comment"}), 500







# ***************************************************************
# Endpoint to Edit a Comment for a Post
# ***************************************************************
@post_routes.route('/comments/<int:comment_id>', methods=['PUT'])
@login_required
def edit_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if comment and comment.user_id == current_user.id:
        data = request.json
        comment.comment = data['comment']
        db.session.commit()
        return jsonify(comment.to_dict()), 200
    else:
        return jsonify({"error": "Comment not found or unauthorized"}), 404
