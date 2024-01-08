import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
// import { useLoading } from "../../context/LoadingContext";
import { thunkFetchAllFavorites } from "../../store/favorites";
import { thunkGetAlbumImages } from "../../store/albums";
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
  console.log("Mode in ImageDisplay:", mode);
  // Hooks for accessing Redux state and React Router functionality
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId, albumId } = useParams();

  // Selectors to retrieve data from the Redux store
  const userInfo = useSelector(selectPostUserInfo);
  console.log("🚀 ~ file: index.js:46 ~ ImageDisplay ~ userInfo:", userInfo);
  const loading = useSelector(selectLoading);

  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );
  const sessionUser = useSelector(selectSessionUser);
  const userPosts = useSelector(selectUserPosts);
  console.log("🚀 ~ file: index.js:53 ~ ImageDisplay ~ userPosts:", userPosts);
  const userPostsIds = useSelector(selectPostById);
  const albumInfo = useSelector((state) => selectAlbumInfo(state, albumId));
  console.log("🚀 ~ file: index.js:62 ~ ImageDisplay ~ albumInfo:", albumInfo);

  // Ref and state hooks for managing component state and lifecycle
  const isMounted = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const perPage = 10;

  // Function to toggle the 'about' section
  const toggleAbout = useCallback(() => {
    setShowAbout((prevShowAbout) => !prevShowAbout);
  }, []);

  // Function to fetch data based on the current mode and page
  const fetchData = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        // dispatch(setLoading(true));

        // Determine the user ID based on the mode
        const selectedUserId =
          mode === "ownerPhotoStream" || mode === "addPostToAnAlbum"
            ? sessionUser?.id
            : userId;

        let response;

        switch (mode) {
          case "albumImages":
            response = await dispatch(
              thunkGetAlbumImages(albumId, page, perPage)
            );
            break;
          // case "albumManagement":
          case "ownerPhotoStream":
          case "photoStream":
          case "addPostToAnAlbum":
            response = await dispatch(
              thunkGetPostsByUserId(selectedUserId, page, perPage)
            );
            break;
          case "albumManagement":
            response = await dispatch(
              thunkGetPostsByUserId(sessionUser?.id, page, perPage)
            );

            break;
          default:
            response = null;
            break;
        }

        if (response && isMounted.current) {
          setCurrentPage(response.current_page);
          setTotalPages(response.total_pages);
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        dispatch(setError("An error occurred"));
      } finally {
        if (isMounted.current) {
          // dispatch(setLoading(false));
          setIsLoading(false);
        }
      }
    },
    [dispatch, mode, albumId, userId, sessionUser?.id, perPage]
  );

  // useEffect to fetch data when component mounts or dependencies change
  useEffect(() => {
    dispatch(clearUIState());
    fetchData(currentPage);

    return () => (isMounted.current = false);
  }, [dispatch, fetchData, currentPage, mode]);

  // Effect to re-fetch data if the album title changes
  useEffect(() => {
    if (mode === "albumImages" && albumId) {
      fetchData(currentPage);
    }
  }, [fetchData, currentPage, mode, albumId]);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  if (loading) return <Spinner />;

  // Helper functions and variables to process and display images
  const profilePhoto = userInfo?.profile_picture || null;
  const bannerPhoto = userInfo?.banner_picture || null;
  console.log(
    "🚀 ~ file: index.js:147 ~ ImageDisplay ~ bannerPhoto:",
    bannerPhoto
  );
  const userName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;
  const aboutMe = userInfo?.about_me || "No about me information available.";
  const getNavigationUserId = () => {
    return mode === "ownerPhotoStream" ||
      mode === "addPostToAnAlbum" ||
      mode === "albumManagement"
      ? sessionUser?.id
      : userId;
  };

  const getImagesAndDisplayedImages = () => {
    switch (mode) {
      case "albumManagement":
      case "photoStream":
      case "ownerPhotoStream":
      case "addPostToAnAlbum":
        return {
          images: userPostsIds
            .map((id) => userPosts[id]?.image || userPosts[id]?.image_url)
            .filter(Boolean),
          displayedImages: userPostsIds.map((id) => ({
            ...userPosts[id],
            image_url: userPosts[id]?.image_url,
          })),
          // userInfo:
        };
      case "albumImages":
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
        return { images: [], displayedImages: [] };
    }
  };

  // Extracting relevant data for rendering
  const navigationUserId = getNavigationUserId();
  const { images, imageLength, displayedImages } =
    getImagesAndDisplayedImages();

  const noContentMessage =
    (mode === "ownerPhotoStream" ||
      mode === "addPostToAnAlbum" ||
      mode === "albumManagement") &&
    displayedImages?.length === 0;

  if (albumImages?.length === 0 && mode === "albumImages") {
    return (
      <div className="no-content-message">
        <p>No images found in this album.</p>
        {sessionUser?.id === parseInt(userId) ? (
          <div className="add-posts-to-an-album-button-container">
            <button
              className="add-posts-to-an-album-button"
              // onClick={() => history.push(`/owner/posts/add`)}
              onClick={() => history.push(`/owner/posts/albums/${albumId}/add`)}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Add a Post to an Album</span>
            </button>
          </div>
        ) : (
          <p>This album has no images.</p>
        )}
      </div>
    );
  }
  console.log("User posts:", userPosts);
  console.log("User post IDs:", userPostsIds);

  console.log("Displayed images:", displayedImages);
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
              onClick={() => history.push("/albums/users/" + userId)}
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
                            currentPage,
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
            {/* <div className="Images-and-create-btn"> */}
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
                            currentPage,
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
                currentPage={currentPage}
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
