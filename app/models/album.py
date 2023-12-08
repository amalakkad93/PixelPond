from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from icecream import ic
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User


class Album(db.Model):
    __tablename__ = 'albums'
    def add_prefix_for_prod(attr):
        if environment == "production":
            return f"{SCHEMA}.{attr}"
        else:
            return attr

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    # post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id'), ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        user = User.query.get(self.user_id)
        ic(user)
        return {
            'id': self.id,
            'user_id': self.user_id,
            # 'post_id': self.post_id,
            'title': self.title,
            'username': user.username if user else None,
            'first_name': user.first_name if user else None,
            'last_name': user.last_name if user else None,
            'profile_picture': user.profile_picture if user else None,
        }