import React, { memo } from "react";
import { useSelector } from "react-redux";
import Masonry from "react-masonry-css";
import ImageItem from "../ImageItem/ImageItem";
import { useHistory } from "react-router-dom";
import { selectUserAlbums } from "../../../store/selectors";
const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const ImageGrid = memo(({ displayedImages, mode, albumInfo, sessionUser, albumId }) => {
  const userAlbums = useSelector(selectUserAlbums);
  console.log("User Albums:", userAlbums);

  const hasAlbums = userAlbums && userAlbums.length > 0;


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
          albumId={albumId}
          imageUrl={post?.image_url}
          mode={mode}
          postId={post?.id || post?.post_id}
          addPostToAlbumMode={mode === "addPostToAnAlbum"}
          showRemoveIcon={sessionUser?.id === albumInfo?.userId && mode === "albumImages"}
          onClick={(id) => history.push(`/posts/${id}`)}
          hasAlbums={hasAlbums}
          showOptionsButton={mode === "albumManagement"}
        />
      ))}
    </Masonry>
  );
});

export default ImageGrid;
