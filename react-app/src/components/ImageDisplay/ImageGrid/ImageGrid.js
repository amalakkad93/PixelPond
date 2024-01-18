/**
 * ImageGrid Component
 *
 * This component uses the Masonry layout to display a grid of images. It is used in various modes
 * like 'albumImages', 'photoStream', and 'albumManagement' to render images differently based on the mode.
 * The component also handles navigation and conditionally renders ImageItem components based on the provided data.
 *
 * @param {Array} displayedImages - An array of image data to display in the grid.
 * @param {string} mode - The mode in which the ImageGrid is being used.
 * @param {Object} albumInfo - Information about the album for 'albumImages' mode.
 * @param {Object} sessionUser - The currently logged-in user's data.
 * @param {number} albumId - The ID of the current album for 'albumImages' mode.
 */
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

const ImageGrid = memo(
  ({ displayedImages, mode, albumInfo, sessionUser, albumId }) => {
    const history = useHistory();

    const userAlbums = useSelector(selectUserAlbums);

    const hasAlbums = userAlbums && userAlbums.length > 0;

    // Renders images using Masonry layout
    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="photo-grid"
        columnClassName="photo-grid_column"
      >
        {displayedImages.map((post) => (
          <ImageItem
            // Props for each ImageItem, based on the current mode and data
            key={post?.id}
            albumId={albumId}
            imageUrl={post?.image_url}
            mode={mode}
            postId={post?.id || post?.post_id}
            addPostToAlbumMode={mode === "addPostToAnAlbum"}
            showRemoveIcon={
              sessionUser?.id === albumInfo?.userId && mode === "albumImages"
            }
            onClick={(id) => history.push(`/posts/${id}`)}
            hasAlbums={hasAlbums}
            showOptionsButton={mode === "albumManagement"}
          />
        ))}
      </Masonry>
    );
  }
);

export default ImageGrid;
