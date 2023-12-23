import React, { memo } from "react";
import Masonry from "react-masonry-css";
import ImageItem from "../ImageItem/ImageItem";
import { useHistory } from "react-router-dom";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const ImageGrid = memo(({ displayedImages, mode, albumInfo, sessionUser }) => {
  const history = useHistory();
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="photo-grid"
      columnClassName="photo-grid_column"
    >
      {displayedImages.map((post) => (
        <ImageItem
          key={post?.id}
          imageUrl={post?.image_url}
          postId={post?.id || post?.post_id}
          addPostToAlbumMode={mode === "addPostToAnAlbum"}
          showRemoveIcon={sessionUser?.id === albumInfo?.userId && mode === "albumImages"}
          onClick={(id) => history.push(`/posts/${id}`)}
        />
      ))}
    </Masonry>
  );
});

export default ImageGrid;
