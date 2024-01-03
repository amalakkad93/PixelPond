from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .image import Image
from .tag import Tag
from .post_tag import PostTag

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


        # post_tags = PostTag.query.filter(PostTag.post_id == self.id).all()
        # tag_list = [Tag.query.get(post_tag.tag_id).to_dict() for post_tag in post_tags if post_tag.tag_id]
        post_tags = PostTag.query.filter(PostTag.post_id == self.id).all()
        tag_ids = [post_tag.tag_id for post_tag in post_tags if post_tag.tag_id]
        tags = Tag.query.filter(Tag.id.in_(tag_ids)).all()
        tag_list = [tag.to_dict() for tag in tags]
        
        user = User.query.get(self.owner_id)
        user_info = user.to_dict() if user else {}
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'image_id': self.image_id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'image_url': image_url,
            'tags': tag_list,
            'user_info': user_info
        }
