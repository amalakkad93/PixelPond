# FROM node:15-alpine3.10 as build
# COPY /react-app /react-app
# WORKDIR /react-app
# RUN npm install && CI=false && npm run build
# FROM python:3.9.18-alpine3.18
# RUN apk add build-base
# RUN apk add postgresql-dev gcc python3-dev musl-dev
# ARG FLASK_APP
# ARG FLASK_ENV
# ARG DATABASE_URL
# ARG REACT_APP_BASE_URL
# ARG SCHEMA
# ARG S3_BUCKET
# ARG S3_KEY
# ARG S3_SECRET
# WORKDIR /var/www
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# RUN pip install psycopg2
# COPY . .
# COPY --from=build /react-app /var/www/react-app/
# RUN flask db upgrade
# RUN flask seed all
# CMD gunicorn app:app
# Use a Node.js 15 Alpine image to build the React application
# Stage 1: Build the React application
FROM node:15-alpine3.10 as build
COPY /react-app /react-app
WORKDIR /react-app
RUN npm install && npm run build

# Stage 2: Set up the Python environment and copy the React build
FROM python:3.9.18-alpine3.18
# Install system dependencies required for psycopg2 and other packages
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev
# Set environment variables (ensure these are set before running the container or use ARG to pass build-time variables)
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV DATABASE_URL=sqlite:///dev.db
ENV REACT_APP_BASE_URL=https://pixelpond-rhct.onrender.com
ENV S3_BUCKET=flask3
ENV S3_KEY=AKIASQFSBNCP5PRK3BOT
ENV S3_SECRET=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
WORKDIR /var/www
# Copy the Python requirements file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
# Install psycopg2 or use psycopg2-binary for easier installation if suitable
RUN pip install psycopg2-binary
# Copy the entire project and the React build from the previous stage
COPY . .
COPY --from=build /react-app/build /var/www/react-app/build
# Run database migrations. This command might need adjustment based on how your application is set up.
RUN flask db upgrade
# Optionally, run a command to seed your database if needed
# RUN flask seed all
# The command to start your application, adjust as necessary
CMD ["gunicorn", "app:app"]
