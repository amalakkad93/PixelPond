/**
 * ImageDisplay Component
 *
 * This component is responsible for displaying images in various modes such as 'albumImages',
 * 'photoStream', 'ownerPhotoStream', and 'albumManagement'. It fetches and displays images based on
 * the selected mode, handling pagination and user interactions. The component uses Redux for state
 * management and dispatching actions related to fetching images and posts. It also provides a modal
 * button for creating new posts and integrates dynamic navigation based on the mode and user actions.
 *
 * @param {string} mode - The mode of the component which determines the type of content to display.
 */
import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { thunkFetchAllFavorites } from "../../store/favorites";
import {
  thunkGetAlbumImages,
  thunkGetAlbumsByUserId,
} from "../../store/albums";
import { thunkGetPostsByUserId } from "../../store/posts";
import { setError, clearUIState } from "../../store/ui";
import {
  selectAlbumDetails,
  selectUserPosts,
  selectPostById,
  selectPostUserInfo,
  selectLoading,
  selectSessionUser,
  selectAlbumInfo,
} from "../../store/selectors";

import OpenShortModalButton from "../Modals/OpenShortModalButton";
import Pagination from "../Pagination";
import Spinner from "../Spinner";
import CreatePostForm from "../Posts/PostForms/CreatePostForm";
import ImageGrid from "./ImageGrid/ImageGrid";

import "./ImageDisplay.css";

