import os
import logging
import boto3

logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    S3_BUCKET = os.environ.get('S3_BUCKET')
    S3_KEY = os.environ.get('S3_KEY')
    S3_SECRET = os.environ.get('S3_SECRET')
    S3_LOCATION = f"https://{S3_BUCKET}.s3.amazonaws.com/"
    S3_CLIENT = boto3.client("s3", aws_access_key_id=S3_KEY, aws_secret_access_key=S3_SECRET)

    CLIENT_ID = os.environ.get('CLIENT_ID')
    CLIENT_SECRET = os.environ.get('CLIENT_SECRET')
    BASE_URL = os.environ.get('BASE_URL')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL').replace('postgres://', 'postgresql://')
    SQLALCHEMY_ECHO = True
