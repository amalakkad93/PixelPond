import React, { useEffect, useState, memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import Spinner from "../Spinner";
import { ThunkGetAlbumImages } from "../../store/albums";
import { fetchUserInfoById } from "../../store/session";
import {
  thunkGetLoggedInUserPosts,
  thunkGetPostsByUserId,
  setCurrentPagePost,
  setTotalPagesPost,
} from "../../store/posts";
import { setLoading, setError, clearUIState } from "../../store/ui";
import {
  selectAlbumImages,
  selectAlbumUserInfo,
  selectUserPosts,
  selectUserInfo,
  selectLoading,
  selectSessionUser,
  selectAlbumInfo,
  selectUserById,
  selectPostById,
  selectTotalPages,
  selectCurrentPage,
} from "../../store/selectors";
import defult_banner_image from "../../assets/images/defult_banner_image.png";
import OpenModalButton from "../Modals/OpenModalButton";
import CreatePostForm from "../Posts/PostForms/CreatePostForm";
import UserProfileManager from "../Users/UserProfile/UserProfileManager";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./ImageDisplay.css";

const ImageItem = memo(({ imageUrl, postId, onClick }) => (
  <div className="photo-item" onClick={() => onClick(postId)}>
    <LazyLoadImage src={imageUrl} alt="Photo" effect="blur" />
  </div>
));

const ImageDisplay = ({ mode, albumId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // const { userId, albumId } = useParams();
  const { userId } = useParams();
  const userInfo = useSelector(selectUserInfo);
  const loading = useSelector(selectLoading);
  const albumImages = useSelector((state) => selectAlbumImages(state, albumId));
  const sessionUser = useSelector(selectSessionUser);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const userPosts = useSelector(selectUserPosts);
  console.log("🚀 ~ file: index.js:60 ~ userPosts:", userPosts)
  const userPostsIds = useSelector(selectPostById);
  const usersById = useSelector(selectUserById);
  const albumInfo = useSelector((state) => selectAlbumInfo(state, albumId));

  const [showAbout, setShowAbout] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const perPage = 10;

  const idToFetch =
    mode === "photoStream"
      ? userId
      : mode === "ownerPhotoStream"
      ? sessionUser?.id
      : mode === "albumImages"
      ? albumInfo?.userId
      : null;

  const fetchData = async (page) => {
    try {
      dispatch(setLoading(true));
      const targetUserId = location.pathname.includes(`/owner/photostream`)
        ? sessionUser.id
        : userId;

      // if (location.pathname.includes(`/albums/${albumId}`)) {
      if (albumId) {
        await dispatch(ThunkGetAlbumImages(albumId, page, perPage));
      } else if (
        location.pathname.includes(`/users/${userId}`) ||
        location.pathname.includes(`/owner/photostream`)
      ) {
        await dispatch(thunkGetPostsByUserId(targetUserId, page, perPage));
      }
    } catch (err) {
      dispatch(setError("An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    dispatch(clearUIState());
    fetchData(currentPage);
  }, [
    dispatch,
    userId,
    albumId,
    currentPage,
    perPage,
    location.pathname,
    mode,
  ]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   if (idToFetch && !usersById?.[idToFetch]) {
  //     dispatch(fetchUserInfoById(idToFetch));
  //   }
  //   setIsLoading(false);
  // }, [dispatch, idToFetch, usersById]);

  if (isLoading) return <Spinner />;
  // const userInfo = usersById?.[idToFetch] || {};

  const toggleAbout = () => setShowAbout(!showAbout);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  let profilePhoto,
    userName,
    aboutMe,
    images,
    imageLength,
    displayedImages,
    navigationUserId;

  profilePhoto = userInfo?.profile_picture || null;
  userName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;
  aboutMe = userInfo?.about_me || "No about me information available.";

  switch (mode) {
    case "photoStream":
      navigationUserId = userId;
      images = userPostsIds.map((id) => userPosts[id]?.image_url).filter(Boolean);
      imageLength = userPostsIds.length;
      displayedImages = userPostsIds.map((id) => userPosts[id]);
      break;

    case "ownerPhotoStream":
      navigationUserId = sessionUser?.id;
      images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);
      imageLength = userPosts.length;
      displayedImages = userPostsIds.map((id) => userPosts[id]);
      break;

    case "albumImages":
      navigationUserId = albumInfo?.userId;
      images = albumImages.map((image) => image?.url).filter(Boolean);
      imageLength = albumImages?.length;
      displayedImages = albumImages.map((image) => ({
        image: image.url,
        id: image.id,
      }));
      break;

    default:
      break;
  }
  console.log("🚀 ~ file: index.js:330 ~ fetchData ~   displayedImages:",  displayedImages)
  return (
    <div>
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
            {(!images || images.length === 0) &&
              mode === "ownerPhotoStream" && (
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
                              sessionUser.id,
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
              <>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="photo-grid"
                  columnClassName="photo-grid_column"
                >
                  {displayedImages.map((post) => (
                    <ImageItem
                      key={post?.id}
                      imageUrl={post?.image_url}
                      postId={post?.id}
                      onClick={() => history.push(`/posts/${post?.id}`)}
                    />
                  ))}
                </Masonry>
              </>
            )}
            {/* Pagination */}
            <Pagination
              totalItems={totalPages * perPage}
              itemsPerPage={perPage}
              currentPage={currentPage}
              onPageChange={(newPage) => {
                let targetUserId = userId;
                if (mode === "ownerPhotoStream") targetUserId = sessionUser.id;
                if (targetUserId)
                  dispatch(
                    thunkGetPostsByUserId(targetUserId, newPage, perPage)
                  );
                else console.error("User ID is undefined.");
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};


export default ImageDisplay;
