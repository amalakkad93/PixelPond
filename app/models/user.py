from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
DEFAULT_PROFILE_PICTURE = "https://flask3.s3.amazonaws.com/profileImage1.png"

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=True)
    last_name = db.Column(db.String(255), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    about_me = db.Column(db.Text, nullable=True)
    country = db.Column(db.String(255), nullable=True)
    banner_picture = db.Column(db.String(500), nullable=True)
    DEFAULT_PROFILE_PICTURE = "https://flask3.s3.amazonaws.com/profileImage1.png"
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'age': self.age,
            'username': self.username,
            'email': self.email,
            'profile_picture': self.profile_picture if self.profile_picture else User.DEFAULT_PROFILE_PICTURE,
            'about_me': self.about_me,
            'country': self.country,
            'banner_picture': self.banner_picture,
        }
