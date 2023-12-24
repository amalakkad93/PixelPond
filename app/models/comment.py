from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .image import Image
from .user import User
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
    image_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('images.id'), ondelete='CASCADE'), nullable=True)
    comment =  comment = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        image = Image.query.get(self.image_id)
        image_url = image.url if image else None
        # user = User.query.get(self.user_id)
        # user_info = {
        #     'id': user.id,
        #     'first_name': user.first_name,
        #     'last_name': user.last_name,
        #     'age': user.age,
        #     'username': user.username,
        #     'email': user.email,
        #     'profile_image_url': user.profile_image_url,
        #     'about_me': user.about_me,
        #     'country': user.country,
        # }
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'image_id': self.image_id,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'created_at_display': format_review_date(self.created_at),
            'updated_at': format_review_date(self.updated_at),
            'image_url': image_url,
            # 'user_info': user_info,
        }
