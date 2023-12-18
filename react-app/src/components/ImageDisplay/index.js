import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../Pagination";
import UserNavigationBar from "../Navigation/UserNavigationBar";
import Spinner from "../Spinner";
import { ThunkGetAlbumImages } from "../../store/albums";
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
import UserProfileManager from "../UserProfile/UserProfileManager";

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
  const albumImages = useSelector(selectAlbumImages) || [];
  // const userInfo = useSelector(selectUserInfo);
  // const userPosts = useSelector(selectUserPosts);
  const sessionUser = useSelector(selectSessionUser);
  const currentPage = useSelector(
    (state) => state.posts.pagination.currentPage
  );
  const totalPages = useSelector((state) => state.posts.pagination.totalPages);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);

  const userPosts = useSelector((state) => state.posts.userPosts.byId);
  const userPostsIds = useSelector((state) => state.posts.userPosts.allIds);
  const userInfo = useSelector((state) => state.posts.userInfo);


  const [localProfilePhoto, setLocalProfilePhoto] = useState(sessionUser?.profile_picture);
  const [reloadPage, setReloadPage] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);

  const perPage = 10;

  const isOwnerMode =
    mode === "ownerPhotoStream" || mode === "ownerAlbumImages";
  const hasContent = isOwnerMode
    ? mode === "ownerPhotoStream"
      ? userPosts.length > 0
      : albumImages.length > 0
    : true;

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

  useEffect(() => {
    setLocalProfilePhoto(sessionUser?.profile_picture);
  }, [sessionUser]);

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

    userName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;
    aboutMe = userInfo?.about_me || "No about me information available.";
    images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);
    imageLength = userPostsIds.length;
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
    // images = userPosts.map((post) => post.image).filter(Boolean); // Filter out falsy values
    images = userPostsIds.map((id) => userPosts[id]?.image).filter(Boolean);

    imageLength = userPosts.length;
  }



  const refreshUserPosts = async () => {

    dispatch(thunkGetPostsByUserId(sessionUser?.id, currentPage, perPage));
  };
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
              {/* <div className="user-details">
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
              </div> */}

              {/* <div className="user-details">
                <div
                  className="profile-picture-container"
                  onClick={() => setIsEditingProfilePic(true)}
                >
                  {profilePhoto ? (
                    <>
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="profile-picture"
                      />
                      {sessionUser && sessionUser.id === userId && (
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="edit-icon inside-profile"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        // className="profile-icon-imageDisplay"
                        className="profile-picture"
                      />
                      {sessionUser && sessionUser.id === userId && (
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="edit-icon inside-default-icon"
                        />
                      )}
                    </>
                  )}
                </div>
                {isEditingProfilePic && <UserProfileManager setIsEditingProfilePic={setIsEditingProfilePic} />}
                <div className="user-name">
                  <h1>{userName || "User Name"}</h1>
                </div>
              </div> */}

              <div className="user-details">
                <div
                  className="profile-picture-container"
                  onClick={() => setIsEditingProfilePic(true)}
                >
                  {/* {profilePhoto ? ( */}
                  {localProfilePhoto ? (
                    <>
                      <img
                        // src={profilePhoto}
                        src={localProfilePhoto}
                        alt="Profile"
                        className="profile-picture"
                      />
                      {sessionUser && sessionUser.id === userId && (
                        <div className="edit-icon-overlay">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="edit-icon"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="profile-picture"
                      />
                      {sessionUser && sessionUser.id === userId && (
                        <div className="edit-icon-overlay">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="edit-icon"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {isEditingProfilePic && (
                  <UserProfileManager
                    setIsEditingProfilePic={setIsEditingProfilePic}
                    onProfilePicUpdate={(newProfilePicUrl) => setLocalProfilePhoto(newProfilePicUrl)}
                    refreshPageData ={refreshUserPosts }
                    // setReloadPage={setReloadPage}
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
                id={
                  mode === "ownerPhotoStream"
                    ? sessionUser?.id
                    : mode === "photoStream"
                    ? userId
                    : albumId
                }
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
            {images && images.length > 0 && (
              <>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="photo-grid"
                  columnClassName="photo-grid_column"
                >
                  {userPostsIds.map((id) => {
                    const post = userPosts[id];
                    return (
                      <ImageItem
                        key={id}
                        imageUrl={post?.image}
                        postId={post?.id}
                        onClick={() => history.push(`/posts/${post?.id}`)}
                      />
                    );
                  })}
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

// import React, { useEffect, useState, memo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useHistory, useLocation, Link } from "react-router-dom";
// import Masonry from "react-masonry-css";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import Pagination from "../Pagination";
// import UserNavigationBar from "../Navigation/UserNavigationBar";
// import Spinner from "../Spinner";
// import { ThunkGetAlbumImages } from "../../store/albums";
// import {
//   thunkGetLoggedInUserPosts,
//   thunkGetPostsByUserId,
//   setCurrentPage,
//   setTotalPages
// } from "../../store/posts";
// import { setLoading, setError, clearUIState } from "../../store/ui";
// import {
//   selectAlbumImages,
//   selectAlbumUserInfo,
//   selectUserPosts,
//   selectUserInfo,
//   selectLoading,
//   selectSessionUser,
// } from "../../store/selectors";

// import OpenModalButton from "../Modals/OpenModalButton";
// import CreatePostForm from "../Posts/PostForms/CreatePostForm";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import "./ImageDisplay.css";

// const ImageItem = memo(({ imageUrl, postId, onClick }) => (
//   <div className="photo-item" onClick={() => onClick(postId)}>
//     <LazyLoadImage src={imageUrl} alt="Photo" effect="blur" />
//   </div>
// ));

// const ImageDisplay = ({ mode }) => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const location = useLocation();
//   const { userId, albumId } = useParams();
//   console.log("🚀 ~ file: index.js:37 ~ ImageDisplay ~ userId:", userId);

//   const loading = useSelector(selectLoading);
//   const albumUserInfo = useSelector(selectAlbumUserInfo);
//   const albumImages = useSelector(selectAlbumImages) || [];
//   const userInfo = useSelector(selectUserInfo);
//   const userPosts = useSelector(selectUserPosts);

// const currentPage = useSelector(state => state.posts.pagination.currentPage);
// const totalPages = useSelector(state => state.posts.pagination.totalPages);
//   console.log("Total Pages from Redux:", totalPages);
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [totalPages, setTotalPages] = useState(1);
//   const [showAbout, setShowAbout] = useState(false);

//   const perPage = 10;

//   const sessionUser = useSelector(selectSessionUser);

//   const isOwnerMode =
//     mode === "ownerPhotoStream" || mode === "ownerAlbumImages";
//   const hasContent = isOwnerMode
//     ? mode === "ownerPhotoStream"
//       ? userPosts.length > 0
//       : albumImages.length > 0
//     : true;

//   useEffect(() => {
//     dispatch(clearUIState());

//     const fetchData = async () => {
//       try {
//         dispatch(setLoading(true));

//         const targetUserId = location.pathname.includes(`/owner/photostream`)
//           ? sessionUser.id
//           : userId;

//         if (location.pathname.includes(`/albums/${albumId}`)) {
//           const response = await dispatch(
//             ThunkGetAlbumImages(albumId, currentPage, perPage)
//           );
//           // setTotalPages(response.totalPages);
//           dispatch(setTotalPages(response.totalPages));

//         } else if (
//           location.pathname.includes(`/users/${userId}`) ||
//           location.pathname.includes(`/owner/photostream`)
//         ) {
//           const response = await dispatch(
//             thunkGetPostsByUserId(targetUserId, currentPage, perPage)
//           );
//           // setTotalPages(response.totalPages);
//           dispatch(setTotalPages(response.totalPages))
//           console.log("+++ImageDisplay - User posts updated:", userPosts);
//         }

//         dispatch(setLoading(false));
//       } catch (err) {
//         dispatch(setError("An error occurred"));
//         dispatch(setLoading(false));
//       }
//     };

//     fetchData();
//   }, [dispatch, userId, albumId, currentPage, perPage, location.pathname]);

//   const toggleAbout = () => setShowAbout(!showAbout);

//   const breakpointColumnsObj = {
//     default: 4,
//     1100: 3,
//     700: 2,
//     500: 1,
//   };

//   let profilePhoto, userName, aboutMe, images, imageLength;

//   if (mode === "photoStream") {
//     profilePhoto = userInfo?.profile_picture;

//     userName = `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`;
//     aboutMe = userInfo?.about_me || "No about me information available.";
//     images = userPosts.map((post) => post.image).filter(Boolean); // Filter out falsy values
//     imageLength = userPosts.length;
//   } else if (mode === "albumImages") {
//     profilePhoto = albumUserInfo?.profile_picture;
//     userName = `${albumUserInfo?.first_name || ""} ${
//       albumUserInfo?.last_name || ""
//     }`;
//     aboutMe = albumUserInfo?.about_me || "No about me information available.";
//     images = albumImages.map((image) => image?.url).filter(Boolean); // Filter out falsy values
//     imageLength = albumImages?.length;
//   }

//   if (mode === "ownerPhotoStream") {
//     profilePhoto = sessionUser?.profile_picture;
//     // userName = sessionUser?.username;

//     userName = `${sessionUser?.first_name || ""} ${
//       sessionUser?.last_name || ""
//     }`;
//     aboutMe = sessionUser?.about_me || "No about me information available.";
//     images = userPosts.map((post) => post.image).filter(Boolean); // Filter out falsy values
//     imageLength = userPosts.length;
//   }
//   // const handlePageChange = (newPage) => {
//   //   setCurrentPage(newPage);
//   // };
//   return (
//     <div>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <>
//           <div className="banner-container">
//             <div className="banner">
//               {images?.[0] && (
//                 <LazyLoadImage
//                   src={images[0]}
//                   effect="blur"
//                   className="banner-image"
//                   width={"100%"}
//                   height={"300px"}
//                 />
//               )}
//               <div className="user-details">
//                 {profilePhoto && (
//                   <img
//                     src={profilePhoto}
//                     alt="Profile"
//                     className="profile-picture"
//                   />
//                 )}
//                 <div className="user-name">
//                   <h1>{userName || "User Name"}</h1>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="photo-stream-container">
//             {(!images || images.length === 0) &&
//               mode === "ownerPhotoStream" && (
//                 <div className="no-content-message">
//                   <h1>You have no public photos.</h1>
//                   <OpenModalButton
//                     className="create-post-button"
//                     buttonText="Create Post"
//                     modalComponent={
//                       <CreatePostForm
//                       // setReloadPage={setReloadPage}
//                       />
//                     }
//                   />
//                 </div>
//               )}
//             <nav className="album-navigation">
//               <UserNavigationBar
//                 id={
//                   mode === "ownerPhotoStream"
//                     ? sessionUser.id
//                     : mode === "photoStream"
//                     ? userId
//                     : albumId
//                 }
//                 onAboutClick={toggleAbout}
//                 photoCount={imageLength}
//                 currentPage={currentPage}
//               />
//             </nav>
//             {showAbout && (
//               <div className="about-section">
//                 <p>{aboutMe}</p>
//               </div>
//             )}
//             {images && images.length > 0 && (
//               <>
//                 <Masonry
//                   breakpointCols={breakpointColumnsObj}
//                   className="photo-grid"
//                   columnClassName="photo-grid_column"
//                 >
//                   {console.log("Images array:", images)}
//                   {images.map((image, index) => {
//                     const postId =
//                       mode === "photoStream"
//                         ? userPosts[index]?.id
//                         : albumImages[index]?.post_id;
//                     console.log(`Rendering image at index ${index}:`, image);
//                     return (
//                       <ImageItem
//                         key={index}
//                         imageUrl={image}
//                         postId={postId}
//                         onClick={() => history.push(`/posts/${postId}`)}
//                       />
//                     );
//                   })}
//                 </Masonry>
//               </>
//             )}

//             {/* Pagination */}
//             {/* <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={(newPage) =>  {
//                 console.log("Requested new page:", newPage);

//                   setCurrentPage(newPage);

//               }}
//               useRedux={false}
//               // useRedux={true}
//             /> */}
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={(newPage) =>  dispatch(setCurrentPage(newPage))}
//             />
//             {/* <div className="pagination-controls">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="pagination-button"
//           >
//             <FontAwesomeIcon icon={faArrowLeft} />
//           </button>
//           <span>Page {currentPage}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             className="pagination-button"
//           >
//             <FontAwesomeIcon icon={faArrowRight} />
//           </button>
//         </div> */}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ImageDisplay;
