import React, { useContext, memo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import AddToAlbumModal from "../../Albums/AddToAlbumModal";
import RemoveFromAlbumModal from "../../Albums/RemoveFromAlbumModal";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
import { useShortModal } from "../../../context/ModalShort";

import { thunkToggleFavorite } from "../../../store/favorites";
import { isPostFavorited, selectSessionUser } from "../../../store/selectors";

import "./ImageItem.css";

const ImageItem = memo(
  ({ imageUrl, postId, onClick, addPostToAlbumMode, showRemoveIcon, mode,   albumId, hasAlbums, showOptionsButton, }) => {
    console.log("🚀 ~ file: ImageItem.js:25 ~ mode:", mode);
    
    const dispatch = useDispatch();
    const optionsRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);

    const { closeShortModal, openShortModal } = useShortModal();
    const sessionUser = useSelector(selectSessionUser);
    const userId = sessionUser?.id;
    const favorite = useSelector((state) => isPostFavorited(state, postId));

    const isAlbumImagesMode = mode === "albumImages";
    const isAddToAlbumMode = mode === "addPostToAnAlbum";
    const isPhotoStreamMode = mode === "photoStream";

  showOptionsButton = true;
    if (isPhotoStreamMode) {
      showOptionsButton = false;
    }
    // UseEffect for handling click outside
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Function to check if click is outside
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    const handleFavoriteToggle = (e) => {
      e.stopPropagation();
      if (userId) {
        dispatch(thunkToggleFavorite(userId, postId));
      }
    };




    return (
      <div className="photo-item">
        <div className="image-wrapper">
          <LazyLoadImage
            src={imageUrl}
            alt="Photo"
            effect="blur"
            onClick={() => onClick(postId)}
          />
          <button onClick={handleFavoriteToggle} className="favorite-button">
            <FontAwesomeIcon
              icon={favorite ? solidStar : regularStar}
              className="favorite-icon"
            />
          </button>
          {console.log("Rendering Options Button: ", hasAlbums, showOptionsButton)}
          {hasAlbums && (
            <>
            {showOptionsButton && (
          <button className="options-button" onClick={() => setShowOptions(!showOptions)}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
        )}
          {/* <button
            className="options-button"
            onClick={() => setShowOptions(!showOptions)}
          >
            <FontAwesomeIcon icon={faEllipsisH} />
          </button> */}

          {showOptions && (
            <div className="options-modal" ref={optionsRef}>
              {/* "Add to Album" button shown if not in albumImagesMode */}
              {!isAlbumImagesMode && (
                <OpenShortModalButton
                  className="add-to-album-modal-trigger"
                  modalComponent={
                    <AddToAlbumModal
                      postId={postId}
                      // onClose={() => setShowOptions(false)}
                      onClose={openShortModal }
                      albumId={albumId}
                      mode={mode}
                    />
                  }
                  buttonText={
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="add-to-album-icon"
                    />
                  }
                />
              )}

              {/* "Remove from Album" button shown if not in addPostToAlbumMode */}
              {!isAddToAlbumMode && (
                <OpenShortModalButton
                  className="remove-from-album-modal-trigger"
                  modalComponent={
                    <RemoveFromAlbumModal
                      postId={postId}
                      // onClose={() => setShowOptions(false)}
                      onClose={openShortModal }
                      mode={mode}
                    />
                  }
                  buttonText={
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="remove-from-album-icon"
                    />
                  }
                />
              )}
            </div>
          )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default ImageItem;
