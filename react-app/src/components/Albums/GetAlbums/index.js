import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlusCircle,
  faLayerGroup,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../../context/Modal";
import { thunkGetAlbumsByUserId } from "../../../store/albums";

import {
  selectAllAlbums,
  selectUserPosts,
  selectTotalAlbums,
  selectSessionUser,
} from "../../../store/selectors";
import { setLoading, setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import UserNavigationBar from "../../Navigation/UserNavigationBar";
import ImageDisplay from "../../ImageDisplay";
import OpenModalButton from "../../Modals/OpenModalButton";
import CreateAlbumForm from "../AlbumForm/CreateAlbumForm";
import EditAlbumForm from "../AlbumForm/EditAlbumForm";
import DeleteAlbum from "../DeleteAlbum";
import "./GetAlbums.css";

const GetAlbums = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const { closeModal } = useModal();
  const albums = useSelector(selectAllAlbums) || [];
  const totalAlbums = useSelector(selectTotalAlbums);
  const sessionUser = useSelector(selectSessionUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [activeAlbumTitle, setActiveAlbumTitle] = useState(null);
  const [activeAlbumImages, setActiveAlbumImages] = useState(true);
  const [showImageDisplayModal, setShowImageDisplayModal] = useState(false);

  const perPage = 2;
  const aboutMe = albums[0]?.about_me;

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
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError("An error occurred"));
      dispatch(setLoading(false));
    }
  };

  const toggleAbout = () => setShowAbout(!showAbout);
  const isCurrentUserProfile = sessionUser?.id === parseInt(userId);
  return (
    <>
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
      {isCurrentUserProfile && (
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
      {albums.length === 0 ? (
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
