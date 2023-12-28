from flask import Blueprint, jsonify, request, current_app
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from http import HTTPStatus
from app.models import Post, User, Image, Comment, Album, PostAlbum, Tag, db
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
        paginated_posts = hf.paginate_query(posts_query, 'posts', process_item_callback=lambda post, _: post.to_dict())

        owner_ids = set(post['owner_id'] for post in paginated_posts['posts'])

        users = User.query.filter(User.id.in_(owner_ids)).all()
        users_dict = {user.id: user.to_dict() for user in users}

        for post in paginated_posts['posts']:
            post['user_info'] = users_dict.get(post['owner_id'])

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
        user = User.query.get(current_user.id)
        user_info = user.to_dict() if user else None

        user_posts_query = Post.query.filter(Post.owner_id == current_user.id)
        paginated_posts = hf.paginate_query(user_posts_query, 'posts')

        return jsonify({
            'user_info': user_info,
            'posts': paginated_posts
        })
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the posts."}), 500

# ***************************************************************
# Endpoint to Get Posts by User ID
# ***************************************************************
@post_routes.route('/user/<int:user_id>')
def get_posts_by_user_id(user_id):
    try:
        # Fetch user
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404

        user_info = user.to_dict()

        posts_query = Post.query.filter(Post.owner_id == user_id)

        image_ids = [post.image_id for post in posts_query]
        images = Image.query.filter(Image.id.in_(image_ids)).all()
        image_url_map = {image.id: image.url for image in images}

        def process_post(post, _):
            post_dict = post.to_dict()
            post_dict['image_url'] = image_url_map.get(post.image_id)
            return post_dict

        paginated_posts = hf.paginate_query(
            posts_query,
            'user_posts',
            process_item_callback=process_post
        )

        return jsonify({
            "user_info": user_info,
            "user_posts": paginated_posts['user_posts'],
            "total_items": paginated_posts['total_items'],
            "total_pages": paginated_posts['total_pages'],
            "current_page": paginated_posts['current_page']
        })

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
        post_info = post.to_dict()
        post_info['user_info'] = user.to_dict() if user else None

        return jsonify(post_info)
    except Exception as e:
        logging.error(f"Error fetching post detail (ID: {id}): {e}")
        return jsonify({"error": "An error occurred while fetching post detail."}), 500

# ***************************************************************
# Endpoint to Get Next and Previous Post by Id
# ***************************************************************
@post_routes.route('/<int:post_id>/neighbors/<int:user_id>')
def get_neighbor_posts(post_id, user_id):
    current_post = Post.query.get(post_id)
    if not current_post:
        return jsonify({"error": "Post not found"}), 404

    next_post_id = hf.get_next_post_id(post_id, user_id)
    prev_post_id = hf.get_prev_post_id(post_id, user_id)

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
        data = request.json
        title, description,image_url = data.get('title'), data.get('description', ''), data.get('image_url')

        if not title or not image_url:
            return jsonify({'error': 'Title and Image URL are required'}), 400

        # Create and commit the Image instance
        image = Image(url=image_url)
        db.session.add(image)
        db.session.commit()

        # Create the Post instance with the image_id
        post = Post(owner_id=current_user.id, title=title, description=description, image_id=image.id)
        db.session.add(post)
        db.session.commit()

        return jsonify(post.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in create_post: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

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
        if not post_to_update or post_to_update.owner_id != current_user.id:
            return jsonify({"error": "Post not found or unauthorized"}), 404

        data = request.get_json()
        for key, value in data.items():
            if key != 'image_url':
                setattr(post_to_update, key, value)

        # if 'image_url' in data:
        if 'image_url' in data and data['image_url']:
            image_to_update = Image.query.get(post_to_update.image_id)
            if image_to_update:
                image_to_update.url = data['image_url']
            else:
                new_image = Image(url=data['image_url'])
                db.session.add(new_image)
                db.session.flush()
                post_to_update.image_id = new_image.id

        db.session.commit()
        return jsonify(post_to_update.to_dict())
    except Exception as e:
        logging.error(f"Error updating post (ID: {id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the post."}), 500

