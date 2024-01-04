import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useShortModal } from "../../../context/ModalShort";
import {
  thunkAddPostToAlbum,
  thunkGetAlbumsByUserId,
  thunkGetAlbumImages,
} from "../../../store/albums";
import {
  selectUserAlbums,
  selectSessionUser,
  selectAlbumDetails,
} from "../../../store/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./AddToAlbumModal.css";

const ITEMS_PER_PAGE = 4;
const AddToAlbumModal = ({ postId, onClose, mode, albumId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  // const { albumId } = useParams();
  const { closeShortModal } = useShortModal();
  const userAlbums = useSelector(selectUserAlbums);
  const sessionUser = useSelector(selectSessionUser);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  // const albumImages = useSelector((state) => selectAlbumDetails(state, selectedAlbumId));
  const { images: albumImages, title: albumTitle } = useSelector((state) =>
    selectAlbumDetails(state, selectedAlbumId)
  );
  const { title: propAlbumTitle } = useSelector((state) =>
    selectAlbumDetails(state, albumId)
  );
  const albumDetails = useSelector(
    (state) => state.albums.singleAlbum.byId[albumId]
  );
  console.log(
    "🚀 ~ file: index.js:41 ~ AddToAlbumModal ~ albumDetails :",
    albumDetails
  );
  console.log(
    "🚀 ~ file: index.js:35 ~ AddToAlbumModal ~  propAlbumTitle:",
    propAlbumTitle
  );
  const [isImageInAlbum, setIsImageInAlbum] = useState(false);
  const albumState = useSelector((state) => state.albums.singleAlbum.byId);

  const [currentPage, setCurrentPage] = useState(1);
  //   const [totalPages, setTotalPages] = useState(0);

  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  console.log("--Redux Album State:", albumState);
  console.log("--Selected Album Title:", albumTitle);
  console.log("--Prop Album Title:", propAlbumTitle);

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  useEffect(() => {
    if (selectedAlbumId) {
      dispatch(
        thunkGetAlbumImages(selectedAlbumId, currentPage, ITEMS_PER_PAGE)
      ).then((response) => {
        setCurrentPage(response.current_page);
        setTotalItems(response.total_images);
        setIsImageInAlbum(
          response.images.some((image) => image.post_id === postId)
        );
      });
    }
  }, [dispatch, selectedAlbumId, currentPage, postId]);

  useEffect(() => {
    if (albumId) {
      dispatch(thunkGetAlbumImages(albumId, currentPage, ITEMS_PER_PAGE)).then(
        (response) => {
          setCurrentPage(response.current_page);
          setTotalItems(response.total_images);
          setIsImageInAlbum(
            response.images.some((image) => image.post_id === postId)
          );
        }
      );
    }
  }, [dispatch, albumId, currentPage, postId]);

  // const handleAddToAlbum = async () => {
  //   if (selectedAlbumId) {
  //     try {
  //       await dispatch(thunkAddPostToAlbum(postId, selectedAlbumId));

  //       await dispatch(thunkGetAlbumsByUserId(sessionUser.id));
  //       closeShortModal();
  //     } catch (error) {
  //       console.error("Error adding post to album:", error);
  //     }
  //   }
  // };
  const handleAddToAlbum = async () => {
    const albumToAddTo = isAlbumSpecificMode ? albumId : selectedAlbumId;
    if (albumToAddTo) {
      try {
        await dispatch(thunkAddPostToAlbum(postId, albumToAddTo));

        // Refresh albums or perform any other necessary updates
        await dispatch(thunkGetAlbumsByUserId(sessionUser.id));
        closeShortModal();
      } catch (error) {
        console.error("Error adding post to album:", error);
      }
    }
  };


  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  console.log("Current Page:", currentPage, "Total Pages:", totalPages);

  const isAlbumSpecificMode = mode === "addPostToAnAlbum";

  //   return (
  //     <div className="add-to-album-modal-main">
  //       <div className="add-to-album-modal">
  //         <h2>Add to Album</h2>
  //         {!isAlbumSpecificMode ? (
  //           <select
  //             value={selectedAlbumId}
  //             onChange={(e) => setSelectedAlbumId(e.target.value)}
  //           >
  //             <option value="">Select Album</option>
  //             {userAlbums.map((album) => (
  //               <option key={album.id} value={album.id}>
  //                 {album.title}
  //               </option>
  //             ))}
  //           </select>
  //         ) : (
  //           <div>
  //             <strong>Album: </strong>
  //             {userAlbums.find(a => a.id === parseInt(albumId))?.title}
  //           </div>
  //         )}

  //         <div className="album-add-cancel-btns">
  //           <button onClick={handleAddToAlbum} disabled={!selectedAlbumId}>
  //             Add to Album
  //           </button>
  //           <button onClick={onClose}>Cancel</button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default AddToAlbumModal;

  return (
    <div className="add-to-album-modal-main">
      <>
        <div className="add-to-album-modal">
          <h2>Add to Album</h2>

          {isAlbumSpecificMode ? (
            <>
              <div className="album-title">
                <strong>
                  Album: {propAlbumTitle || "Album title loading..."}
                </strong>
              </div>
            </>
          ) : (
            <select
              value={selectedAlbumId}
              onChange={(e) => {
                setSelectedAlbumId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Select Album</option>
              {userAlbums.map((album) => (
                <option
                  className="add-to-album-option"
                  key={album.id}
                  value={album.id}
                >
                  {album.title}
                </option>
              ))}
            </select>
          )}
          {selectedAlbumId && (
            <>
              <div className="album-thumbnails-container">
                {currentPage > 1 && (
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="pagination-control-left"
                    onClick={handlePreviousPage}
                  />
                )}
                <div className="album-thumbnails-grid">
                  {albumImages.map((image) => (
                    <div
                      className={`thumbnail ${
                        image.post_id === postId ? "in-album" : ""
                      }`}
                    >
                      <img src={image.url} alt="Album Thumbnail" />
                      {image.post_id === postId && (
                        <div className="checkmark-overlay">
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {currentPage < totalPages && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="pagination-control-right"
                    onClick={handleNextPage}
                  />
                )}
              </div>
            </>
          )}

          <div className="album-add-cancel-btns">
            <button
              onClick={handleAddToAlbum}
              disabled={
                (isAlbumSpecificMode ? !albumId : !selectedAlbumId) ||
                isImageInAlbum
              }
            >
              {isImageInAlbum ? "Already in Album" : "Add to Album"}
            </button>
            <button onClick={closeShortModal}>Cancel</button>
          </div>
        </div>
      </>
    </div>
  );
};

export default AddToAlbumModal;
