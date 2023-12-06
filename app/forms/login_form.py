from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User

def user_exists(form, field):
    # Check if user exists by email or username
    user_input = field.data
    user = User.query.filter((User.email == user_input) | (User.username == user_input)).first()
    if not user:
        raise ValidationError('User not found.')

def password_matches(form, field):
    # Check if password matches
    password = field.data
    user_input = form.data['username_or_email']
    user = User.query.filter((User.email == user_input) | (User.username == user_input)).first()
    if not user:
        raise ValidationError('No such user exists.')
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')

class LoginForm(FlaskForm):
    username_or_email = StringField('username_or_email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), password_matches])

# from flask_wtf import FlaskForm
# from wtforms import StringField
# from wtforms.validators import DataRequired, Email, ValidationError
# from app.models import User


# def user_exists(form, field):
#     # Checking if user exists
#     email = field.data
#     user = User.query.filter(User.email == email).first()
#     if not user:
#         raise ValidationError('Email provided not found.')


# def password_matches(form, field):
#     # Checking if password matches
#     password = field.data
#     email = form.data['email']
#     user = User.query.filter(User.email == email).first()
#     if not user:
#         raise ValidationError('No such user exists.')
#     if not user.check_password(password):
#         raise ValidationError('Password was incorrect.')


# class LoginForm(FlaskForm):
#     email = StringField('email', validators=[DataRequired(), user_exists])
#     password = StringField('password', validators=[DataRequired(), password_matches])
