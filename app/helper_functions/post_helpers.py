def add_images_to_post(post, post_dict):
    from app.models import Image
    images = Image.query.filter_by(post_id=post.id).all()
    post_dict['images'] = [image.to_dict() for image in images]
    return post_dict
