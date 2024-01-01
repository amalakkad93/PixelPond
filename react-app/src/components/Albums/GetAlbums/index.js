import React, { memo, useEffect, useState, useRef, useCallback } from "react";
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
import { useShortModal } from "../../../context/ModalShort";

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
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
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
  const { closeShortModal } = useShortModal();
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

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const perPage = 2;

  const aboutMe = albums.length > 0 ? albums[0]?.about_me : null;
  const images = albums.length > 0 && albums[0]?.images?.length > 0 ? albums[0]?.images[0]?.url : null;
  const profilePhoto = albums.length > 0 ? albums[0]?.user_info?.profile_picture : null;
  const userName = albums.length > 0 ? `${albums[0]?.user_info?.first_name} ${albums[0]?.user_info?.last_name}` : '';

  console.log("🚀 ~ file: index.js:63 ~ userName:", userName);
  console.log("🚀 ~ file: index.js:56 ~ profilePhoto:", profilePhoto);
  console.log("🚀 ~ file: index.js:55 ~ image:", images);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (page) => {
      dispatch(setLoading(true));
      setIsLoading(true);
      try {
        const response = await dispatch(thunkGetAlbumsByUserId(userId, page, perPage));
        if (response) {
          setCurrentPage(response.current_page);
          setTotalPages(response.total_pages);
          setIsAlbumsFetched(true);
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        dispatch(setError("An error occurred"));
        setIsAlbumsFetched(true);
      } finally {
        dispatch(setLoading(false));
        setIsLoading(false);
      }
    },
    [dispatch, userId, perPage]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleAlbumClick = (albumId) => {
    if (activeAlbumId === albumId) {
      // Reset to show previews for all albums
      setActiveAlbumId(null);
    } else {
      // Set the clicked album as active
      setActiveAlbumId(albumId);
    }
  };
  const renderAlbumImages = (album) => {
    const imagesToShow = activeAlbumId === album.id ? album.images : album.images.slice(0, 4);
    return imagesToShow.map((image, index) => (
      <img key={index} src={image.url} alt={`Image ${index} of ${album.title}`} className="album-image" />
    ));
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
                        <OpenShortModalButton
                        className="delete-edit-modal"
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
                              onEdit={() => fetchData()}
                            />
                          }
                        />

                        <OpenShortModalButton
                          className="delete-edit-modal"
                          buttonText={<FontAwesomeIcon icon={faTrashAlt} />}
                          modalComponent={
                            <DeleteAlbum
                              albumId={album?.id}
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
            // onPageChange={(newPage) => setCurrentPage(newPage)}
            onPageChange={(newPage) => fetchData(newPage)}
            disableNext={isLastPage}
            disablePrevious={isFirstPage}
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
