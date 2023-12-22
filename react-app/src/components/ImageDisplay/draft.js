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
  thunkGetUserPostsNotInAlbum,
  setCurrentPagePost,
  setTotalPagesPost,
} from "../../store/posts";
import { setLoading, setError, clearUIState } from "../../store/ui";
import {
  selectAlbumImages,
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
import AddToAlbumModal from "../Albums/AddToAlbumModal"
import ImageItem from "./ImageItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ImageDisplay.css";


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
  const userPosts = useSelector(selectUserPosts);
  const userPostsIds = useSelector(selectPostById);

  const userPostsWithNoAlbumId = useSelector(selectUserPostsWithNoAlbumId);
  const userPostsWithNoAlbumIdIds = useSelector(selectPostWithNoAlbumIdById);

  const albumInfo = useSelector((state) => selectAlbumInfo(state, albumId));

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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

  console.log(
    "**********************************sessionUser.id",
    sessionUser.id
  );
  const fetchData = async (page) => {
    try {
      dispatch(setLoading(true));
      let response;
      const targetUserId =
        location.pathname.includes(`/owner/photostream`) ||
        location.pathname.includes(`/owner/unassigned-posts`)
          ? sessionUser?.id
          : userId;

      // if (location.pathname.includes(`/albums/${albumId}`)) {
      if (albumId) {
        // Fetch album images if an albumId is present
        response = await dispatch(ThunkGetAlbumImages(albumId, page, perPage));
      } else if (
        location.pathname.includes(`/users/${userId}`) ||
        location.pathname.includes(`/owner/photostream`)
      ) {
        // Fetch user posts if on a user's photostream
        response = await dispatch(
          thunkGetPostsByUserId(targetUserId, page, perPage)
        );
      } else if (location.pathname.includes(`/owner/unassigned-posts`)) {
        // Fetch posts not in any album for the logged-in user
        response = await dispatch(
          thunkGetUserPostsNotInAlbum(sessionUser?.id, page, perPage)
        );
      }

      if (response) {
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
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
      images = userPostsIds
        .map((id) => userPosts[id]?.image_url)
        .filter(Boolean);
      imageLength = userPostsIds.length;
      displayedImages = userPostsIds.map((id) => ({
        ...userPosts[id],
        image_url: userPosts[id]?.image_url,
      }));
      break;

    case "ownerPhotoStream":
      navigationUserId = sessionUser?.id;
      images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);
      imageLength = userPosts?.length;
      displayedImages = userPostsIds.map((id) => userPosts[id]);
      break;

    case "unassignedPosts":
      navigationUserId = sessionUser?.id;
      images = userPostsWithNoAlbumIdIds.map((id) => userPostsWithNoAlbumIdIds[id]?.image).filter(Boolean);
      imageLength = userPosts?.length;
      displayedImages = userPostsWithNoAlbumIdIds.map((id) => userPostsWithNoAlbumId[id]);
      break;

    case "albumImages":
      navigationUserId = albumInfo?.userId;
      images = albumImages.map((image) => image?.url).filter(Boolean);
      imageLength = albumImages?.length;
      displayedImages = albumImages.map((image) => ({
        image_url: image?.url,
        imageId: image?.id,
        post_id: image?.post_id,
      }));
      break;

    default:
      break;
  }

  const noContentMessage =
    mode === "ownerPhotoStream" && displayedImages?.length === 0;

  console.log(
    "**********************************displayedImages",
    displayedImages
  );
  console.log("**********************************images", images);

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

            {displayedImages && displayedImages?.length > 0 && (
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
                      postId={post?.id || post?.post_id}
                      onClick={() => history.push(`/posts/${post?.id || post?.post_id}`)}
                      isUnassignedMode={mode === "unassignedPosts"}
                     
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
              onPageChange={(newPage) => fetchData(newPage)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageDisplay;
