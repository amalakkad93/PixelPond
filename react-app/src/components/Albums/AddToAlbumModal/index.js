/**
 * AddToAlbumModal Component
 *
 * This component is responsible for adding a post image to an album. It allows users to
 * select an album from their available albums and add a chosen post image to it.
 * The modal displays thumbnails of images in the selected album, with a visual indication
 * if the chosen post image is already in the album. Users can navigate through album pages
 * using pagination controls. The component integrates with Redux for state management
 * and dispatches actions to handle adding images to albums and fetching album details.
 *
 * @param {number} postId - The ID of the post image to be added to an album.
 * @param {function} onClose - Function to close the modal.
 * @param {string} mode - The mode of operation, which can be 'addPostToAnAlbum' or others.
 * @param {number} albumId - The ID of the album (used in 'addPostToAnAlbum' mode).
 */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useShortModal } from "../../../context/ModalShort";
import {
  thunkAddPostToAlbum,
  thunkGetAlbumsByUserId,
  thunkGetAlbumImages,
} from "../../../store/albums";
import {
  selectUserAlbums,
  selectSessionUser,
  selectAlbumDetails,
} from "../../../store/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./AddToAlbumModal.css";

const ITEMS_PER_PAGE = 4;
const AddToAlbumModal = ({ postId, onClose, mode, albumId }) => {
  // Setting up hooks and state variables
  const dispatch = useDispatch(); // Redux dispatch function
  const location = useLocation(); // React Router hook for accessing location object
  const { closeShortModal } = useShortModal(); // Context hook for modal control
  const userAlbums = useSelector(selectUserAlbums); // Redux selector for user's albums
  const sessionUser = useSelector(selectSessionUser); // Redux selector for session user details
  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, selectedAlbumId)
  );
  const { title: propAlbumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );

  const [selectedAlbumId, setSelectedAlbumId] = useState(""); // State for currently selected album ID
  const [isImageInAlbum, setIsImageInAlbum] = useState(false); // State to track if the image is already in the album
  const [currentPage, setCurrentPage] = useState(1); // Pagination state: current page
  const [totalItems, setTotalItems] = useState(0); // Total number of items for pagination
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); // Calculating total pages for pagination
  const isAlbumSpecificMode = mode === "addPostToAnAlbum"; // Flag to check if the modal is in a specific mode

  // useEffect to fetch user's albums when the modal is opened or the session user changes
  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  // useEffect to check if the selected image is in the selected album
  // This runs when the selected album or post ID changes
  useEffect(() => {
    if (selectedAlbumId) {
      checkImageInAlbumAcrossPages(selectedAlbumId);
    }
  }, [dispatch, selectedAlbumId, postId]);

  // Similar useEffect for when the modal is in album-specific mode
  useEffect(() => {
    if (albumId) {
      checkImageInAlbumAcrossPages(albumId);
    }
  }, [dispatch, albumId, postId]);

  // Function to check if the image is present in any page of the selected album
  const checkImageInAlbumAcrossPages = async (albumIdToCheck) => {
    let page = 1;
    let found = false;
    while (true) {
      // Fetching album images for the current page
      const response = await dispatch(
        thunkGetAlbumImages(albumIdToCheck, page, ITEMS_PER_PAGE)
      );
      found = response.images.some((image) => image.post_id === postId);
      // Break the loop if the image is found or if all pages have been checked
      if (found || page >= Math.ceil(response.total_images / ITEMS_PER_PAGE)) {
        break;
      }
      page++;
    }
    setIsImageInAlbum(found);
    setCurrentPage(found ? page : 1);
  };

  // Function to handle adding the post image to the selected album
  const handleAddToAlbum = async () => {
    const albumToAddTo = isAlbumSpecificMode ? albumId : selectedAlbumId;
    if (albumToAddTo) {
      try {
        // Dispatching action to add the post to the album
        await dispatch(thunkAddPostToAlbum(postId, albumToAddTo));
        // Refreshing album images after the post is added
        await dispatch(
          thunkGetAlbumImages(albumToAddTo, currentPage, ITEMS_PER_PAGE)
        );
        setIsImageInAlbum(true);
        closeShortModal();
      } catch (error) {
        console.error("Error adding post to album:", error);
      }
    }
  };

  return (
    <div className="add-to-album-modal-main">
      <>
        <div className="add-to-album-modal">
          <h2>Add to Album</h2>

          {isAlbumSpecificMode ? (
            <>
              <div className="album-title">
                <strong>
                  Album: {propAlbumTitle || "Album title loading..."}
                </strong>
              </div>
            </>
          ) : (
            <select
              value={selectedAlbumId}
              onChange={(e) => {
                setSelectedAlbumId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Select Album</option>
              {userAlbums.map((album) => (
                <option
                  className="add-to-album-option"
                  key={album.id}
                  value={album.id}
                >
                  {album.title}
                </option>
              ))}
            </select>
          )}
          {selectedAlbumId && (
            <>
              <div className="album-thumbnails-container">
                {currentPage > 1 && (
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className={`pagination-control-left ${
                      isImageInAlbum ? "disabled-button" : ""
                    }`}
                    onClick={() => {
                      if (!isImageInAlbum) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                  />
                )}

                <div className="album-thumbnails-grid">
                  {albumImages.map((image) => (
                    <div
                      className={`thumbnail ${
                        image.post_id === postId ? "in-album" : ""
                      }`}
                    >
                      <img src={image.url} alt="Album Thumbnail" />
                      {image.post_id === postId && (
                        <div className="checkmark-overlay">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {currentPage < totalPages && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={`pagination-control-right ${
                      isImageInAlbum ? "disabled-button" : ""
                    }`}
                    onClick={() => {
                      if (!isImageInAlbum) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}

          <div className="album-add-cancel-btns">
            <button
              onClick={handleAddToAlbum}
              disabled={
                (isAlbumSpecificMode ? !albumId : !selectedAlbumId) ||
                isImageInAlbum
              }
            >
              {isImageInAlbum ? "Already in Album" : "Add to Album"}
            </button>
            <button onClick={closeShortModal}>Cancel</button>
          </div>
        </div>
      </>
    </div>
  );
};

export default AddToAlbumModal;
