from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod
from ..helper_functions import format_review_date

class Comment(db.Model):
    __tablename__ = 'comments'
    def add_prefix_for_prod(attr):
        if environment == "production":
            return f"{SCHEMA}.{attr}"
        else:
            return attr
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id'), ondelete='CASCADE'), nullable=False)
    comment = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id'), ondelete='CASCADE'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'created_at_display': format_review_date(self.created_at),
            'updated_at': format_review_date(self.updated_at),

        }
