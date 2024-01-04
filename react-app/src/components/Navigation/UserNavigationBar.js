import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { selectSessionUser } from "../../store/selectors";
import "./UserNavigationBar.css";

// const UserNavigationBar = ({
//   id,
//   mode,
//   photoCount,
//   albumCount,
//   onAboutClick,
//   showAbout,
//   userInfo,
// }) => {
//   const location = useLocation();
//   const history = useHistory();
//   const [showAboutModal, setShowAboutModal] = useState(false);
//   const sessionUser = useSelector(selectSessionUser);
//   const isActive = (path) => location.pathname.startsWith(path);
//   const about = userInfo?.about_me;
//   const effectiveId = id || sessionUser?.id;
//   const isOwner = sessionUser?.id === effectiveId;

//   const toggleAboutModal = () => {
//     setShowAboutModal(!showAboutModal);

//   };

//   const photosUrl = isOwner
//     ? "/owner/photostream"
//     : `/posts/users/${effectiveId}`;
//   console.log(
//     "🚀 ~ file: UserNavigationBar.js:65 ~ UserNavigationBar ~ effectiveId",
//     effectiveId
//   );
//   const handlePhotosClick = (e) => {
//     e.preventDefault();
//     history.push(photosUrl);
//   };

//   return (
//     <div className="user-navigation-bar">
//       <div className="navigation-links">
//         <a
//           href="#!"
//           onClick={(e) => {
//             e.preventDefault();
//             toggleAboutModal();
//           }}
//           className={showAbout ? "active" : ""}
//         >
//           {isOwner ? "About Me" : "About"}
//         </a>

//         <a
//           href={photosUrl}
//           onClick={handlePhotosClick}
//           className={isActive(photosUrl) ? "active" : ""}
//         >
//           {isOwner ? "My PhotoStream" : "PhotoStream"} {photoCount}
//         </a>
//         <a
//           href={`/albums/users/${effectiveId}`}
//           className={isActive(`/albums/users/${effectiveId}`) ? "active" : ""}
//         >
//           {isOwner ? "My Albums" : "Albums"} {albumCount}
//         </a>
//         {isOwner && (
//           <a
//             // href={`/posts/users/${sessionUser?.id}/favorites-post`}
//             href={`/user/favorites-post`}
//             className={
//               isActive(`/posts/users/${sessionUser?.id}/favorites-post`)
//                 ? "active"
//                 : ""
//             }
//           >
//             View Favorites
//           </a>
//         )}
//       </div>

//     </div>
//   );
// };

// export default UserNavigationBar;
const UserNavigationBar = ({
  id,
  photoCount,
  albumCount,
  userInfo,
}) => {
  const location = useLocation();
  const history = useHistory();
  const sessionUser = useSelector(selectSessionUser);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);
  const effectiveId = id || sessionUser?.id;
  const isOwner = sessionUser?.id === effectiveId;
  const about = userInfo?.about_me;
  const aboutContent = about || "No 'About Me' information available.";
  // const toggleAboutModal = () => {
  //   setShowAboutModal(!showAboutModal);
  // };

  // useEffect(() => {
  //   const closeDropdown = (e) => {
  //     if (showAboutModal && !e.target.closest('.user-navigation-bar')) {
  //       setShowAboutModal(false);
  //     }
  //   };

  //   document.addEventListener('click', closeDropdown);
  //   return () => document.removeEventListener('click', closeDropdown);
  // }, [showAboutModal]);
  const toggleAboutModal  = () => {
    setShowAboutModal(!showAboutModal);
  };

  const photosUrl = isOwner ? "/owner/photostream" : `/posts/users/${effectiveId}`;

  const handlePhotosClick = (e) => {
    e.preventDefault();
    history.push(photosUrl);
  };

  return (
    <>
    <div className="user-navigation-bar">
      <div className="navigation-links">
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            toggleAboutModal();
          }}
          className={showAboutModal ? "active" : ""}
        >
          {isOwner ? "About Me" : "About"}
        </a>
        <a
          href={photosUrl}
          onClick={handlePhotosClick}
          className={isActive(photosUrl) ? "active" : ""}
        >
          {isOwner ? "My PhotoStream" : "PhotoStream"} {photoCount}
        </a>
        <a
          href={`/albums/users/${effectiveId}`}
          className={isActive(`/albums/users/${effectiveId}`) ? "active" : ""}
        >
          {isOwner ? "My Albums" : "Albums"} {albumCount}
        </a>
        {isOwner && (
          <a
            href={`/user/favorites-post`}
            className={isActive(`/user/favorites-post`) ? "active" : ""}
          >
            View Favorites
          </a>
        )}
      </div>
    </div>
    {showAboutModal && (
      <div className="about-dropdown">
         <p>{aboutContent}</p>
      </div>
    )}
    </>
  );
};

