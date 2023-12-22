from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func
from icecream import ic
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .image import Image
from .post import Post
from .post_album import PostAlbum


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
        album_images = []
        post_albums = PostAlbum.query.filter_by(album_id=self.id).all()

        for post_album in post_albums:
            post = Post.query.get(post_album.post_id)
            if post:
                image = Image.query.get(post.image_id)
                if image:
                    album_images.append({
                        'album_id': self.id,
                        'id': image.id,
                        'url': image.url,
                        'post_id': post.id
                    })
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'images': album_images
        }
    # def to_dict(self):
    #     posts = Post.query.filter_by(album_id=self.id).all()
    #     album_images = []
    #     for post in posts:
    #         image = Image.query.get(post.image_id)
    #         if image:
    #             album_images.append({
    #                 'album_id': self.id,
    #                 'id': image.id,
    #                 'url': image.url,
    #                 'post_id': post.id
    #             })

    #     return {
    #         'id': self.id,
    #         'user_id': self.user_id,
    #         'title': self.title,
    #         'images': album_images
    #     }
