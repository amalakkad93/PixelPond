import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import Spinner from "../Spinner";
import { ThunkGetAlbumImages } from "../../store/albums";
import { thunkGetPostsByUserId } from "../../store/posts";
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
  const albumImages = useSelector(selectAlbumImages) || [];
  const userInfo = useSelector(selectUserInfo);
  const userPosts = useSelector(selectUserPosts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const perPage = 10;

  const sessionUser = useSelector(selectSessionUser);

  const isOwnerMode =
    mode === "ownerPhotoStream" || mode === "ownerAlbumImages";
  const hasContent = isOwnerMode
    ? mode === "ownerPhotoStream"
      ? userPosts.length > 0
      : albumImages.length > 0
    : true;
  useEffect(() => {
    dispatch(clearUIState());

    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        if (location.pathname.includes(`/albums/${albumId}`)) {
          const response = await dispatch(
            ThunkGetAlbumImages(albumId, currentPage, perPage)
          );
          setTotalPages(response.totalPages);
        } else if (location.pathname.includes(`/users/${userId}`)) {
          const response = await dispatch(
            thunkGetPostsByUserId(userId, currentPage, perPage)
          );
          setTotalPages(response.totalPages);
        }

        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, userId, albumId, currentPage, perPage, location.pathname]);

  const toggleAbout = () => setShowAbout(!showAbout);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  let profilePhoto, userName, aboutMe, images, imageLength;

  // if (mode === "photoStream") {
  //   profilePhoto = userInfo?.profile_picture;
  //   userName = userInfo?.username;
  //   aboutMe = userInfo?.about_me || "No about me information available.";
  //   images = userPosts.map((post) => post.image)|| [];
  //   imageLength = userPosts.length;
  // } else if (mode === "albumImages") {
  //   profilePhoto = albumUserInfo?.profile_picture;
  //   userName = `${albumUserInfo?.first_name || ""} ${
  //     albumUserInfo?.last_name || ""
  //   }`;
  //   aboutMe = albumUserInfo?.about_me || "No about me information available.";
  //   images = albumImages.map((image) => image?.url) || [];
  //   imageLength = albumImages?.length;
  // }
  if (mode === "photoStream") {
    profilePhoto = userInfo?.profile_picture;

    userName = `${ userInfo?.first_name || ""} ${
      userInfo?.last_name || ""
    }`;
    aboutMe = userInfo?.about_me || "No about me information available.";
    images = userPosts.map((post) => post.image).filter(Boolean); // Filter out falsy values
    imageLength = userPosts.length;
  } else if (mode === "albumImages") {
    profilePhoto = albumUserInfo?.profile_picture;
    userName = `${albumUserInfo?.first_name || ""} ${
      albumUserInfo?.last_name || ""
    }`;
    aboutMe = albumUserInfo?.about_me || "No about me information available.";
    images = albumImages.map((image) => image?.url).filter(Boolean); // Filter out falsy values
    imageLength = albumImages?.length;
  }

  if (mode === "ownerPhotoStream") {
    profilePhoto = sessionUser?.profile_picture;
    // userName = sessionUser?.username;

    userName = `${sessionUser?.first_name || ""} ${
      sessionUser?.last_name || ""
    }`;
    aboutMe = sessionUser?.about_me || "No about me information available.";
    images = userPosts.map((post) => post.image).filter(Boolean); // Filter out falsy values
    imageLength = userPosts.length;
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
              <div className="user-details">
                {profilePhoto && (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="profile-picture"
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
                id={mode === "photoStream" ? userId : albumId}
                onAboutClick={toggleAbout}
                photoCount={imageLength}
              />
            </nav>
            {showAbout && (
              <div className="about-section">
                <p>{aboutMe}</p>
              </div>
            )}
            {images && images.length > 0 && (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="photo-grid"
                columnClassName="photo-grid_column"
              >
                {console.log("Images array:", images)}
                {images.map((image, index) => {
                  const postId =
                    mode === "photoStream"
                      ? userPosts[index]?.id
                      : albumImages[index]?.post_id;
                  console.log(`Rendering image at index ${index}:`, image);
                  return (
                    <ImageItem
                      key={index}
                      imageUrl={image}
                      postId={postId}
                      onClick={() => history.push(`/posts/${postId}`)}
                    />
                  );
                })}
              </Masonry>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
              useRedux={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageDisplay;
