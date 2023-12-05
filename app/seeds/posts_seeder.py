from app.models import db, User, Post, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_posts():

    post1 = Post(
        owner_id=1,
        album_id=1,
        title='First Post',
        photo_url='https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg',
        description='This is the first post',
        created_at=datetime.utcnow()
    )

    post2 = Post(
        owner_id=2,
        album_id=1,
        title='Second Post',
        photo_url='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1025px-Cat03.jpg',
        description='This is the second post',
        created_at=datetime.utcnow()
    )

    post3 = Post(
        owner_id=3,
        album_id=1,
        title='Third Post',
        photo_url='https://sample-videos.com/img/Sample-jpg-image-10mb.jpg',
        description='This is the third post',
        created_at=datetime.utcnow()
    )

    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
