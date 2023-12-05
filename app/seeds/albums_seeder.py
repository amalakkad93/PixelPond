from app.models import db, Album, environment, SCHEMA
from sqlalchemy.sql import text

def seed_albums():

    album1 = Album(
        user_id=1,
        post_id=1,
        title='Vacation Photos'
    )

    album2 = Album(
        user_id=2,
        post_id=2,
        title='Family Gathering'
    )

    album3 = Album(
        user_id=3,
        post_id=3,  
        title='Best of 2023'
    )

    db.session.add(album1)
    db.session.add(album2)
    db.session.add(album3)
    db.session.commit()

def undo_albums():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM albums"))

    db.session.commit()
