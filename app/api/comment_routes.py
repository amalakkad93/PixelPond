from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from app.models import Comment, db
from .. import helper_functions as hf

comment_routes = Blueprint('comments', __name__)

# *******************************Get All Comments*******************************
@comment_routes.route('/')
def get_all_comment():
    try:
        comments = db.session.query(Comment).all()
        return jsonify([comment.to_dict() for comment in comments])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the comments."}), 500

# *******************************Get Comments of Current User*******************************
@comment_routes.route('/current')
def get_comment_of_current_user():
    try:
        comments = (db.session.query(Comment)
                     .filter(Comment.owner_id == current_user.id)
                     .all())
        return jsonify([comment.to_dict() for comment in comments])
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the comments."}), 500

# *******************************Get Details of a Comment by Id*******************************
@comment_routes.route('/<int:id>')
def get_comment_detail(id):
    try:
        comment = Comment.query.get(id)
        if comment is None:
            return jsonify({"error": "Comment not found."}), 404
        return jsonify(comment.to_dict())
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching comment detail."}), 500

# *******************************Edit a Comment*******************************
@comment_routes.route('/<int:id>', methods=["PUT"])
def update_comment(id):
    try:
        comment_to_update = Comment.query.get(id)
        if comment_to_update is None:
            return jsonify({"error": "Comment not found."}), 404

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        if comment_to_update.owner_id != current_user.id:
            return jsonify(message="Unauthorized"), 403

        data = request.get_json()
        for key, value in data.items():
            setattr(comment_to_update, key, value)

        db.session.commit()
        return jsonify(comment_to_update.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the comment."}), 500

# *******************************Create a Comment*******************************
@comment_routes.route('/', methods=["POST"])
def create_comment():
    try:
        data = request.get_json()
        if not data:
            return jsonify(errors="Invalid data"), 400

        if not current_user.is_authenticated:
            return jsonify(message="You need to be logged in"), 401

        new_comment = Comment(**data)
        new_comment.owner_id = current_user.id

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "message": "Comment successfully created",
            "comment": new_comment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the comment."}), 500

# *******************************Delete a Comment*******************************
@comment_routes.route('/<int:id>', methods=['DELETE'])
def delete_comment(id):
    comment = Comment.query.get(id)

    if not comment:
        return jsonify(error="Comment not found"), 404
    if current_user.id != comment.owner_id:
        return jsonify(error="Unauthorized to delete this comment"), 403

    try:
        db.session.delete(comment)
        db.session.commit()
        return jsonify(message="Comment deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error deleting comment: {e}"), 500