export default UserNavigationBar;
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
// import {
//   selectAlbumImages,
//   selectAlbumUserInfo,
//   selectSessionUser,
//   selectCurrentPage,
// } from "../../store/selectors";
// import {
//   thunkGetPostsByUserId,
//   thunkGetLoggedInUserPosts,
// } from "../../store/posts";
// import OpenModalButton from "../Modals/OpenModalButton";
// import CreatePostForm from "../Posts/PostForms/CreatePostForm";
// import "./UserNavigationBar.css";

// const UserNavigationBar = ({
//   id,
//   photoCount,
//   albumCount,
//   onAboutClick,
//   showAbout,
//   currentPage,
// }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const sessionUser = useSelector(selectSessionUser);
//   const isActive = (path) => location.pathname.startsWith(path);
//   // const currentPage = useSelector(selectCurrentPage);

//   return (
//     <div className="user-navigation-bar">
//       <div className="navigation-links">
//         <a
//           href="#!"
//           onClick={onAboutClick}
//           className={showAbout ? "active" : ""}
//         >
//           About
//         </a>
//         <a
//           href={`/posts/users/${id}`}
//           className={isActive(`/posts/users/${id}`) ? "active" : ""}
//         >
//           Photos {photoCount}
//         </a>
//         <a
//           href={`/albums/users/${id}`}
//           className={isActive(`/albums/users/${id}`) ? "active" : ""}
//         >
//           Albums {albumCount}
//         </a>

//       </div>
//     </div>
//   );
// };

// export default UserNavigationBar;

// const UserNavigationBar = ({
//   id,
//   photoCount,
//   albumCount,
//   onAboutClick,
//   showAbout,
//   currentPage
// }) => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const sessionUser = useSelector(selectSessionUser);

//   // Compute the total number of albums and photos
//   // const albumCount = userInfo ? userInfo.albums?.length : 0;
//   // const photoCount = albumImages.length;

//   // Check if the current path starts with a given path
//   const isActive = (path) => {
//     if (path === "/albums") {
//       return location.pathname === path;
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="user-navigation-bar">
//       <div className="navigation-links">
//         <a
//           href="#!"
//           onClick={onAboutClick}
//           className={showAbout ? "active" : ""}
//         >
//           About
//         </a>
//         <a
//           href={`/posts/users/${id}`}
//           className={isActive(`/posts/users/${id}`) ? "active" : ""}
//         >
//           Photos {photoCount}
//         </a>
//         <a
//           href={`/albums/users/${id}`}
//           className={isActive(`/albums/users/${id}`) ? "active" : ""}
//         >
//           Albums {albumCount}
//         </a>
//         <a
//           href={`/albums/${id}`}
//           className={isActive(`/albums/${id}`) ? "active" : ""}
//         >
//           Album Photos {albumCount}
//         </a>
//         {location.pathname === "/owner/photostream" && (
//           <OpenModalButton
//             className="create-post-button navigation-link"
//             buttonText="Create Post"
//             modalComponent={
//               <CreatePostForm
//                 onPostCreated={() =>

//                   dispatch(
//                     thunkGetPostsByUserId(
//                       sessionUser.id,
//                       currentPage,
//                       10
//                     )
//                   )
//                 }
//               />
//             }
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserNavigationBar;
