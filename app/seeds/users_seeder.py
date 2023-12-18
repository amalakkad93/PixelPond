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
        about_me='I am a photographer based in New York City. I love to travel and take pictures of nature and pets.',
        country='United States',
        password='password',
    )
    marnie = User(
        first_name='Marnie',
        last_name='Smith',
        age=28,
        username='marnie',
        email='marnie@aa.io',
        profile_picture= 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Pfp.jpg',
        about_me='I am a passionate photographer based in the vibrant city of Los Angeles, specializing in capturing the beauty of landscapes and architectural wonders. With a deep appreciation for the art of photography and a love for travel, I embark on journeys to both natural and man-made marvels to freeze those awe-inspiring moments in time.',
        country='United States',
        password='password',
    )
    bobbie = User(
        first_name='Bobbie',
        last_name='Johnson',
        age=25,
        username='bobbie',
        email='bobbie@aa.io',
        profile_picture= 'https://avatarfiles.alphacoders.com/364/364930.jpg',
        about_me="I am an avid wildlife photographer with an unwavering love for the untamed wonders of the natural world. My journey takes me to the heart of Africa, where I am privileged to witness and document the extraordinary lives of wild animals in their natural habitats.",
        country='United States',
        password='password',
    )
    josh = User(
        first_name='josh',
        last_name='Johnson',
        age=29,
        username='joshy',
        email='josh@aa.io',
        profile_picture= 'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Image.jpg',
        about_me='I am a dedicated explorer of the enchanting world beneath the waves, an avid enthusiast of underwater ecosystems, and an advocate for marine life conservation. My journey unfolds in the depths of the ocean, where I am privileged to immerse myself in the wonders of underwater and marine life. I also enjoy taking pictures of food.',
        country='United States',
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
