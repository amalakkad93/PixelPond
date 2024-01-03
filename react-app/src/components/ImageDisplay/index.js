import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";

import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import Spinner from "../Spinner";
import { thunkGetAlbumImages } from "../../store/albums";
import { thunkGetPostsByUserId } from "../../store/posts";
import { setLoading, setError, clearUIState } from "../../store/ui";
import {
  selectAlbumDetails,
  selectUserPosts,
  selectPostById,
  selectPostUserInfo,
  selectLoading,
  selectSessionUser,
  selectAlbumInfo,
} from "../../store/selectors";
import defult_banner_image from "../../assets/images/defult_banner_image.png";
import OpenModalButton from "../Modals/OpenModalButton";
import OpenShortModalButton from "../Modals/OpenShortModalButton";
import CreatePostForm from "../Posts/PostForms/CreatePostForm";
import UserProfileManager from "../Users/UserProfile/UserProfileManager";
import ProfilePictureUpdater from "../Users/UserProfile/ProfilePictureUpdater";
import AddToAlbumModal from "../Albums/AddToAlbumModal";
import ImageItem from "./ImageItem/ImageItem";
import { thunkFetchAllFavorites } from "../../store/favorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./ImageDisplay.css";
import ImageGrid from "./ImageGrid/ImageGrid";
import BannerNavbar from "../Navigation/BannerNavbar";

const ImageDisplay = memo(({ mode, albumId }) => {
  // Hooks for accessing Redux state and React Router functionality
  const dispatch = useDispatch();
  const { userId } = useParams();

  // Selectors to retrieve data from the Redux store
  const userInfo = useSelector(selectPostUserInfo);
  console.log("🚀 ~ file: index.js:46 ~ ImageDisplay ~ userInfo:", userInfo)
  const loading = useSelector(selectLoading);

  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );
  const sessionUser = useSelector(selectSessionUser);
  const userPosts = useSelector(selectUserPosts);
  console.log("🚀 ~ file: index.js:53 ~ ImageDisplay ~ userPosts:", userPosts)
  const userPostsIds = useSelector(selectPostById);
  const albumInfo = useSelector((state) => selectAlbumInfo(state, albumId));

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
        dispatch(setLoading(true));

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

          case "ownerPhotoStream":
          case "photoStream":
          case "addPostToAnAlbum":
            response = await dispatch(
              thunkGetPostsByUserId(selectedUserId, page, perPage)
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
          dispatch(setLoading(false));
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
    if (mode === "albumImages") {
      fetchData(currentPage);
    }
  }, [albumTitle, fetchData, currentPage, mode]);

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  if (loading) return <Spinner />;

  // Helper functions and variables to process and display images
  const profilePhoto = userInfo?.profile_picture || null;
  const bannerPhoto = userInfo?.banner_picture || null;
  console.log("🚀 ~ file: index.js:147 ~ ImageDisplay ~ bannerPhoto:", bannerPhoto)
  const userName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;
  const aboutMe = userInfo?.about_me || "No about me information available.";
  const getNavigationUserId = () => {
    return mode === "ownerPhotoStream" || mode === "addPostToAnAlbum"
      ? sessionUser?.id
      : userId;
  };

  const getImagesAndDisplayedImages = () => {
    switch (mode) {
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
    (mode === "ownerPhotoStream" || mode === "addPostToAnAlbum") &&
    displayedImages?.length === 0;

  return (
    <div>
      {/* Render logic based on loading state, mode, and data */}
      {loading ? (
        <Spinner />
      ) : (
        <>

          <div className="photo-stream-container">
            {noContentMessage && (
              <div className="no-content-message">
                <h1>You have no public photos.</h1>
                <OpenModalButton
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
                mode={mode}
                albumInfo={albumInfo}
                sessionUser={sessionUser}
              />
            )}
            <Pagination
              totalItems={totalPages * perPage}
              itemsPerPage={perPage}
              currentPage={currentPage}
              onPageChange={(newPage) => fetchData(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
});

export default ImageDisplay;
