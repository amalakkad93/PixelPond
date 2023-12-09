from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .image import Image

class Post(db.Model):
    __tablename__ = 'posts'
    def add_prefix_for_prod(attr):
        if environment == "production":
            return f"{SCHEMA}.{attr}"
        else:
            return attr

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('albums.id'), ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    # photo_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        owner = User.query.get(self.owner_id)
        images = Image.query.filter(Image.post_id == self.id).all()
        photo_urls = [image.url for image in images]
        banner_url = photo_urls[0] if photo_urls else None
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'username': owner.username if owner else None,
            'first_name': owner.first_name if owner else None,
            'last_name': owner.last_name if owner else None,
            'profile_picture': owner.profile_picture if owner else None,
            'album_id': self.album_id,
            'title': self.title,
            'photo_urls': photo_urls,
            'description': self.description,
            'banner_url': banner_url,
            'about_me': owner.about_me if owner else None,
            'country': owner.country if owner else None,
            'created_at': self.created_at.isoformat(),
        }
