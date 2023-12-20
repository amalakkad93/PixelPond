from app.models import db, User, Post, Image, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text


def seed_posts():
    post_data = [
        # Owner ID: 1
        {'owner_id': 1, 'album_id': 1, 'image_id':1, 'title': 'Beautiful Sunflower', 'description': 'This sunflower is a masterpiece of nature.', 'url': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'},
        {'owner_id': 1, 'album_id': 1, 'image_id':2, 'title': 'Beautiful Colorful Flowers', 'description': 'This tulips is a masterpiece of nature.', 'url': 'https://hips.hearstapps.com/hmg-prod/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg'},
        {'owner_id': 1, 'album_id': 1, 'image_id':3, 'title': 'Beautiful Bougainvillea', 'description': "A favorite in tropical locales, this colorful climber can also be grown annually if you don't happen to live in a sunny spot", 'url': 'https://hips.hearstapps.com/hmg-prod/images/door-shaded-by-bougainvillea-porquerolles-france-royalty-free-image-1653423252.jpg'},
        {'owner_id': 1, 'album_id': 1, 'image_id':4, 'title': 'Beautiful Anemone', 'description': 'While there are many varieties of anemone out there, this type can most often be spotted thanks to their wide black centers, which provide striking contrast to red, purple, and white petals.', 'url': 'https://hips.hearstapps.com/hmg-prod/images/anem-anemone-coronaria-news-photo-1578193956.jpg'},
        {'owner_id': 1, 'album_id': 2, 'image_id':5, 'title': 'Adorable Tuxedo Cat', 'description': 'Meet our lovely tuxedo cat, always dressed for the occasion.', 'url': 'https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg'},
        {'owner_id': 1, 'album_id': 2, 'image_id':6, 'title': 'Beautiful Siamese Cat', 'description': 'This Siamese cat is truly beautiful with its striking features and personality.', 'url': 'https://cdn.pixabay.com/photo/2017/02/15/12/12/cat-2068462_640.jpg'},
        {'owner_id': 1, 'album_id': 2, 'image_id':7, 'title': 'Beautiful British Shorthair', 'description': "The British Shorthair cat breed is known for its beauty and charming personality.", 'url': 'https://cdn.pixabay.com/photo/2023/06/01/06/22/british-shorthair-8032816_1280.jpg'},
        {'owner_id': 1, 'album_id': 2, 'image_id':8, 'title': 'Persian Cat', 'description': 'The Persian cat is famous for its luxurious fur and calm demeanor.', 'url': 'https://cdn.pixabay.com/photo/2012/02/16/12/09/cat-13458_1280.jpg'},
        # Owner ID: 2
        {'owner_id': 2, 'album_id': 3, 'image_id':9, 'title': 'Alberta, Canada, Lake', 'description': 'Alberta, Canada, Lake is a beautiful natural wonder.', 'url': 'https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_1280.jpg'},
        {'owner_id': 2, 'album_id': 3, 'image_id':10, 'title': 'Koyasan temple, Road', 'description': 'Koyasan temple road is a serene and picturesque path.', 'url': 'https://cdn.pixabay.com/photo/2022/08/15/09/14/koyasan-temple-7387445_1280.jpg'},
        {'owner_id': 2, 'album_id': 3, 'image_id':11, 'title': 'Yosemite Valley Beauty', 'description': 'Yosemite Valley is a natural wonder with breathtaking views.', 'url': 'https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg'},
        {'owner_id': 2, 'album_id': 3, 'image_id':12, 'title': 'Denali National Park', 'description': 'Explore the natural wonders of Denali National Park with its breathtaking views and pristine wilderness.', 'url': 'https://cdn.pixabay.com/photo/2016/10/12/02/27/denali-national-park-1733313_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'image_id':13, 'title': 'Alhambra, Granada, Andalusia', 'description': 'Alhambra in Granada, Andalusia, is a historic marvel.', 'url': 'https://cdn.pixabay.com/photo/2017/03/21/22/50/alhambra-2163527_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'image_id':14, 'title': 'Himeji Castle ', 'description': 'Himeji Castle is a UNESCO World Heritage site.', 'url': 'https://cdn.pixabay.com/photo/2020/07/23/01/16/heritage-5430081_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'image_id':15, 'title': 'Forbidden city, Beijing', 'description': 'The Forbidden City in Beijing is an architectural wonder.', 'url': 'https://cdn.pixabay.com/photo/2019/08/25/08/06/the-national-palace-museum-4428906_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'image_id':16, 'title': 'Aya Sophia', 'description': 'Aya Sophia is a stunning architectural masterpiece.', 'url': 'https://images2.alphacoders.com/796/796513.jpg'},
        # Owner ID:3
        {'owner_id': 3, 'album_id': 5, 'image_id':17, 'title': 'Elephant in the wild', 'description': 'This elephant is a masterpiece of nature.', 'url': 'https://cdn.pixabay.com/photo/2013/05/17/07/12/elephant-111695_640.jpg'},
        {'owner_id': 3, 'album_id': 5, 'image_id':18, 'title': 'lion in the wild', 'description': 'King of the jungle', 'url': 'https://cdn.pixabay.com/photo/2013/08/10/16/58/lion-171311_1280.jpg'},
        {'owner_id': 3, 'album_id': 5, 'image_id':19, 'title': 'Zebra', 'description': "Zebra's are beautiful animals with their unique stripes.", 'url': 'https://cdn.pixabay.com/photo/2018/04/15/20/54/zebra-3322846_1280.jpg'},
        {'owner_id': 3, 'album_id': 5, 'image_id':20, 'title': 'Warthog', 'description': 'Bomba in the wild', 'url': 'https://cdn.pixabay.com/photo/2021/09/08/06/41/warthog-6605830_640.jpg'},

        {'owner_id': 3, 'album_id': 6, 'image_id':21, 'title': 'Leopard', 'description': 'Leopard is a beautiful animal with its unique spots.', 'url': 'https://images.squarespace-cdn.com/content/v1/5f493cff22bf2e6278c00067/1618241766799-K5JATU4LCIYQI95HEXEE/IMG_8199.JPG'},
        {'owner_id': 3, 'album_id': 6, 'image_id':22, 'title': 'Sleepy Lion', 'description': 'Just a sleepy lion enjoying his nap.', 'url': 'https://cdn.pixabay.com/photo/2020/07/12/13/17/lion-5397215_1280.jpg'},
        {'owner_id': 3, 'album_id': 6, 'image_id':23, 'title': 'Beautiful Cheetah', 'description': "Cheetah is a beautiful animal with its unique spots.", 'url': 'https://cdn.pixabay.com/photo/2022/04/19/21/22/cheetah-7143835_1280.jpg'},
        {'owner_id': 3, 'album_id': 6, 'image_id':24, 'title': 'Hot air balloon', 'description': 'Hot air balloon in the sky of the savannah.', 'url': 'https://cdn.pixabay.com/photo/2023/03/13/04/49/hot-air-balloon-7848426_1280.jpg'},


        # Owner ID: 4
        {'owner_id': 4, 'album_id': 7, 'image_id':25, 'title': 'Lemon butterflyfish', 'description': 'Lemon butterflyfish, also known as the Milletseed Butterflyfish, is a beautiful fish.', 'url': 'https://cdn.pixabay.com/photo/2014/06/30/08/02/zitronenfalter-fish-380037_1280.jpg'},
        {'owner_id': 4, 'album_id': 7, 'image_id':26, 'title': 'Great White Shark', 'description': 'strong and powerful jaws', 'url': 'https://www.science.org/do/10.1126/science.aaz3311/full/shark_1280p-1644902865557.jpg'},
        {'owner_id': 4, 'album_id': 7, 'image_id':27, 'title': 'Blue Whale', 'description': 'Blue Whale are so majestic.', 'url': 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEwL3Jhd3BpeGVsb2ZmaWNlNV9waG90b3JlYWxpc2l0Y19zaG90X29mX2FfYmx1ZV93aGFsZV9qdW1waW5nX291dF9lZWUyZjZmYS0yZjA5LTQ2YjgtOTcyMC01OWUzNGJhZGYwMzJfMS5qcGc.jpg'},
        {'owner_id': 4, 'album_id': 7, 'image_id':28, 'title': 'Killer Whales', 'description': 'Killer Whales are so majestic.', 'url': 'https://img.freepik.com/premium-photo/group-killer-whales-are-swimming-ocean_900101-15702.jpg'},


        {'owner_id': 4, 'album_id': 8, 'image_id':29, 'title': 'Maqluba', 'description': 'Maqluba is a traditional Palestinian dish.', 'url': 'https://t3.ftcdn.net/jpg/03/27/42/98/360_F_327429800_dd0ssYWhsMRVO4ilbRckuWXqtOCpeIp8.jpg'},
        {'owner_id': 4, 'album_id': 8, 'image_id':30, 'title': 'Pasta Pomodoro ', 'description': 'Pasta Pomodoro is a delicious Italian dish.', 'url': 'https://assets.epicurious.com/photos/642aebf9a2cf918d8b679f65/16:9/w_6815,h_3833,c_limit/PastaPomodoro_RECIPE_033023_50036.jpg'},
        {'owner_id': 4, 'album_id': 8, 'image_id':31, 'title': 'Sukiyaki', 'description': 'Sukiyaki is a delicious Japanese dish.', 'url': 'https://lindseyeatsla.com/wp-content/uploads/2020/07/Lindseyeatsla_Sukiyaki-12.jpg'},
        {'owner_id': 4, 'album_id': 8, 'image_id':32, 'title': 'Pastitsio', 'description': 'Pastitsio is a delicious Greek dish', 'url': 'https://www.recipetineats.com/wp-content/uploads/2021/02/Pastitsio-_4-SQ.jpg'},

    ]

    posts_and_images = []
    for i, data in enumerate(post_data):
        post = Post(
            owner_id=data['owner_id'],
            album_id=data['album_id'],
            image_id=data['image_id'],
            title=data['title'],
            description=data['description'],
            created_at=datetime.utcnow()
        )
        db.session.add(post)
        db.session.flush()

        image = Image(
            # post_id=post.id,
            url=data['url']
        )
        posts_and_images.append(image)

    db.session.add_all(posts_and_images)
    db.session.commit()


def undo_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM posts")
    db.session.commit()
