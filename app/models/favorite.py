from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Favorite(db.Model):
    __tablename__ = 'favorites'
    def add_prefix_for_prod(attr):
        if environment == "production":
            return f"{SCHEMA}.{attr}"
        else:
            return attr

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id'), ondelete='CASCADE'), primary_key=True)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'post_id': self.post_id,
        }
