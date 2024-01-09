/**
 * RemoveFromAlbumModal Component
 *
 * This component provides an interface for users to remove a post image from an album.
 * It allows users to select one of their albums that contains the post image and perform
 * the removal operation. The modal supports both specific album mode (where the album is
 * pre-selected) and a general mode where the user selects from a list of albums. The
 * component integrates with Redux for state management, dispatching actions to remove
 * images from albums and to refresh album details.
 *
 * @param {number} postId - The ID of the post image to be removed from an album.
 * @param {string} mode - The mode of operation, indicating whether it's album-specific
 *                        removal ('albumImages') or a general removal from any album.
 */
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  thunkRemovePostFromAlbum,
  thunkGetAlbumsByUserId,
  thunkGetAlbumImages,
} from "../../../store/albums";
import { selectUserAlbums, selectSessionUser } from "../../../store/selectors";
import { useShortModal } from "../../../context/ModalShort";

import "./RemoveFromAlbumModal.css";
const ITEMS_PER_PAGE = 10; // Number of items per page for pagination

const RemoveFromAlbumModal = ({ postId, mode }) => {
  // Setting up hooks and state variables
  const dispatch = useDispatch(); // Redux dispatch function
  const { albumId } = useParams(); // React Router hook for getting URL parameters
  const { closeShortModal } = useShortModal(); // Context hook for modal control
  const sessionUser = useSelector(selectSessionUser); // Redux selector for session user details
  const userAlbumsRaw = useSelector(selectUserAlbums); // Raw user albums data from Redux
  const userAlbums = useMemo(() => userAlbumsRaw || [], [userAlbumsRaw]); // Processed user albums data
  const [selectedAlbumId, setSelectedAlbumId] = useState(""); // State for currently selected album ID
  const [albumsContainingPost, setAlbumsContainingPost] = useState([]); // Albums that contain the post
  const [currentPage, setCurrentPage] = useState(1); // Pagination state: current page
  const [totalItems, setTotalItems] = useState(0); // Total number of items for pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Calculating total pages for pagination
  const isAlbumSpecificMode = mode === "albumImages"; // Flag to check if the modal is in album-specific mode

  // useEffect to fetch user's albums when the modal is opened or the session user changes
  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  // useEffect to filter albums that contain the post
  // This effect runs when the userAlbums data or postId changes
  useEffect(() => {
    if (userAlbums && userAlbums.length > 0) {
      const postIdInt = parseInt(postId, 10); // Converting postId to an integer for comparison
      const filteredAlbums = userAlbums.filter((album) => {
        const imageIds = album.images?.allIds; // Retrieve image IDs from the album
        return imageIds?.some((imageId) => {
          const image = album.images.byId[imageId];
          return image?.post_id === postIdInt; // Check if the image's post ID matches the given postId
        });
      });
      setAlbumsContainingPost(filteredAlbums); // Update state with filtered albums
      if (filteredAlbums.length > 0) {
        setSelectedAlbumId(filteredAlbums[0].id); // Set the first filtered album as selected by default
      }
    }
  }, [userAlbums, postId]);

  // Function to handle removing the post from the selected album
  const handleRemoveFromAlbum = async () => {
    if (selectedAlbumId) {
      try {
        // Dispatching action to remove the post from the album
        await dispatch(thunkRemovePostFromAlbum(postId, selectedAlbumId));
        // Refreshing album images and user albums after the post is removed
        dispatch(
          thunkGetAlbumImages(selectedAlbumId, currentPage, ITEMS_PER_PAGE)
        );
        dispatch(
          thunkGetAlbumsByUserId(sessionUser.id, currentPage, ITEMS_PER_PAGE)
        );
        closeShortModal(); // Close the modal after successful removal
      } catch (error) {
        console.error("Error removing post from album:", error);
      }
    }
  };

  return (
    <div className="remove-from-album-modal">
      <h2>Remove from Album</h2>
      {!isAlbumSpecificMode ? (
        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
        >
          <option value="">Select Album</option>
          {albumsContainingPost.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      ) : (
        <div>
          <strong>Album: </strong>{" "}
          {userAlbums.find((a) => a.id === parseInt(albumId))?.title}
        </div>
      )}
      <button onClick={handleRemoveFromAlbum}>Remove</button>
      <button onClick={closeShortModal}>Cancel</button>
    </div>
  );
};

export default RemoveFromAlbumModal;
