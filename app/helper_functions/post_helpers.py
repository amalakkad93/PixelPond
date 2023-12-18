def add_images_to_post(post, post_dict):
    from app.models import Image
    images = Image.query.filter_by(post_id=post.id).all()
    post_dict['images'] = [image.to_dict() for image in images]
    return post_dict

# Helper functions to get next and previous post IDs
def get_next_post_id(current_post_id, user_id):
    from app.models import Post
    next_post = Post.query.filter(
        Post.id > current_post_id, Post.owner_id == user_id
    ).order_by(Post.id.asc()).first()
    return next_post.id if next_post else None

def get_prev_post_id(current_post_id, user_id):
    from app.models import Post
    prev_post = Post.query.filter(
        Post.id < current_post_id, Post.owner_id == user_id
    ).order_by(Post.id.desc()).first()
    return prev_post.id if prev_post else None
