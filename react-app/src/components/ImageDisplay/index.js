import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
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
} from "../../store/selectors";

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

  const loading = useSelector(selectLoading);
  const albumUserInfo = useSelector(selectAlbumUserInfo);
  const albumImages = useSelector(selectAlbumImages) || [];
  const userInfo = useSelector(selectUserInfo);
  const userPosts = useSelector(selectUserPosts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const perPage = 10;

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

  if (mode === "photoStream") {
    profilePhoto = userInfo?.profile_picture;
    userName = userInfo?.username;
    aboutMe = userInfo?.about_me || "No about me information available.";
    images = userPosts.map((post) => post.image);
    imageLength = userPosts.length;
  } else if (mode === "albumImages") {
    profilePhoto = albumUserInfo?.profile_picture;
    userName = `${albumUserInfo?.first_name || ""} ${
      albumUserInfo?.last_name || ""
    }`;
    aboutMe = albumUserInfo?.about_me || "No about me information available.";
    images = albumImages.map((image) => image?.url);
    imageLength = albumImages?.length;
  }

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="banner-container">
            <div className="banner">
              {images[0] && (
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
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="photo-grid"
              columnClassName="photo-grid_column"
            >
              {images.map((image, index) => {
                const postId =
                  mode === "photoStream"
                    ? userPosts[index]?.id
                    : albumImages[index]?.post_id;

                return (
                  <ImageItem
                    key={index}
                    imageUrl={image}
                    postId={postId}
                    onClick={(postId) => history.push(`/posts/${postId}`)}
                  />
                );
              })}
            </Masonry>
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
