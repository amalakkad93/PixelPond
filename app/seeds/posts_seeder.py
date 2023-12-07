from app.models import db, User, Post, Image, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_posts():
    post1 = Post(
        owner_id=1,
        album_id=1,
        title='Beautiful Sunflower',
        description='This sunflower is a masterpiece of nature.',
        created_at=datetime.utcnow()
    )
    image1 = Image(
        post_id=1,
        url='https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
    )

    post2 = Post(
        owner_id=2,
        album_id=1,
        title='Adorable Tuxedo Cat',
        description='Meet our lovely tuxedo cat, always dressed for the occasion.',
        created_at=datetime.utcnow()
    )
    image2 = Image(
        post_id=2,
        url='https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg'
    )

    post3 = Post(
        owner_id=3,
        album_id=1,
        title='Picturesque Garden',
        # photo_url='https://sample-videos.com/img/Sample-jpg-image-10mb.jpg',
        description='This garden is a hidden gem filled with colorful blooms.',
        created_at=datetime.utcnow()
    )
    image3 = Image(
        post_id=3,
        url='https://sample-videos.com/img/Sample-jpg-image-10mb.jpg'
    )

    post4 = Post(
        owner_id=4,
        album_id=1,
        title='Yosemite Valley Beauty',
        # photo_url='https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg',
        description='Yosemite Valley is a natural wonder with breathtaking views.',
        created_at=datetime.utcnow()
    )
    image4 = Image(
        post_id=4,
        url='https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg'
    )



    db.session.add_all([post1, image1])
    db.session.add_all([post2, image2])
    db.session.add_all([post3, image3])
    db.session.add_all([post4, image4])
    db.session.commit()

def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM posts"))

    db.session.commit()
