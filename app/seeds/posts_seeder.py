from app.models import db, User, Post, Image, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text


def seed_posts():
    post_data = [
        # Owner ID: 1
        {'owner_id': 1, 'album_id': 1, 'title': 'Beautiful Sunflower', 'description': 'This sunflower is a masterpiece of nature.', 'url': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'},
        {'owner_id': 1, 'album_id': 1, 'title': 'Beautiful Colorful Flowers', 'description': 'This tulips is a masterpiece of nature.', 'url': 'https://hips.hearstapps.com/hmg-prod/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg'},
        {'owner_id': 1, 'album_id': 1, 'title': 'Beautiful Bougainvillea', 'description': "A favorite in tropical locales, this colorful climber can also be grown annually if you don't happen to live in a sunny spot", 'url': 'https://hips.hearstapps.com/hmg-prod/images/door-shaded-by-bougainvillea-porquerolles-france-royalty-free-image-1653423252.jpg'},
        {'owner_id': 1, 'album_id': 1, 'title': 'Beautiful Anemone', 'description': 'While there are many varieties of anemone out there, this type can most often be spotted thanks to their wide black centers, which provide striking contrast to red, purple, and white petals.', 'url': 'https://hips.hearstapps.com/hmg-prod/images/anem-anemone-coronaria-news-photo-1578193956.jpg'},

        {'owner_id': 1, 'album_id': 2, 'title': 'Adorable Tuxedo Cat', 'description': 'Meet our lovely tuxedo cat, always dressed for the occasion.', 'url': 'https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg'},
        {'owner_id': 1, 'album_id': 2, 'title': 'Beautiful Siamese Cat', 'description': 'This Siamese cat is truly beautiful with its striking features and personality.', 'url': 'https://cdn.pixabay.com/photo/2017/02/15/12/12/cat-2068462_640.jpg'},
        {'owner_id': 1, 'album_id': 2, 'title': 'Beautiful British Shorthair', 'description': "The British Shorthair cat breed is known for its beauty and charming personality.", 'url': 'https://cdn.pixabay.com/photo/2023/06/01/06/22/british-shorthair-8032816_1280.jpg'},
        {'owner_id': 1, 'album_id': 2, 'title': 'Persian Cat', 'description': 'The Persian cat is famous for its luxurious fur and calm demeanor.', 'url': 'https://cdn.pixabay.com/photo/2012/02/16/12/09/cat-13458_1280.jpg'},

        # Owner ID: 2
        {'owner_id': 2, 'album_id': 3, 'title': 'Alberta, Canada, Lake', 'description': 'Alberta, Canada, Lake is a beautiful natural wonder.', 'url': 'https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_1280.jpg'},
        {'owner_id': 2, 'album_id': 3, 'title': 'Koyasan temple, Road', 'description': 'Koyasan temple road is a serene and picturesque path.', 'url': 'https://cdn.pixabay.com/photo/2022/08/15/09/14/koyasan-temple-7387445_1280.jpg'},
        {'owner_id': 2, 'album_id': 3, 'title': 'Yosemite Valley Beauty', 'description': 'Yosemite Valley is a natural wonder with breathtaking views.', 'url': 'https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg'},
        {'owner_id': 2, 'album_id': 3, 'title': 'Denali National Park', 'description': 'Explore the natural wonders of Denali National Park with its breathtaking views and pristine wilderness.', 'url': 'https://cdn.pixabay.com/photo/2016/10/12/02/27/denali-national-park-1733313_1280.jpg'},

        {'owner_id': 2, 'album_id': 4, 'title': 'Alhambra, Granada, Andalusia', 'description': 'Alhambra in Granada, Andalusia, is a historic marvel.', 'url': 'https://cdn.pixabay.com/photo/2017/03/21/22/50/alhambra-2163527_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'title': 'Himeji Castle ', 'description': 'Himeji Castle is a UNESCO World Heritage site.', 'url': 'https://cdn.pixabay.com/photo/2020/07/23/01/16/heritage-5430081_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'title': 'Forbidden city, Beijing', 'description': 'The Forbidden City in Beijing is an architectural wonder.', 'url': 'https://cdn.pixabay.com/photo/2019/08/25/08/06/the-national-palace-museum-4428906_1280.jpg'},
        {'owner_id': 2, 'album_id': 4, 'title': 'Aya Sophia', 'description': 'Aya Sophia is a stunning architectural masterpiece.', 'url': 'https://images2.alphacoders.com/796/796513.jpg'},

        # Owner ID: 3
        {'owner_id': 3, 'album_id': 5, 'title': 'Elephant in the wild', 'description': 'This elephant is a masterpiece of nature.', 'url': 'https://cdn.pixabay.com/photo/2013/05/17/07/12/elephant-111695_640.jpg'},
        {'owner_id': 3, 'album_id': 5, 'title': 'lion in the wild', 'description': 'King of the jungle', 'url': 'https://cdn.pixabay.com/photo/2013/08/10/16/58/lion-171311_1280.jpg'},
        {'owner_id': 3, 'album_id': 5, 'title': 'Zebra', 'description': "Zebra's are beautiful animals with their unique stripes.", 'url': 'https://cdn.pixabay.com/photo/2018/04/15/20/54/zebra-3322846_1280.jpg'},
        {'owner_id': 3, 'album_id': 5, 'title': 'Warthog', 'description': 'Bomba in the wild', 'url': 'https://cdn.pixabay.com/photo/2021/09/08/06/41/warthog-6605830_640.jpg'},

        {'owner_id': 3, 'album_id': 6, 'title': 'Leopard', 'description': 'Leopard is a beautiful animal with its unique spots.', 'url': 'https://images.squarespace-cdn.com/content/v1/5f493cff22bf2e6278c00067/1618241766799-K5JATU4LCIYQI95HEXEE/IMG_8199.JPG'},
        {'owner_id': 3, 'album_id': 6, 'title': 'Sleepy Lion', 'description': 'Just a sleepy lion enjoying his nap.', 'url': 'https://cdn.pixabay.com/photo/2020/07/12/13/17/lion-5397215_1280.jpg'},
        {'owner_id': 3, 'album_id': 6, 'title': 'Beautiful Cheetah', 'description': "Cheetah is a beautiful animal with its unique spots.", 'url': 'https://cdn.pixabay.com/photo/2022/04/19/21/22/cheetah-7143835_1280.jpg'},
        {'owner_id': 3, 'album_id': 6, 'title': 'Hot air balloon', 'description': 'Hot air balloon in the sky of the savannah.', 'url': 'https://cdn.pixabay.com/photo/2023/03/13/04/49/hot-air-balloon-7848426_1280.jpg'},

        # Owner ID: 4
        {'owner_id': 4, 'album_id': 7, 'title': 'Lemon butterflyfish', 'description': 'Lemon butterflyfish, also known as the Milletseed Butterflyfish, is a beautiful fish.', 'url': 'https://cdn.pixabay.com/photo/2014/06/30/08/02/zitronenfalter-fish-380037_1280.jpg'},
        {'owner_id': 4, 'album_id': 7, 'title': 'Great White Shark', 'description': 'strong and powerful jaws', 'url': 'https://www.science.org/do/10.1126/science.aaz3311/full/shark_1280p-1644902865557.jpg'},
        {'owner_id': 4, 'album_id': 7, 'title': 'Blue Whale', 'description': 'Blue Whale are so majestic.', 'url': 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEwL3Jhd3BpeGVsb2ZmaWNlNV9waG90b3JlYWxpc2l0Y19zaG90X29mX2FfYmx1ZV93aGFsZV9qdW1waW5nX291dF9lZWUyZjZmYS0yZjA5LTQ2YjgtOTcyMC01OWUzNGJhZGYwMzJfMS5qcGc.jpg'},
        {'owner_id': 4, 'album_id': 7, 'title': 'Killer Whales', 'description': 'Killer Whales are so majestic.', 'url': 'https://img.freepik.com/premium-photo/group-killer-whales-are-swimming-ocean_900101-15702.jpg'},

        {'owner_id': 4, 'album_id': 8, 'title': 'Maqluba', 'description': 'Maqluba is a traditional Palestinian dish.', 'url': 'https://t3.ftcdn.net/jpg/03/27/42/98/360_F_327429800_dd0ssYWhsMRVO4ilbRckuWXqtOCpeIp8.jpg'},
        {'owner_id': 4, 'album_id': 8, 'title': 'Pasta Pomodoro ', 'description': 'Pasta Pomodoro is a delicious Italian dish.', 'url': 'https://assets.epicurious.com/photos/642aebf9a2cf918d8b679f65/16:9/w_6815,h_3833,c_limit/PastaPomodoro_RECIPE_033023_50036.jpg'},
        {'owner_id': 4, 'album_id': 8, 'title': 'Sukiyaki', 'description': 'Sukiyaki is a delicious Japanese dish.', 'url': 'https://lindseyeatsla.com/wp-content/uploads/2020/07/Lindseyeatsla_Sukiyaki-12.jpg'},
        {'owner_id': 4, 'album_id': 8, 'title': 'Pastitsio', 'description': 'Pastitsio is a delicious Greek dish', 'url': 'https://www.recipetineats.com/wp-content/uploads/2021/02/Pastitsio-_4-SQ.jpg'},

    ]

    posts_and_images = []
    for i, data in enumerate(post_data):
        post = Post(
            owner_id=data['owner_id'],
            album_id=data['album_id'],
            title=data['title'],
            description=data['description'],
            created_at=datetime.utcnow()
        )
        db.session.add(post)
        db.session.flush()

        image = Image(
            post_id=post.id,
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

# from app.models import db, User, Post, Image, environment, SCHEMA
# from datetime import datetime
# from sqlalchemy.sql import text

# def seed_posts():
#     post1 = Post(
#         owner_id=1,
#         album_id=1,
#         title='Beautiful Sunflower',
#         description='This sunflower is a masterpiece of nature.',
#         created_at=datetime.utcnow()
#     )
#     image1 = Image(
#         post_id=1,
#         url='https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg'
#     )

#     post2 = Post(
#         owner_id=1,
#         album_id=1,
#         title='Beautiful Colorful Flowers',
#         description='This tulips is a masterpiece of nature.',
#         created_at=datetime.utcnow()
#     )
#     image2 = Image(
#         post_id=2,
#         url='https://hips.hearstapps.com/hmg-prod/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg'
#     )

#     post3 = Post(
#         owner_id=1,
#         album_id=1,
#         title='Beautiful Bougainvillea',
#         description="A favorite in tropical locales, this colorful climber can also be grown annually if you don't happen to live in a sunny spot",
#         created_at=datetime.utcnow()
#     )
#     image3 = Image(
#         post_id=3,
#         url='https://hips.hearstapps.com/hmg-prod/images/door-shaded-by-bougainvillea-porquerolles-france-royalty-free-image-1653423252.jpg'
#     )

#     post4 = Post(
#         owner_id=1,
#         album_id=1,
#         title='Beautiful Anemone',
#         description='While there are many varieties of anemone out there, this type can most often be spotted thanks to their wide black centers, which provide striking contrast to red, purple, and white petals.',
#         created_at=datetime.utcnow()
#     )
#     image4 = Image(
#         post_id=4,
#         url='https://hips.hearstapps.com/hmg-prod/images/anem-anemone-coronaria-news-photo-1578193956.jpg'
#     )
#     post5 = Post(
#         owner_id=1,
#         album_id=2,
#         title='Adorable Tuxedo Cat',
#         description='Meet our lovely tuxedo cat, always dressed for the occasion.',
#         created_at=datetime.utcnow()
#     )
#     image5 = Image(
#         post_id=5,
#         url='https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg'
#     )

#     post6 = Post(
#         owner_id=1,
#         album_id=2,
#         title='Beautiful Siamese Cat',
#         description='This Siamese cat is truly beautiful with its striking features and personality.',
#         created_at=datetime.utcnow()
#     )
#     image6 = Image(
#         post_id=6,
#         url='https://cdn.pixabay.com/photo/2017/02/15/12/12/cat-2068462_640.jpg'
#     )

#     post7 = Post(
#         owner_id=1,
#         album_id=2,
#         title='Beautiful British Shorthair',
#         description="The British Shorthair cat breed is known for its beauty and charming personality.",
#         created_at=datetime.utcnow()
#     )
#     image7 = Image(
#         post_id=7,
#         url='https://cdn.pixabay.com/photo/2023/06/01/06/22/british-shorthair-8032816_1280.jpg'
#     )

#     post8 = Post(
#         owner_id=1,
#         album_id=2,
#         title='Persian Cat',
#         description='The Persian cat is famous for its luxurious fur and calm demeanor.',
#         created_at=datetime.utcnow()
#     )
#     image8 = Image(
#         post_id=8,
#         url='https://cdn.pixabay.com/photo/2012/02/16/12/09/cat-13458_1280.jpg'
#     )




#     post9 = Post(
#         owner_id=2,
#         album_id=1,
#         title='Alberta, Canada, Lake',
#         description='Alberta, Canada, Lake is a beautiful natural wonder.',
#         created_at=datetime.utcnow()
#     )
#     image9 = Image(
#         post_id=9,
#         url='https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_1280.jpg'
#     )

#     post10 = Post(
#         owner_id=2,
#         album_id=1,
#         title='Koyasan temple, Road',
#         description='Koyasan temple road is a serene and picturesque path.',
#         created_at=datetime.utcnow()
#     )
#     image10 = Image(
#         post_id=10,
#         url='https://cdn.pixabay.com/photo/2022/08/15/09/14/koyasan-temple-7387445_1280.jpg'
#     )

#     post11 = Post(
#         owner_id=2,
#         album_id=1,
#         title='Yosemite Valley Beauty',
#         description='Yosemite Valley is a natural wonder with breathtaking views.',
#         created_at=datetime.utcnow()
#     )
#     image11 = Image(
#         post_id=11,
#         url='https://wallpaperswide.com/download/the_yosemite_valley-wallpaper-2560x1600.jpg'
#     )

#     post12 = Post(
#         owner_id=2,
#         album_id=1,
#         title='Denali National Park',
#         description='Explore the natural wonders of Denali National Park with its breathtaking views and pristine wilderness.',
#         created_at=datetime.utcnow()
#     )
#     image12 = Image(
#         post_id=12,
#         url='https://cdn.pixabay.com/photo/2016/10/12/02/27/denali-national-park-1733313_1280.jpg'
#     )


#     post13 = Post(
#         owner_id=2,
#         album_id=2,
#         title='Alhambra, Granada, Andalusia',
#         description='Alhambra in Granada, Andalusia, is a historic marvel.',
#         created_at=datetime.utcnow()
#     )
#     image13 = Image(
#         post_id=13,
#         url='https://cdn.pixabay.com/photo/2017/03/21/22/50/alhambra-2163527_1280.jpg'
#     )

#     post14 = Post(
#         owner_id=2,
#         album_id=2,
#         title='Himeji Castle ',
#         description= 'Himeji Castle is a UNESCO World Heritage site.',
#         created_at=datetime.utcnow()
#     )
#     image14 = Image(
#         post_id=14,
#         url='https://cdn.pixabay.com/photo/2020/07/23/01/16/heritage-5430081_1280.jpg'
#     )

#     post15 = Post(
#         owner_id=2,
#         album_id=2,
#         title='Forbidden city, Beijing',
#         description='The Forbidden City in Beijing is an architectural wonder.',
#         created_at=datetime.utcnow()
#     )
#     image15 = Image(
#         post_id=15,
#         url='https://cdn.pixabay.com/photo/2019/08/25/08/06/the-national-palace-museum-4428906_1280.jpg'
#     )

#     post16 = Post(
#         owner_id=2,
#         album_id=2,
#         title='Aya Sophia',
#         description= 'Aya Sophia is a stunning architectural masterpiece.',
#         created_at=datetime.utcnow()
#     )
#     image16 = Image(
#         post_id=16,
#         url='https://images2.alphacoders.com/796/796513.jpg'
#     )








#     post17 = Post(
#         owner_id=3,
#         album_id=1,
#         title='Elephant in the wild',
#         description='This elephant is a masterpiece of nature.',
#         created_at=datetime.utcnow()
#     )
#     image17 = Image(
#         post_id=17,
#         url='https://cdn.pixabay.com/photo/2013/05/17/07/12/elephant-111695_640.jpg'
#     )

#     post18 = Post(
#         owner_id=3,
#         album_id=1,
#         title='lion in the wild',
#         description='King of the jungle',
#         created_at=datetime.utcnow()
#     )
#     image18 = Image(
#         post_id=18,
#         url='https://cdn.pixabay.com/photo/2013/08/10/16/58/lion-171311_1280.jpg'
#     )

#     post19 = Post(
#         owner_id=3,
#         album_id=1,
#         title='Zebra',
#         description="Zebra's are beautiful animals with their unique stripes.",
#         created_at=datetime.utcnow()
#     )
#     image19 = Image(
#         post_id=19,
#         url='https://cdn.pixabay.com/photo/2018/04/15/20/54/zebra-3322846_1280.jpg'
#     )

#     post20 = Post(
#         owner_id=3,
#         album_id=1,
#         title='Warthog',
#         description='Bomba in the wild',
#         created_at=datetime.utcnow()
#     )
#     image20 = Image(
#         post_id=20,
#         url='https://cdn.pixabay.com/photo/2021/09/08/06/41/warthog-6605830_640.jpg'
#     )
#     post21 = Post(
#         owner_id=3,
#         album_id=2,
#         title='Adorable Tuxedo Cat',
#         description='Meet our lovely tuxedo cat, always dressed for the occasion.',
#         created_at=datetime.utcnow()
#     )
#     image21 = Image(
#         post_id=21,
#         url='https://www.litter-robot.com/media/magefan_blog/2020/09/tatiana-rodriguez-VDaTIMWsc_8-unsplash.jpg'
#     )

#     post22 = Post(
#         owner_id=3,
#         album_id=2,
#         title='Sleepy Lion',
#         description='Just a sleepy lion enjoying his nap.',
#         created_at=datetime.utcnow()
#     )
#     image22 = Image(
#         post_id=22,
#         url='https://cdn.pixabay.com/photo/2020/07/12/13/17/lion-5397215_1280.jpg'
#     )

#     post23 = Post(
#         owner_id=3,
#         album_id=2,
#         title='Beautiful Cheetah',
#         description="Cheetah is a beautiful animal with its unique spots.",
#         created_at=datetime.utcnow()
#     )
#     image23 = Image(
#         post_id=23,
#         url='https://cdn.pixabay.com/photo/2022/04/19/21/22/cheetah-7143835_1280.jpg'
#     )

#     post24 = Post(
#         owner_id=3,
#         album_id=2,
#         title='Hot air balloon',
#         description='Hot air balloon in the sky of the savannah.',
#         created_at=datetime.utcnow()
#     )
#     image24 = Image(
#         post_id=24,
#         url='https://cdn.pixabay.com/photo/2023/03/13/04/49/hot-air-balloon-7848426_1280.jpg'
#     )




#     post25 = Post(
#         owner_id=4,
#         album_id=1,
#         title='Lemon butterflyfish',
#         description='Lemon butterflyfish, also known as the Milletseed Butterflyfish, is a beautiful fish.',
#         created_at=datetime.utcnow()
#     )
#     image25 = Image(
#         post_id=25,
#         url='https://cdn.pixabay.com/photo/2014/06/30/08/02/zitronenfalter-fish-380037_1280.jpg'
#     )

#     post26 = Post(
#         owner_id=4,
#         album_id=1,
#         title='Great White Shark',
#         description='strong and powerful jaws',
#         created_at=datetime.utcnow()
#     )
#     image26 = Image(
#         post_id=26,
#         url='https://www.science.org/do/10.1126/science.aaz3311/full/shark_1280p-1644902865557.jpg'
#     )

#     post27 = Post(
#         owner_id=4,
#         album_id=1,
#         title='Blue Whale',
#         description='Blue Whale are so majestic.',
#         created_at=datetime.utcnow()
#     )
#     image27 = Image(
#         post_id=27,
#         url='https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEwL3Jhd3BpeGVsb2ZmaWNlNV9waG90b3JlYWxpc2l0Y19zaG90X29mX2FfYmx1ZV93aGFsZV9qdW1waW5nX291dF9lZWUyZjZmYS0yZjA5LTQ2YjgtOTcyMC01OWUzNGJhZGYwMzJfMS5qcGc.jpg'
#     )

#     post28 = Post(
#         owner_id=4,
#         album_id=1,
#         title='Killer Whales',
#         description='Killer Whales are so majestic.',
#         created_at=datetime.utcnow()
#     )
#     image28 = Image(
#         post_id=28,
#         url='https://img.freepik.com/premium-photo/group-killer-whales-are-swimming-ocean_900101-15702.jpg'
#     )






#     post29 = Post(
#         owner_id=4,
#         album_id=2,
#         title='Maqluba',
#         description='Maqluba is a traditional Palestinian dish.',
#         created_at=datetime.utcnow()
#     )
#     image29 = Image(
#         post_id=29,
#         url='https://t3.ftcdn.net/jpg/03/27/42/98/360_F_327429800_dd0ssYWhsMRVO4ilbRckuWXqtOCpeIp8.jpg'
#     )

#     post30 = Post(
#         owner_id=4,
#         album_id=2,
#         title='Pasta Pomodoro ',
#         description= 'Pasta Pomodoro is a delicious Italian dish.',
#         created_at=datetime.utcnow()
#     )
#     image30 = Image(
#         post_id=30,
#         url='https://assets.epicurious.com/photos/642aebf9a2cf918d8b679f65/16:9/w_6815,h_3833,c_limit/PastaPomodoro_RECIPE_033023_50036.jpg'
#     )

#     post31 = Post(
#         owner_id=4,
#         album_id=2,
#         title='Sukiyaki',
#         description='Sukiyaki is a delicious Japanese dish.',
#         created_at=datetime.utcnow()
#     )
#     image31 = Image(
#         post_id=31,
#         url='https://lindseyeatsla.com/wp-content/uploads/2020/07/Lindseyeatsla_Sukiyaki-12.jpg'
#     )

#     post32 = Post(
#         owner_id=4,
#         album_id=2,
#         title='Pastitsio',
#         description= 'Pastitsio is a delicious Greek dish',
#         created_at=datetime.utcnow()
#     )
#     image32 = Image(
#         post_id=32,
#         url='https://www.recipetineats.com/wp-content/uploads/2021/02/Pastitsio-_4-SQ.jpg'
#     )




#     db.session.add_all([post1, image1])
#     db.session.add_all([post2, image2])
#     db.session.add_all([post3, image3])
#     db.session.add_all([post4, image4])
#     db.session.add_all([post5, image5])
#     db.session.add_all([post6, image6])
#     db.session.add_all([post7, image7])
#     db.session.add_all([post8, image8])
#     db.session.add_all([post9, image9])
#     db.session.add_all([post10, image10])
#     db.session.add_all([post11, image11])
#     db.session.add_all([post12, image12])
#     db.session.add_all([post13, image13])
#     db.session.add_all([post14, image14])
#     db.session.add_all([post15, image15])
#     db.session.add_all([post16, image16])
#     db.session.add_all([post17, image17])
#     db.session.add_all([post18, image18])
#     db.session.add_all([post19, image19])
#     db.session.add_all([post20, image20])
#     db.session.add_all([post21, image21])
#     db.session.add_all([post22, image22])
#     db.session.add_all([post23, image23])
#     db.session.add_all([post24, image24])
#     db.session.add_all([post25, image25])
#     db.session.add_all([post26, image26])
#     db.session.add_all([post27, image27])
#     db.session.add_all([post28, image28])
#     db.session.add_all([post29, image29])
#     db.session.add_all([post30, image30])
#     db.session.add_all([post31, image31])
#     db.session.add_all([post32, image32])

#     db.session.commit()

# def undo_posts():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.posts RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM posts"))

#     db.session.commit()
