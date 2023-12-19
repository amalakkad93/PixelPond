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
} from "../../store/selectors";

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

const ImageDisplay = ({ mode }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { userId, albumId } = useParams();
  console.log("🚀 ~ file: index.js:37 ~ ImageDisplay ~ userId:", userId);

  const loading = useSelector(selectLoading);
  const albumUserInfo = useSelector(selectAlbumUserInfo);
  const albumImages = useSelector((state) => selectAlbumImages(state, albumId));
  // const userInfo = useSelector(selectUserInfo);
  // const userPosts = useSelector(selectUserPosts);
  const sessionUser = useSelector(selectSessionUser);
  const currentPage = useSelector(
    (state) => state.posts.pagination.currentPage
  );
  const totalPages = useSelector((state) => state.posts.pagination.totalPages);

  const userPosts = useSelector((state) => state.posts.userPosts.byId);
  const userPostsIds = useSelector((state) => state.posts.userPosts.allIds);
  // const userInfo = useSelector((state) => state.posts.userInfo);

  const usersById = useSelector((state) => state.session.usersById);

  const albumInfo = useSelector(
    (state) => state.albums.singleAlbum.byId[albumId]
  );
  console.log("🚀 ~ file: index.js:67 ~ ImageDisplay ~ albumInfo:", albumInfo);

  const [localProfilePhoto, setLocalProfilePhoto] = useState(
    sessionUser?.profile_picture
  );
  const [reloadPage, setReloadPage] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

  const perPage = 10;



  const idToFetch = mode === "photoStream" ? userId
                 : mode === "ownerPhotoStream" ? sessionUser?.id
                 : mode === "albumImages" ? albumInfo?.userId
                 : null;
  const fetchData = async (page) => {
    try {
      dispatch(setLoading(true));
      const targetUserId = location.pathname.includes(`/owner/photostream`)
        ? sessionUser.id
        : userId;

      if (location.pathname.includes(`/albums/${albumId}`)) {
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
    reloadPage,
  ]);

  // useEffect(() => {
  //   setLocalProfilePhoto(sessionUser?.profile_picture);
  // }, [sessionUser]);

  // ===============================================================================
  // const [userInfo, setUserInfo] = useState(null);
  // const userInfo = useSelector((state) => state.session.userInfoForDisplay, shallowEqual);

// Now use `userInfo` directly in your component


  // Fetching user info based on mode
  // useEffect(() => {
  //   let idToFetch;
  //   if (mode === "photoStream" || mode === "ownerPhotoStream") {
  //     idToFetch = mode === "ownerPhotoStream" ? sessionUser?.id : userId;
  //   } else if (mode === "albumImages" && albumInfo) {
  //     idToFetch = albumInfo?.userId;
  //   }

  //   if (idToFetch && !usersById?.[idToFetch]) {
  //     dispatch(fetchUserInfoById(idToFetch));
  //   }
  // }, [dispatch, mode, userId, sessionUser?.id, albumId, albumInfo, usersById]);


  // useEffect(() => {
  //   let idToFetch;
  //   if (mode === "photoStream" || mode === "ownerPhotoStream") {
  //     idToFetch = mode === "ownerPhotoStream" ? sessionUser?.id : userId;
  //   } else if (mode === "albumImages" && albumInfo) {
  //     idToFetch = albumInfo?.userId;
  //   }

  //   // Fetch user info only if it's not already in usersById or if the id has changed
  //   if (idToFetch && (!usersById?.[idToFetch] || userInfo?.id !== idToFetch)) {
  //     dispatch(fetchUserInfoById(idToFetch))
  //       .then(() => {
  //         setUserInfo(usersById?.[idToFetch]);
  //       });
  //   }
  // }, [dispatch, mode, userId, sessionUser?.id, albumId, albumInfo, usersById, userInfo?.id]);


  // useEffect(() => {
  //   let idToFetch;
  //   if (mode === "photoStream") {
  //     idToFetch = userId;
  //   } else if (mode === "ownerPhotoStream") {
  //     idToFetch = sessionUser?.id;
  //   } else if (mode === "albumImages") {
  //     idToFetch = albumInfo?.userId;
  //   }

  //   if (idToFetch) {
  //     dispatch(fetchUserInfoById(idToFetch));
  //   }
  // }, [dispatch, mode, userId, sessionUser?.id, albumInfo?.userId]);

  // useEffect(() => {

  //   const fetchUserData = async (id) => {
  //     if (id && !usersById?.[id]) {
  //       await dispatch(fetchUserInfoById(id));
  //     }
  //   };

  //   if (mode === "photoStream") {
  //     fetchUserData(userId);
  //   } else if (mode === "ownerPhotoStream") {
  //     fetchUserData(sessionUser?.id);
  //   } else if (mode === "albumImages") {
  //     fetchUserData(albumInfo?.userId);
  //   }
  // }, [dispatch, mode, userId, sessionUser?.id, albumInfo?.userId, usersById]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (idToFetch && !usersById?.[idToFetch]) {
      dispatch(fetchUserInfoById(idToFetch));
    }
    setIsLoading(false);
  }, [dispatch, idToFetch, usersById]);
  if (isLoading) return <Spinner />;
  const userInfo = usersById?.[idToFetch] || {};
  // ===============================================================================

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
      navigationUserId = userId
      images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);
      imageLength = userPostsIds.length;
      displayedImages = userPostsIds.map((id) => userPosts[id]);
      break;

    case "ownerPhotoStream":
      navigationUserId = sessionUser?.id
      images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);
      imageLength = userPosts.length;
      displayedImages = userPostsIds.map((id) => userPosts[id]);
      break;

    case "albumImages":
      navigationUserId = albumInfo?.userId
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


  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="banner-container">
            <div className="banner">
              {images?.[0] && (
                <LazyLoadImage
                  src={images[0]}
                  effect="blur"
                  className="banner-image"
                  width={"100%"}
                  height={"300px"}
                />
              )}

              <div
                className={
                  mode === "ownerPhotoStream" ? "owner-details" : "user-details"
                }
              >
                <div
                  className="profile-picture-container"
                  onClick={() =>
                    mode === "ownerPhotoStream" && setIsEditingProfilePic(true)
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
                    // onProfilePicUpdate={(newProfilePicUrl) =>
                    //   setLocalProfilePhoto(newProfilePicUrl)
                    // }
                    // refreshPageData={dispatch(fetchUserInfoById(sessionUser.id))}
                  />
                )}

                <div className="user-name">
                  <h1>{userName || "User Name"}</h1>
                </div>
              </div>
            </div>
          </div>
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
                      // setReloadPage={setReloadPage}
                      />
                    }
                  />
                </div>
              )}
            <nav className="album-navigation">
              <UserNavigationBar
                id={navigationUserId}
                onAboutClick={toggleAbout}
                photoCount={imageLength}
                currentPage={currentPage}
              />
            </nav>
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
                      imageUrl={post?.image}
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

