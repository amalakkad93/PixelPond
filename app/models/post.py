from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .image import Image
from .tag import Tag

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
    image_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('images.id'), ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        image = Image.query.get(self.image_id)
        image_url = image.url if image else None

        tags = Tag.query.filter(Tag.post_id == self.id).all()
        tag_list = [{'id': tag.id, 'name': tag.name} for tag in tags]

        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'image_id': self.image_id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'image_url': image_url,
            'tags': tag_list
        }
