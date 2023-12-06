from app.models import db, User, Post, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        owner_id=1,
        album_id=1,
        title='Beautiful Sunflower',
        photo_url='https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg',
        description='This sunflower is a masterpiece of nature.',
        created_at=datetime.utcnow()
    )

    post2 = Post(
        owner_id=2,
        album_id=1,
        title='Adorable Tuxedo Cat',
        photo_url='https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg',
        description='Meet our lovely tuxedo cat, always dressed for the occasion.',
        created_at=datetime.utcnow()
    )

    post3 = Post(
        owner_id=3,
        album_id=1,
        title='Picturesque Garden',
        photo_url='https://sample-videos.com/img/Sample-jpg-image-10mb.jpg',
        description='This garden is a hidden gem filled with colorful blooms.',
        created_at=datetime.utcnow()
    )

    post4 = Post(
        owner_id=4,
        album_id=1,
        title='Yosemite Valley Beauty',
        photo_url='https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg',
        description='Yosemite Valley is a natural wonder with breathtaking views.',
        created_at=datetime.utcnow()
    )



    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.add(post4)
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
