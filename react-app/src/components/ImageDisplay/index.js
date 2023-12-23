import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import Spinner from "../Spinner";
import { thunkGetAlbumImages } from "../../store/albums";
import { fetchUserInfoById } from "../../store/session";
import {
  thunkGetPostsByUserId,
  thunkGetUserPostsNotInAlbum,
} from "../../store/posts";
import { setLoading, setError, clearUIState } from "../../store/ui";
import {
  selectAlbumDetails,
  selectUserPosts,
  selectPostById,
  selectUserPostsWithNoAlbumId,
  selectPostWithNoAlbumIdById,
  selectUserInfo,
  selectLoading,
  selectSessionUser,
  selectAlbumInfo,
} from "../../store/selectors";
import defult_banner_image from "../../assets/images/defult_banner_image.png";
import OpenModalButton from "../Modals/OpenModalButton";
import CreatePostForm from "../Posts/PostForms/CreatePostForm";
import UserProfileManager from "../Users/UserProfile/UserProfileManager";
import AddToAlbumModal from "../Albums/AddToAlbumModal";
import ImageItem from "./ImageItem/ImageItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./ImageDisplay.css";
import ImageGrid from "./ImageGrid/ImageGrid";

const ImageDisplay = memo(({ mode, albumId }) => {
  // Hooks for accessing Redux state and React Router functionality
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();

  // Selectors to retrieve data from the Redux store
  const userInfo = useSelector(selectUserInfo);
  const loading = useSelector(selectLoading);

  // const albumImages = useSelector((state) => selectAlbumDetails(state, albumId));
  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );
  const sessionUser = useSelector(selectSessionUser);
  const userPosts = useSelector(selectUserPosts);
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
            response = await dispatch(thunkGetAlbumImages(albumId, page, perPage));
            break;

          case "ownerPhotoStream":
          case "photoStream":
          case "addPostToAnAlbum":
            response = await dispatch(thunkGetPostsByUserId(selectedUserId, page, perPage));
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

  if (isLoading) return <Spinner />;

  // Helper functions and variables to process and display images
  const profilePhoto = userInfo?.profile_picture || null;
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
          {mode !== "albumImages" && (
            <div className="banner-container">
              <div className="banner">
                {images && images[0] ? (
                  <LazyLoadImage
                    src={images[0]}
                    effect="blur"
                    className="banner-image"
                    width={"100%"}
                    height={"300px"}
                  />
                ) : (
                  <LazyLoadImage
                    src={defult_banner_image}
                    effect="blur"
                    className="banner-image"
                    width={"100%"}
                    height={"300px"}
                  />
                )}

                <div
                  className={
                    mode === "ownerPhotoStream"
                      ? "owner-details"
                      : "user-details"
                  }
                >
                  <div
                    className="profile-picture-container"
                    onClick={() =>
                      mode === "ownerPhotoStream" &&
                      setIsEditingProfilePic(true)
                    }
                  >
                    {profilePhoto && profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="profile-picture"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="profile-picture"
                      />
                    )}

                    {mode === "ownerPhotoStream" && (
                      <div className="edit-icon-overlay">
                        <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                      </div>
                    )}
                  </div>

                  {isEditingProfilePic && (
                    <UserProfileManager
                      setIsEditingProfilePic={setIsEditingProfilePic}
                    />
                  )}

                  <div className="user-name">
                    <h1>{userName || "User Name"}</h1>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            {mode !== "albumImages" && (
              <nav className="album-navigation">
                <UserNavigationBar
                  id={navigationUserId}
                  onAboutClick={toggleAbout}
                  photoCount={imageLength}
                  currentPage={currentPage}
                />
              </nav>
            )}
            {showAbout && (
              <div className="about-section">
                <p>{aboutMe}</p>
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
            {/* Pagination */}
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
