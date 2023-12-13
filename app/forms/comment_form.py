from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Comment

class CommentForm(FlaskForm):
    # user_id = IntegerField('user_id', validators=[DataRequired()])
    # post_id = IntegerField('post_id', validators=[DataRequired()])
    comment = StringField('comment', validators=[DataRequired()])
