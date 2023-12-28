import os
import json
import logging
from tempfile import NamedTemporaryFile
import pathlib
import requests

from google.oauth2 import id_token
from google_auth_oauthlib.flow import InstalledAppFlow
from pip._vendor import cachecontrol
from google.auth.transport.requests import Request
import google.auth.transport.requests

from flask import Flask, Blueprint, jsonify, abort, redirect, request, current_app, session
from flask_login import current_user, login_user, logout_user, login_required
from flask_wtf.csrf import generate_csrf

from app.models import User, db
from app.forms import LoginForm, SignUpForm

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

google_auth_routes = Blueprint("google_auth", __name__)

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')
base_url = os.getenv('BASE_URL')
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages

def create_google_oauth_flow():
    try:

        if os.getenv('FLASK_ENV') == 'development':
            redirect_uri = "http://localhost:5000/api/auth/google"
            logger.info("Using development redirect URI")
        else:
            redirect_uri = f"{base_url}/api/auth/google"
            logger.info("Using production redirect URI")

        client_secrets = {
            "web": {
                "client_id": client_id,
                "project_id": "starcoeatsouth",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": client_secret,
                "redirect_uris": [
                   f"{base_url}/api/auth/google",
                    "http://localhost:5000/api/auth/google"
                ],
                "javascript_origins": ["http://localhost:3000"]
            }
        }
        return InstalledAppFlow.from_client_config(
            client_config=client_secrets,
            scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
            redirect_uri=redirect_uri
        )
    except Exception as e:
        logger.error("Error during OAuth flow creation", exc_info=True)
        raise e


@google_auth_routes.route("/oauth_login")
def oauth_login():
    try:
        flow = create_google_oauth_flow()
        authorization_url, state = flow.authorization_url()
        session["state"] = state
        print("Authorization URL: ", authorization_url)
        return redirect(authorization_url)
    except Exception as e:
        logger.error("Error during OAuth login", exc_info=True)
        return jsonify(error=str(e)), 500

@google_auth_routes.route("/google")
def callback():
    try:
        flow = create_google_oauth_flow()

        # Check the state parameter
        if 'state' not in session:
            raise ValueError("State not found in session")
        if session["state"] != request.args.get("state"):
            raise ValueError("State parameter mismatch")

        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        if not credentials:
            raise ValueError("No credentials returned from fetch_token")

        client_id = os.getenv('CLIENT_ID')
        if not client_id:
            raise ValueError("Client ID not found in environment")

        # Use the google.auth.transport.Request class
        id_info = id_token.verify_oauth2_token(credentials.id_token, Request(), client_id)

        if not id_info:
            raise ValueError("No ID info returned from token verification")

        # Storing user information in the session
        session["google_id"] = id_info.get("sub")
        session["name"] = id_info.get("name")

        # Extracting email and splitting name for database operations
        temp_email = id_info.get('email')
        if not temp_email:
            raise ValueError("No email found in ID info")

        split_name = session['name'].split(' ')
        first_name = split_name[0] if len(split_name) > 0 else ''
        last_name = split_name[1] if len(split_name) > 1 else ''

        # Check if the user exists in the database, and if not, create a new user
        user_exists = User.query.filter(User.email == temp_email).first()
        if not user_exists:
            user_exists = User(
                first_name=first_name,
                last_name=last_name,
                username=session['name'],
                email=temp_email,
                password='OAUTH'
            )
            db.session.add(user_exists)
            db.session.commit()

        login_user(user_exists)
        # Redirect based on environment
        if os.getenv('FLASK_ENV') == 'development':
            return redirect("http://localhost:5000")  # Redirect to the development frontend URL
        else:
            return redirect(current_app.config['BASE_URL'])  # Redirect to the production frontend URL
        # return redirect(current_app.config['BASE_URL'])

    except Exception as e:
        # More detailed error logging
        logger.error("Error during callback processing", exc_info=True)
        return jsonify(error=str(e)), 500
