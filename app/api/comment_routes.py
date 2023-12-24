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
