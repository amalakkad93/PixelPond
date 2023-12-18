def process_album(album, album_dict):
    album_dict.update(album.to_dict())
    return album_dict
