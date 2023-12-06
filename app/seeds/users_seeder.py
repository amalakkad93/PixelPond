from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text



def seed_users():

    demo = User(
        first_name='John',
        last_name='Doe',
        age=30,
        username='Demo',
        email='demo@aa.io',
        profile_picture= 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Pfp-Profile.jpg',
        password='password',
    )
    marnie = User(
        first_name='Marnie',
        last_name='Smith',
        age=28,
        username='marnie',
        email='marnie@aa.io',
        profile_picture= 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Pfp.jpg',
        password='password',
    )
    bobbie = User(
        first_name='Bobbie',
        last_name='Johnson',
        age=25,
        username='bobbie',
        email='bobbie@aa.io',
        profile_picture= 'https://avatarfiles.alphacoders.com/364/364930.jpg',
        password='password',
    )
    josh = User(
        first_name='josh',
        last_name='Johnson',
        age=29,
        username='joshy',
        email='josh@aa.io',
        profile_picture= 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Image.jpg',
        password='password',
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(josh)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
