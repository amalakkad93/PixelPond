# Import necessary modules
from app.models import db, Comment, environment, SCHEMA
from datetime import datetime
from random import randint, choice


def seed_comments():

    comments_data = [
        {'user_id': 2, 'post_id': 1, 'comment': 'Beautiful shot!'},
        {'user_id': 3, 'post_id': 1, 'comment': 'Amazing!'},
        {'user_id': 4, 'post_id': 1, 'comment': 'So beautiful!'},
    ]


    for comment_data in comments_data:
        comment = Comment(
            user_id=comment_data['user_id'],
            post_id=comment_data['post_id'],
            comment=comment_data['comment'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(comment)

    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM comments")
    db.session.commit()
