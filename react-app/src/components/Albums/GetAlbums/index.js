import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  faTimes,
  faPlusCircle,
  faLayerGroup,
  faTrashAlt,
  faEdit,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../../context/Modal";
import { thunkGetAlbumsByUserId } from "../../../store/albums";
import Spinner from "../../Spinner";
import {
  selectAllAlbums,
  selectUserPosts,
  selectTotalAlbums,
  selectSessionUser,
  selectLoading,
} from "../../../store/selectors";
import { setLoading, setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import UserNavigationBar from "../../Navigation/UserNavigationBar";
import ImageDisplay from "../../ImageDisplay";
import OpenModalButton from "../../Modals/OpenModalButton";
import CreateAlbumForm from "../AlbumForm/CreateAlbumForm";
import EditAlbumForm from "../AlbumForm/EditAlbumForm";
import DeleteAlbum from "../DeleteAlbum";
import defult_banner_image from "../../../assets/images/defult_banner_image.png";
import BannerNavbar from "../../Navigation/BannerNavbar";
import "./GetAlbums.css";

const GetAlbums = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  console.log("🚀 ~ file: index.js:37 ~ userId:", userId);
  const { closeModal } = useModal();
  const albums = useSelector(selectAllAlbums) || [];
  console.log("🚀 ~ file: index.js:38 ~ albums:", albums);
  const totalAlbums = useSelector(selectTotalAlbums);
  const sessionUser = useSelector(selectSessionUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [activeAlbumTitle, setActiveAlbumTitle] = useState(null);
  const [activeAlbumImages, setActiveAlbumImages] = useState(true);
  const [showImageDisplayModal, setShowImageDisplayModal] = useState(false);
  const loading = useSelector(selectLoading);
  const [isAlbumsFetched, setIsAlbumsFetched] = useState(false);

  const perPage = 2;
  const aboutMe = albums[0]?.about_me;
  const images = albums[0]?.images[0]?.url;
  const profilePhoto = albums[0]?.user_info?.profile_picture;
  const userName = `${albums[0]?.user_info?.first_name} ${albums[0]?.user_info?.last_name}`;

  console.log("🚀 ~ file: index.js:63 ~ userName:", userName);
  console.log("🚀 ~ file: index.js:56 ~ profilePhoto:", profilePhoto);
  console.log("🚀 ~ file: index.js:55 ~ image:", images);
  useEffect(() => {
    fetchData();
  }, [dispatch, currentPage, perPage, userId]);

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await dispatch(
        thunkGetAlbumsByUserId(userId, currentPage, perPage)
      );
      setTotalPages(response.totalPages);
      setIsAlbumsFetched(true);
      dispatch(setLoading(false));
    } catch (err) {
      setIsAlbumsFetched(true);
      dispatch(setError("An error occurred"));
      dispatch(setLoading(false));
    }
  };

  const toggleAbout = () => setShowAbout(!showAbout);
  const isCurrentUserProfile = sessionUser?.id === parseInt(userId);
  if (!albums || albums.length === 0) return null;
  return (
    <div className="albums-main-container">
      {/* {loading ? (
        <Spinner />
      ) : ( */}

      <>
        <div className="albums-banner-container">
          <div className="albums-banner">
            {images ? (
              <LazyLoadImage
                src={images}
                effect="blur"
                className="banner-image"
                width={"100%"}
                height={"200px"}
              />
            ) : (
              <LazyLoadImage
                src={defult_banner_image}
                effect="blur"
                className="banner-image"
                width={"100%"}
                height={"200px"}
              />
            )}

            <div className="albums-user-info-container">
              <div className="profile-picture-container">
                {profilePhoto ? (
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
              </div>
{/*
              <div className="user-name">
                <h1>{userName || "User Name"}</h1>
              </div> */}
            </div>
          </div>
        </div>

        <nav className="album-navigation">
          <UserNavigationBar
            id={userId}
            onAboutClick={toggleAbout}
            showAbout={showAbout}
            albumCount={totalAlbums}
          />
        </nav>
        {showAbout && (
          <div className="about-section">
            <p>{aboutMe || "No about me information available."}</p>
          </div>
        )}
        {isCurrentUserProfile && albums.length > 0 && (
          <div className="album-controls-container">
            <div className="create-album-prompt">
              <OpenModalButton
                className="create-album-button"
                buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
                modalComponent={
                  <CreateAlbumForm
                    closeModal={closeModal}
                    currentPage={currentPage}
                    perPage={perPage}
                  />
                }
              />
              <p>Create an album</p>
            </div>
            <div className="add-posts-to-an-album-button-container">
              <button
                className="add-posts-to-an-album-button"
                onClick={() => history.push("/owner/posts/add")}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                <span>Add a Post to an Album</span>
              </button>
            </div>
          </div>
        )}
        {isAlbumsFetched && albums.length === 0 ? (
          <div className="no-albums-message">
            <p>
              {isCurrentUserProfile
                ? "You have no albums."
                : "This user has no albums."}
            </p>
            {isCurrentUserProfile && (
              <div className="create-album-prompt">
                <OpenModalButton
                  className="create-album-button"
                  buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
                  modalComponent={
                    <CreateAlbumForm
                      closeModal={closeModal}
                      currentPage={currentPage}
                      perPage={perPage}
                    />
                  }
                />
                <p>Create an album</p>
              </div>
            )}
          </div>
        ) : (
          <div className="albums-container">
            {albums.map((album) => (
              <div
                key={album?.id}
                className={`album-item ${
                  activeAlbumId === album.id ? "active" : ""
                }`}
              >
                <div
                  className="album-title"
                  onClick={() => {
                    setActiveAlbumId(album?.id);
                    setShowImageDisplayModal(
                      (prevShowImageDisplayModal) => !prevShowImageDisplayModal
                    );
                  }}
                >
                  {album?.title}
                </div>

                {(activeAlbumId === null || activeAlbumId === album?.id) && (
                  <>
                    {sessionUser?.id === album?.user_id && (
                      <div className="album-delete-button">
                        <OpenModalButton
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveAlbumImages(false);
                          }}
                          buttonText={<FontAwesomeIcon icon={faEdit} />}
                          modalComponent={
                            <EditAlbumForm
                              albumId={album.id}
                              albumTitle={album.title}
                              currentPage={currentPage}
                              perPage={perPage}
                              setActiveAlbumImages={setActiveAlbumImages}
                            />
                          }
                        />
                        <OpenModalButton
                          className="delete-modal"
                          buttonText={<FontAwesomeIcon icon={faTrashAlt} />}
                          modalComponent={
                            <DeleteAlbum
                              albumId={album.id}
                              onDelete={() => fetchData()}
                            />
                          }
                        />
                      </div>
                    )}
                  </>
                )}
                {activeAlbumId === null && (
                  <div className="album-images">
                    <div className="album-image-grid">
                      {album?.images?.map((image, index) => (
                        <img
                          key={index}
                          src={image?.url}
                          alt={`Image ${index} of ${album?.title}`}
                          className="album-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Pagination component */}
        {activeAlbumId === null && (
          <Pagination
            totalItems={totalPages * perPage}
            itemsPerPage={perPage}
            currentPage={currentPage}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        )}
        {/* Overlay for active album */}
        {/* {activeAlbumId && activeAlbumImages && ( */}
        {showImageDisplayModal && (
          <div className={`album-overlay ${activeAlbumId ? "open" : ""}`}>
            <FontAwesomeIcon
              icon={faTimes}
              className="close-icon"
              onClick={() => {
                setActiveAlbumId(null);
                setActiveAlbumTitle(null);
                setShowImageDisplayModal(false);
              }}
            />
            <ImageDisplay mode="albumImages" albumId={activeAlbumId} />
          </div>
        )}
      </>


    </div>
  );
};

export default GetAlbums;

// if (!albums || albums.length === 0) return null;
// return (
//   <>
//     <nav className="album-navigation">
//       <UserNavigationBar
//         id={userId}
//         onAboutClick={toggleAbout}
//         showAbout={showAbout}
//         albumCount={totalAlbums}
//       />
//     </nav>
//     {showAbout && (
//       <div className="about-section">
//         <p>{aboutMe || "No about me information available."}</p>
//       </div>
//     )}
//     {isCurrentUserProfile && (
//       <div className="album-controls-container">
//         <div className="create-album-prompt">
//           <OpenModalButton
//             className="create-album-button"
//             buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
//             modalComponent={
//               <CreateAlbumForm
//                 closeModal={closeModal}
//                 currentPage={currentPage}
//                 perPage={perPage}
//               />
//             }
//           />
//           <p>Create an album</p>
//         </div>
//         <div className="add-posts-to-an-album-button-container">
//           <button
//             className="add-posts-to-an-album-button"
//             onClick={() => history.push("/owner/posts/add")}
//           >
//             <FontAwesomeIcon icon={faLayerGroup} />
//             <span>Add a Post to an Album</span>
//           </button>
//         </div>
//       </div>
//     )}
//     {!albums && albums.length === 0 ? (
//       <>
//         <div className="no-albums-message">
//           <>
//             <p>
//               {isCurrentUserProfile
//                 ? "You have no albums."
//                 : "This user has no albums."}
//             </p>
//             {/* </div> */}
//             {isCurrentUserProfile && (
//               <div className="create-album-prompt">
//                 <>
//                   <OpenModalButton
//                     className="create-album-button"
//                     buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
//                     modalComponent={
//                       <CreateAlbumForm
//                         closeModal={closeModal}
//                         currentPage={currentPage}
//                         perPage={perPage}
//                       />
//                     }
//                   />
//                   <p>Create an album</p>
//                 </>
//                 <div className="add-posts-to-an-album-button-container">
//                   <button
//                     className="add-posts-to-an-album-button"
//                     onClick={() => history.push("/owner/posts/add")}
//                   >
//                     <FontAwesomeIcon icon={faLayerGroup} />
//                     <span>Manage Unassigned Posts</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         </div>
//       </>
//     ) : (
//       <div className="albums-container">
//       {albums.map((album) => (
//         <div key={album?.id} className={`album-item ${activeAlbumId === album.id ? "active" : ""}`}>

//           <div
//             className="album-title"
//             onClick={() => {
//               setActiveAlbumId(album?.id);
//               setActiveAlbumTitle(album?.title);
//               setShowImageDisplayModal(true);
//             }}
//           >
//             {album?.title}
//           </div>
//             {/* <div className="album-title">{album.title}</div> */}
//               {(activeAlbumId === null || activeAlbumId === album?.id) && (
//                 <>
//                   <div className="album-title">{album?.title}</div>
//                   {sessionUser?.id === album?.user_id && (
//                     <div className="album-delete-button">
//                       <OpenModalButton
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           setActiveAlbumImages(false);
//                         }}
//                         buttonText={<FontAwesomeIcon icon={faEdit} />}
//                         modalComponent={
//                           <EditAlbumForm
//                             albumId={album.id}
//                             albumTitle={album.title}
//                             currentPage={currentPage}
//                             perPage={perPage}
//                             setActiveAlbumImages={setActiveAlbumImages}
//                           />
//                         }
//                       />
//                       <OpenModalButton
//                         buttonText={<FontAwesomeIcon icon={faTrashAlt} />}
//                         modalComponent={
//                           <DeleteAlbum
//                             albumId={album.id}
//                             onDelete={() => fetchData()}
//                           />
//                         }
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//               {activeAlbumId === null && (
//                 <div className="album-images">
//                   <div className="album-image-grid">
//                     {album?.images?.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image?.url}
//                         alt={`Image ${index} of ${album?.title}`}
//                         className="album-image"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Pagination component */}
//       {activeAlbumId === null && (
//         <Pagination
//           totalItems={totalPages * perPage}
//           itemsPerPage={perPage}
//           currentPage={currentPage}
//           onPageChange={(newPage) => setCurrentPage(newPage)}
//         />
//       )}
//       {/* Overlay for active album */}
//       {/* {activeAlbumId && activeAlbumImages && ( */}
//       {showImageDisplayModal && (
//         <div className={`album-overlay ${activeAlbumId ? "open" : ""}`}>
//           <FontAwesomeIcon
//             icon={faTimes}
//             className="close-icon"
//             onClick={() => {
//               setActiveAlbumId(null);
//               setActiveAlbumTitle(null);
//               setShowImageDisplayModal(false);
//             }}
//           />
//           <ImageDisplay mode="albumImages" albumId={activeAlbumId} />
//         </div>
//       )}
//     </>
//   );

// };

// export default GetAlbums;
