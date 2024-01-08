import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlusCircle,
  faLayerGroup,
  faTrashAlt,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useLoading } from "../../../context/LoadingContext";
import { useShortModal } from "../../../context/ModalShort";

import { thunkGetAlbumsByUserId } from "../../../store/albums";
import Spinner from "../../Spinner";
import { selectAllAlbums, selectSessionUser, } from "../../../store/selectors";
import { setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
import CreateAlbumForm from "../AlbumForm/CreateAlbumForm";
import EditAlbumForm from "../AlbumForm/EditAlbumForm";
import DeleteAlbum from "../DeleteAlbum";

import "./GetAlbums.css";

const GetAlbums = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const { closeShortModal } = useShortModal();
  // const { setIsLoading } = useLoading();
  // const { isLoading, setIsLoading } = useLoading();


  const albums = useSelector(selectAllAlbums) || [];
  const sessionUser = useSelector(selectSessionUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlbumsFetched, setIsAlbumsFetched] = useState(false);


  const perPage = 2;
  const isCurrentUserProfile = sessionUser?.id === parseInt(userId);

  const showPagination = albums.length > 0;

  const fetchData = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const response = await dispatch(
          thunkGetAlbumsByUserId(userId, page, perPage)
        );
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
        setIsLoading(false);
      }
    },
    [dispatch, userId, perPage]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);


  const renderAlbumImages = (album) => {
    // Ensure album.images is defined and is an array
    const imagesToShow = album.images && Array.isArray(album.images)
      ? (activeAlbumId === album.id ? album.images : album.images.slice(0, 4))
      : [];

    return imagesToShow.map((image, index) => (
      <img
        key={index}
        src={image.url}
        alt={`Image ${index} of ${album.title}`}
        className="album-image"
      />
    ));
  };


  // if (!albums || albums.length === 0) return null;
  if (isLoading) return <Spinner />;
  return (
    <div className="albums-main-container">
      {isCurrentUserProfile && albums.length === 0 && (
        <div className="no-albums-message">
          <p>You have no albums. Create an album?</p>
          <div className="create-album-prompt">
            <OpenShortModalButton
              className="create-album-button"
              buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
              modalComponent={
                <CreateAlbumForm
                  closeShortModal={closeShortModal}
                  currentPage={currentPage}
                  perPage={perPage}
                />
              }
            />
            <p>Create an album</p>
          </div>
        </div>
      )}

      {isCurrentUserProfile && albums.length > 0 && (
        <>
          <div className="create-album-prompt">
            <OpenShortModalButton
              className="create-album-button"
              buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
              modalComponent={
                <CreateAlbumForm
                  closeShortModal={closeShortModal}
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
              onClick={() => history.push('/owner/albums/manage')}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Manage Post Images</span>
            </button>
          </div>
        </>
      )}

      {isAlbumsFetched && albums.length > 0 && (
        <div className="albums-container">
          {albums.map((album) => (
            <div key={album?.id} className="album-item">
              <div className="album-delete-button">
                <div
                  className="album-title"
                  onClick={() =>
                    history.push(`/albums/${album.id}/users/${userId}`)
                  }
                >
                  {album?.title}
                </div>
                <div className="album-delete-edit-button">
                  <OpenShortModalButton
                    className="delete-edit-modal"
                    buttonText={<FontAwesomeIcon icon={faEdit} />}
                    modalComponent={
                      <EditAlbumForm
                        albumId={album.id}
                        albumTitle={album.title}
                        currentPage={currentPage}
                        perPage={perPage}
                        closeShortModal={() => {}}
                        setActiveAlbumImages={() => {}}
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
                  <button
                    className="add-posts-to-an-album-btn"
                    onClick={() => history.push(`/owner/posts/albums/${album.id}/add`)}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="add-to-album-icon"
                    />
                  </button>
                </div>
              </div>
              {renderAlbumImages(album)}
            </div>
          ))}
        </div>
      )}

      {showPagination && (
        <Pagination
          totalItems={totalPages * perPage}
          itemsPerPage={perPage}
          currentPage={currentPage}
          onPageChange={(newPage) => fetchData(newPage)}
        />
      )}
    </div>
  );
};

export default GetAlbums;

//  return (
//   <div className="albums-main-container">
//   {/* {loading ? (
//     <Spinner />
//   ) : ( */}
//   <>
//     {showAbout && (
//       <div className="about-section">
//         <p>{aboutMe || "No about me information available."}</p>
//       </div>
//     )}

//     {isCurrentUserProfile && albums.length === 0 && (
//       // Display no albums message and prompt for the current user
//       <div className="no-albums-message">
//         <p>You have no albums. Create an album?</p>
//         <div className="create-album-prompt">
//           <OpenShortModalButton
//             className="create-album-button"
//             buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
//             modalComponent={
//               <CreateAlbumForm
//                 closeShortModal={closeShortModal}
//                 currentPage={currentPage}
//                 perPage={perPage}
//               />
//             }
//           />
//           <p>Create an album</p>
//         </div>
//       </div>
//     )}

//     {isCurrentUserProfile && albums.length > 0 && (
//       // Show "Add a Post to an Album" button when user has albums
//       <div className="add-posts-to-an-album-button-container">
//         <button
//           className="add-posts-to-an-album-button"
//           onClick={() => history.push("/owner/posts/add")}
//         >
//           <FontAwesomeIcon icon={faLayerGroup} />
//           <span>Add a Post to an Album</span>
//         </button>
//       </div>
//     )}

//     {!isCurrentUserProfile && isAlbumsFetched && albums.length === 0 && (
//       // Display no albums message for other users
//       <div className="no-albums-message">
//         <p>This user has no albums.</p>
//       </div>
//     )}

//     {/* Display albums if available */}
//     {isAlbumsFetched && albums.length > 0 && (
//       <div className="albums-container">
//         {albums.map((album) => (
//           <div
//             key={album?.id}
//             className={`album-item ${
//               activeAlbumId === album.id ? "active" : ""
//             }`}
//           >
//             <div
//               className="album-title"
//               onClick={() => {
//                 setActiveAlbumId(album?.id);
//                 setShowImageDisplayModal(
//                   (prevShowImageDisplayModal) => !prevShowImageDisplayModal
//                 );
//               }}
//             >
//               {album?.title}
//             </div>

//             {(activeAlbumId === null || activeAlbumId === album?.id) && (
//               <>
//                 {sessionUser?.id === album?.user_id && (
//                   <div className="album-delete-button">
//                     <OpenShortModalButton
//                       className="delete-edit-modal"
//                       onClick={(event) => {
//                         event.stopPropagation();
//                         setActiveAlbumImages(false);
//                       }}
//                       buttonText={<FontAwesomeIcon icon={faEdit} />}
//                       modalComponent={
//                         <EditAlbumForm
//                           albumId={album.id}
//                           albumTitle={album.title}
//                           currentPage={currentPage}
//                           perPage={perPage}
//                           closeShortModal={closeShortModal}
//                           setActiveAlbumImages={setActiveAlbumImages}
//                           onEdit={() => fetchData()}
//                         />
//                       }
//                     />

//                     <OpenShortModalButton
//                       className="delete-edit-modal"
//                       buttonText={<FontAwesomeIcon icon={faTrashAlt} />}
//                       modalComponent={
//                         <DeleteAlbum
//                           albumId={album?.id}
//                           onDelete={() => fetchData()}
//                         />
//                       }
//                     />
//                   </div>
//                 )}
//               </>
//             )}
//             {activeAlbumId === null && (
//               <div className="album-images">
//                 <div className="album-image-grid">
//                   {album?.images?.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image?.url}
//                       alt={`Image ${index} of ${album?.title}`}
//                       className="album-image"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     )}
//     {/* Conditional rendering of Pagination */}
//     {showPagination && (
//       <Pagination
//         totalItems={totalPages * perPage}
//         itemsPerPage={perPage}
//         currentPage={currentPage}
//         onPageChange={(newPage) => fetchData(newPage)}
//         disableNext={isLastPage}
//         disablePrevious={isFirstPage}
//       />
//     )}

//     {/* Overlay for active album */}
//     {showImageDisplayModal && (
//       <div className={`album-overlay ${activeAlbumId ? "open" : ""}`}>
//         <FontAwesomeIcon
//           icon={faTimes}
//           className="close-icon"
//           onClick={() => {
//             setActiveAlbumId(null);
//             setActiveAlbumTitle(null);
//             setShowImageDisplayModal(false);
//           }}
//         />
//         <ImageDisplay mode="albumImages" albumId={activeAlbumId} />
//       </div>
//     )}
//   </>
// </div>
// );
// };

// export default GetAlbums;