# ***************************************************************
# Endpoint to Add a Post to an Album
# ***************************************************************
@post_routes.route('/<int:post_id>/add-to-album/<int:album_id>', methods=["PUT"])
@login_required
def add_post_to_album(post_id, album_id):
    """
    Add a post to an album. Accessible only by the post owner.
    Parameters:
        - post_id (int): The ID of the post to add to the album.
        - album_id (int): The ID of the album to add the post to.
    Returns:
        Response: A JSON object with the updated post or an error message.
    """
    try:
        post = Post.query.get(post_id)
        if not post or post.owner_id != current_user.id:
            return jsonify({"error": "Post not found or unauthorized"}), 404

        album = Album.query.get(album_id)
        if not album or album.user_id != current_user.id:
            return jsonify({"error": "Album not found or unauthorized"}), 404

        # Create a new PostAlbum association
        new_post_album = PostAlbum(post_id=post_id, album_id=album_id)
        db.session.add(new_post_album)
        db.session.commit()

        return jsonify(post.to_dict())
    except Exception as e:
        logging.error(f"Error adding post (ID: {post_id}) to album (ID: {album_id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while adding the post to the album."}), 500


# ***************************************************************
# Endpoint to Remove a Post from an Album
# ***************************************************************
@post_routes.route('/<int:post_id>/remove-from-album/<int:album_id>', methods=["PUT"])
@login_required
def remove_post_from_album(post_id, album_id):
    """
    Remove a post from an album. Accessible only by the post owner.
    Parameters:
        - post_id (int): The ID of the post to remove from the album.
        - album_id (int): The ID of the album to remove the post from.
    Returns:
        Response: A JSON object with the updated post or an error message.
    """
    try:
        post_album = PostAlbum.query.filter_by(post_id=post_id, album_id=album_id).first()
        if not post_album:
            return jsonify({"error": "Post not found in specified album"}), 404

        # Fetch the post directly using post_id
        post = Post.query.get(post_id)
        if not post or post.owner_id != current_user.id:
            return jsonify({"error": "Unauthorized access"}), 403

        db.session.delete(post_album)
        db.session.commit()

        return jsonify({"message": "Post removed from album successfully"})
    except Exception as e:
        logging.error(f"Error removing post (ID: {post_id}) from album (ID: {album_id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while removing the post from the album."}), 500



# ***************************************************************
# Endpoint to Get a Post Not in Album for the Logged-In User
# ***************************************************************
@post_routes.route('/user/<int:user_id>/not-in-album')
@login_required
def get_user_posts_not_in_album(user_id):
    if current_user.id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    try:
        posts_query = Post.query.join(PostAlbum, Post.id == PostAlbum.post_id, isouter=True)\
                                .filter(Post.owner_id == user_id, PostAlbum.id.is_(None))

        image_ids = [post.image_id for post in posts_query]
        images = Image.query.filter(Image.id.in_(image_ids)).all()
        image_url_map = {image.id: image.url for image in images}

        def process_post(post, _):
            post_dict = post.to_dict()
            post_dict['image_url'] = image_url_map.get(post.image_id)
            return post_dict

        paginated_posts = hf.paginate_query(
            posts_query,
            'unassigned_user_posts',
            process_item_callback=process_post
        )

        return jsonify({
            "user_info": current_user.to_dict(),
            "user_posts": paginated_posts['unassigned_user_posts'],
            "total_items": paginated_posts['total_items'],
            "total_pages": paginated_posts['total_pages'],
            "current_page": paginated_posts['current_page']
        })

    except Exception as e:
        logging.error(f"Error fetching unassigned posts for user (ID: {user_id}): {e}")
        return jsonify({"error": "An error occurred while fetching the unassigned posts."}), 500


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
        if not post or current_user.id != post.owner_id:
            return jsonify(error="Post not found or unauthorized"), 404

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

        paginated_comments = hf.paginate_query_desc(
            comments_query,
            'comments',
            sort_by='created_at',
            process_item_callback=lambda comment, comment_dict: {
                **comment_dict,
                'user_info': User.query.get(comment.user_id).to_dict() if User.query.get(comment.user_id) else None,
                'image_url': Image.query.get(comment.image_id).url if comment.image_id else None  # Add this line
            }
        )

        return jsonify(paginated_comments)

    except Exception as e:
        logging.error(f"Error fetching comments for post (ID: {post_id}): {e}")
        return jsonify({"error": "An error occurred while fetching the comments."}), 500

# ***************************************************************
# Endpoint to Get Comment Detail of a Post by Id and Comment Id
# ***************************************************************
@post_routes.route('/<int:post_id>/comments/<int:comment_id>', methods=['GET'])
def get_comment_detail(post_id, comment_id):
    try:
        comment = Comment.query.get(comment_id)
        if comment is None:
            return jsonify({"error": "Comment not found."}), 404
        return jsonify(comment.to_dict())
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching comment detail."}), 500


