import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
// import { useLoading } from "../../context/LoadingContext";
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
  // Ref and state hooks for managing component state and lifecycle
  const isMounted = useRef(true);
  const { userId, albumId } = useParams();

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
          setCurrentPostPage(response.current_page);
          setTotalPages(response.total_pages);
          setIsDataFetched(true);
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
    fetchData(currentPostPage);

    return () => (isMounted.current = false);
  }, [dispatch, fetchData, currentPostPage, mode]);

  // Effect to re-fetch data if the album title changes
  useEffect(() => {
    if (mode === "albumImages" && albumId) {
      fetchData(currentPostPage);
    }
  }, [fetchData, currentPostPage, mode, albumId]);

  useEffect(() => {
    let idToUse = null;

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

  useEffect(() => {
    fetchData(currentPostPage);
  }, [fetchData, currentPostPage]);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  if (loading) return <Spinner />;

  const aboutMe = userInfo?.about_me || "No about me information available.";

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
  const { displayedImages } = getImagesAndDisplayedImages();

  const noContentMessage = !isLoading && isDataFetched &&
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
