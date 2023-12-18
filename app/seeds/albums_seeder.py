from app.models import db, Album, environment, SCHEMA
from sqlalchemy.sql import text

def seed_albums():
    albums = [
        Album(user_id=1, title='Nature and Flowers'),
        Album(user_id=1, title='Cat Collection'),
        Album(user_id=2, title='Scenic Landscapes'),
        Album(user_id=2, title='Architectural Wonders'),
        Album(user_id=3, title='Wildlife in the Wild'),
        Album(user_id=3, title='Safari Adventures'),
        Album(user_id=4, title='Underwater and Marine Life'),
        Album(user_id=4, title='Culinary Delights'),
    ]

    db.session.add_all(albums)
    db.session.commit()

def undo_albums():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM albums"))
    db.session.commit()