# ***************************************************************
# Endpoint to Create a Comment for a Post
# ***************************************************************
@post_routes.route('/<int:post_id>/comments', methods=['POST'])
@login_required
def create_comment(post_id):
    """
    Create a new comment for a post. Only accessible by authenticated users.
    Parameters:
        - post_id (int): The ID of the post to comment on.
    Returns:
        Response: A JSON object with the newly created comment details or an error message.
    """
    try:
        data = request.get_json()
        comment_text = data.get('comment')
        image_url = data.get('image_url')

        if not comment_text:
            return jsonify({'error': 'Comment text is required'}), 400

        image_id = None
        if image_url:
            new_image = Image(url=image_url)
            db.session.add(new_image)
            db.session.flush()
            image_id = new_image.id

        comment = Comment(user_id=current_user.id, post_id=post_id, comment=comment_text, image_id=image_id)
        db.session.add(comment)
        db.session.commit()

        return jsonify(comment.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error in create_comment: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ***************************************************************
# Endpoint to Edit a Comment for a Post
# ***************************************************************
@post_routes.route('/<int:post_id>/comments/<int:comment_id>', methods=['PUT'])
@login_required
def update_comment(post_id, comment_id):
    """
    Update a specific comment. Only accessible by the comment owner.
    Parameters:
        - post_id (int): The ID of the post to comment on.
        - comment_id (int): The ID of the comment to update.
    Returns:
        Response: A JSON object with the updated comment or an error message.
    """
    try:
        comment_to_update = Comment.query.get(comment_id)
        if not comment_to_update:
            return jsonify({"error": "Comment not found"}), 404

        if comment_to_update.post_id != post_id:
            return jsonify({"error": "Comment does not belong to the specified post"}), 400

        if comment_to_update.user_id != current_user.id:
            return jsonify({"error": "Unauthorized"}), 403

        data = request.get_json()
        for key, value in data.items():
            if key != 'image_url':
                setattr(comment_to_update, key, value)

        if 'image_url' in data and data['image_url']:
            image_to_update = Image.query.get(comment_to_update.image_id)
            if image_to_update:
                image_to_update.url = data['image_url']
            else:
                new_image = Image(url=data['image_url'])
                db.session.add(new_image)
                db.session.flush()
                comment_to_update.image_id = new_image.id

        db.session.commit()

        # Fetch user details
        user = User.query.get(comment_to_update.user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_info = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'age': user.age,
            'username': user.username,
            'email': user.email,
            'profile_picture': user.profile_picture,
            'about_me': user.about_me,
            'country': user.country,
        }

        response_data = comment_to_update.to_dict()
        response_data['user_info'] = user_info

        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"Error updating comment (ID: {comment_id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the comment."}), 500

# ***************************************************************
# Endpoint to Delete a Comment for a Post
# ***************************************************************
@post_routes.route('/<int:post_id>/comments/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(post_id, comment_id):
    """
    Delete a specific comment. Only accessible by the comment owner.
    Parameters:
        - post_id (int): The ID of the post the comment belongs to.
        - comment_id (int): The ID of the comment to delete.
    Returns:
        Response: A success message or an error message.
    """
    try:
        comment_to_delete = Comment.query.get(comment_id)

        # Check if the comment exists and belongs to the current user
        if not comment_to_delete:
            return jsonify({"error": "Comment not found"}), 404

        if comment_to_delete.post_id != post_id:
            return jsonify({"error": "Comment does not belong to the specified post"}), 400

        if comment_to_delete.user_id != current_user.id:
            return jsonify({"error": "Unauthorized"}), 403

        # Delete the comment
        db.session.delete(comment_to_delete)
        db.session.commit()

        return jsonify({"message": "Comment deleted successfully"}), 200
    except Exception as e:
        logging.error(f"Error deleting comment (ID: {comment_id}): {e}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while deleting the comment."}), 500

# ***************************************************************
# Endpoint to Get Tags of a Post by Id
# ***************************************************************
@post_routes.route('/posts/<int:post_id>/tags')
def get_tags_by_post(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found."}), 404

        tags = Tag.query.filter(Tag.post_id == post_id).all()
        tag_list = [{'id': tag.id, 'name': tag.name} for tag in tags]

        return jsonify({'tags': tag_list})
    except Exception as e:
        logging.error(f"Error fetching tags for post (ID: {post_id}): {e}")
        return jsonify({"error": str(e)}), 500

# ***************************************************************
# Endpoint to Get All Tags
# ***************************************************************
@post_routes.route('/tags')
def get_all_tags():
    try:
        tags = Tag.query.with_entities(Tag.name).distinct().all()
        tag_list = [tag.name for tag in tags]

        return jsonify({'tags': tag_list})
    except Exception as e:
        logging.error(f"Error fetching tags: {e}")
        return jsonify({"error": str(e)}), 500
