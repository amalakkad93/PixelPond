from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Post

class PostForm(FlaskForm):
    owner_id = IntegerField('owner_id', validators=[DataRequired()])
    album_id = IntegerField('album_id', validators=[DataRequired()])
    title = StringField('title', validators=[DataRequired()])
    photo_url = StringField('photo_url', validators=[DataRequired()])
    description = StringField('description')