const ImageDisplay = memo(({ mode }) => {
  // Hooks for accessing Redux state and React Router functionality
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId, albumId } = useParams();
  // State and ref hooks for managing component state and lifecycle
  const isMounted = useRef(true);

  // Selectors to retrieve data from the Redux store
  const userInfo = useSelector(selectPostUserInfo);
  const loading = useSelector(selectLoading);
  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );
  const sessionUser = useSelector(selectSessionUser);
  const userPosts = useSelector(selectUserPosts);
  const userPostsIds = useSelector(selectPostById);
  const albumInfo = useSelector((state) => selectAlbumInfo(state, albumId));

  const [currentAlbumPage, setCurrentAlbumPage] = useState(1);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const perPage = 10;

  // Function to fetch data based on the current mode and page
  const fetchData = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        // Determine the user ID based on the mode for fetching data
        const selectedUserId =
          mode === "ownerPhotoStream" || mode === "addPostToAnAlbum"
            ? sessionUser?.id
            : userId;

        let response;

        // Fetch data based on the current mode
        switch (mode) {
          case "albumImages":
            // Fetching images for a specific album
            response = await dispatch(
              thunkGetAlbumImages(albumId, page, perPage)
            );
            break;
          case "ownerPhotoStream":
          case "photoStream":
          case "addPostToAnAlbum":
            // Fetching user's posts for photo stream or adding posts to an album
            response = await dispatch(
              thunkGetPostsByUserId(selectedUserId, page, perPage)
            );
            break;
          case "albumManagement":
            // Fetching posts for album management
            response = await dispatch(
              thunkGetPostsByUserId(sessionUser?.id, page, perPage)
            );
            break;
          default:
            response = null;
            break;
        }

        // Update state with the fetched data if component is still mounted
        if (response && isMounted.current) {
          setCurrentPostPage(response.current_page);
          setTotalPages(response.total_pages);
          setIsDataFetched(true);
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        dispatch(setError("An error occurred"));
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [dispatch, mode, albumId, userId, sessionUser?.id, perPage]
  );

  // useEffect to initialize data fetching when component mounts
  useEffect(() => {
    dispatch(clearUIState());
    fetchData(currentPostPage);

    // Cleanup function to set isMounted ref to false when the component unmounts
    return () => (isMounted.current = false);
  }, [dispatch, fetchData, currentPostPage, mode]);

  // Effect to re-fetch data if the album title changes
  useEffect(() => {
    if (mode === "albumImages" && albumId) {
      fetchData(currentPostPage);
    }
  }, [fetchData, currentPostPage, mode, albumId]);

  // Effect to fetch data based on mode and user ID
  useEffect(() => {
    let idToUse = null;

    // Determine the user ID to use based on the mode
    if (mode === "ownerPhotoStream") {
      // Use session user ID for ownerPhotoStream mode
      idToUse = sessionUser?.id;
    } else if (["albumManagement", "addPostToAnAlbum"].includes(mode)) {
      // Convert userId from useParams to number for consistency
      const numericUserId = Number(userId);

      // Use userId from useParams if it matches session user ID,
      // or if sessionUser is viewing their own albums
      if (numericUserId === sessionUser?.id) {
        idToUse = numericUserId;
      }
    }

    if (idToUse !== null) {
      dispatch(thunkGetAlbumsByUserId(idToUse, currentAlbumPage, perPage));
      fetchData(currentPostPage);
    }
  }, [dispatch, userId, currentAlbumPage, perPage, mode, sessionUser?.id]);

  // Effect to fetch all favorites if a session user exists
  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  // Conditional rendering based on the loading state
  if (loading) return <Spinner />; // Display a spinner while data is loading

  // 'aboutMe' variable to store user's 'about me' information or a default message
  const aboutMe = userInfo?.about_me || "No about me information available.";

  // Function to determine the images and displayed images based on the current mode
  const getImagesAndDisplayedImages = () => {
    switch (mode) {
      case "albumManagement":
      case "photoStream":
      case "ownerPhotoStream":
      case "addPostToAnAlbum":
        // For these modes, fetch and format images from user posts
        return {
          images: userPostsIds
            .map((id) => userPosts[id]?.image || userPosts[id]?.image_url)
            .filter(Boolean),
          displayedImages: userPostsIds.map((id) => ({
            ...userPosts[id],
            image_url: userPosts[id]?.image_url,
          })),
        };
      case "albumImages":
        // For 'albumImages' mode, fetch and format images from album images
        return {
          images: albumImages?.map((image) => image?.url).filter(Boolean),
          imageLength: albumImages?.length,
          displayedImages: albumImages?.map((image) => ({
            image_url: image?.url,
            imageId: image?.id,
            post_id: image?.post_id,
          })),
        };

      default:
        // Default case when the mode does not match any of the above
        return { images: [], displayedImages: [] };
    }
  };

  // Extract relevant data for rendering based on the current mode
  const { displayedImages } = getImagesAndDisplayedImages();

  // Determine if a no content message should be displayed
  const noContentMessage =
    !isLoading &&
    isDataFetched &&
    (mode === "ownerPhotoStream" ||
      mode === "addPostToAnAlbum" ||
      mode === "albumManagement") &&
    displayedImages?.length === 0;

  // Conditional rendering for the case where an album has no images
  if (albumImages?.length === 0 && mode === "albumImages") {
    return (
      <div className="no-content-message">
        <p>No images found in this album.</p>
        {sessionUser?.id === parseInt(userId) ? (
          // Offer the option to add a post to the album if the session user owns the album
          <div className="add-posts-to-an-album-button-container">
            <button
              className="add-posts-to-an-album-button"
              onClick={() => history.push(`/owner/posts/albums/${albumId}/add`)}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Add a Post to an Album</span>
            </button>
          </div>
        ) : (
          // Display a message if there are no images in the album
          <p>This album has no images.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Render logic based on loading state, mode, and data */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {mode === "albumImages" && (
            <button
              className="back-button"
              onClick={() => history.push(`/albums/users/${userId}`)}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Albums
            </button>
          )}
          {mode === "albumManagement" && (
            <div className="album-management-banner">
              <h2>Album Management</h2>
              <p>Select posts to add or remove from albums</p>
            </div>
          )}
          <div className="photo-stream-container">
            {noContentMessage && (
              <div className="no-content-message">
                <h1>You have no public photos.</h1>
                <OpenShortModalButton
                  className="create-post-button"
                  buttonText="Create Post"
                  modalComponent={
                    <CreatePostForm
                      onPostCreated={() =>
                        dispatch(
                          thunkGetPostsByUserId(
                            sessionUser?.id,
                            currentPostPage,
                            10
                          )
                        )
                      }
                    />
                  }
                />
              </div>
            )}

            {showAbout && (
              <div className="about-section">
                <p>{aboutMe}</p>
              </div>
            )}

            {mode === "ownerPhotoStream" && displayedImages.length > 0 && (
              <div className="create-post-container">
                <OpenShortModalButton
                  className="create-post-button"
                  buttonText="Create Post"
                  modalComponent={
                    <CreatePostForm
                      onPostCreated={() =>
                        dispatch(
                          thunkGetPostsByUserId(
                            sessionUser?.id,
                            currentPostPage,
                            10
                          )
                        )
                      }
                    />
                  }
                />
              </div>
            )}
            {displayedImages && displayedImages.length > 0 && (
              <ImageGrid
                displayedImages={displayedImages}
                albumId={albumId}
                mode={mode}
                albumInfo={albumInfo}
                sessionUser={sessionUser}
              />
            )}
            {displayedImages.length > 0 && (
              <Pagination
                totalItems={totalPages * perPage}
                itemsPerPage={perPage}
                currentPostPage={currentPostPage}
                onPageChange={(newPage) => fetchData(newPage)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default ImageDisplay;
