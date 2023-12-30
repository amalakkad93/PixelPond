from flask import Blueprint, jsonify, request, current_app
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import func
from http import HTTPStatus
from app.models import Post, User, Image, Comment, Album, PostAlbum, Tag, PostTag, db
from .. import helper_functions as hf
from icecream import ic
import requests
import logging

tag_routes = Blueprint('tags', __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ***************************************************************
# Endpoint to Create a Tag
# ***************************************************************
@tag_routes.route('', methods=["POST"])
@login_required
def create_tag():
    try:
        data = request.get_json()
        tag_name = data.get('name')

        if not tag_name:
            return jsonify({'error': 'Tag name is required'}), 400

        tag = Tag.query.filter_by(name=tag_name).first()
        if tag:
            return jsonify({'error': 'Tag already exists'}), 409

        new_tag = Tag(name=tag_name)
        db.session.add(new_tag)
        db.session.commit()
        return jsonify(new_tag.to_dict()), 201
    except Exception as e:
        print(f"Error creating tag: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ***************************************************************
# Endpoint to Get All Tags
# ***************************************************************
@tag_routes.route('/<int:tag_id>', methods=["PUT"])
@login_required
def update_tag(tag_id):
    try:
        tag = Tag.query.get(tag_id)
        if not tag:
            return jsonify({"error": "Tag not found"}), 404

        data = request.get_json()
        new_name = data.get('name')
        if new_name:
            tag.name = new_name

        db.session.commit()
        return jsonify(tag.to_dict())
    except Exception as e:
        print(f"Error updating tag (ID: {tag_id}): {e}")
        return jsonify({"error": "An error occurred while updating the tag."}), 500
