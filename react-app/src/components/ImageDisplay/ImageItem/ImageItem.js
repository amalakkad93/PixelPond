/**
 * ImageItem Component
 *
 * This component represents a single image in the ImageGrid. It displays the image and various
 * interactive elements like favorite button, options button, and modal triggers for adding or removing
 * the image from an album. It also handles favorite toggling and option modal display logic.
 *
 * @param {string} imageUrl - URL of the image to display.
 * @param {number} postId - ID of the post associated with the image.
 * @param {function} onClick - Function to execute when the image is clicked.
 * @param {boolean} addPostToAlbumMode - Flag to indicate if the component is in 'addPostToAnAlbum' mode.
 * @param {boolean} showRemoveIcon - Flag to show the remove icon in 'albumImages' mode.
 * @param {string} mode - Current mode of the component.
 * @param {number} albumId - ID of the album in 'albumImages' mode.
 * @param {boolean} hasAlbums - Flag indicating if the user has albums.
 * @param {boolean} showOptionsButton - Flag to show the options button.
 */
import React, { memo, useState, useEffect, useRef } from "react";
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
  ({
    imageUrl,
    postId,
    onClick,
    addPostToAlbumMode,
    showRemoveIcon,
    mode,
    albumId,
    hasAlbums,
    showOptionsButton,
  }) => {
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
          {hasAlbums && (
            <>
              {showOptionsButton && (
                <button
                  className="options-button"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
              )}

              {showOptions && (
                <div className="options-modal" ref={optionsRef}>
                  {/* "Add to Album" button shown if not in albumImagesMode */}
                  {!isAlbumImagesMode && (
                    <OpenShortModalButton
                      className="add-to-album-modal-trigger"
                      modalComponent={
                        <AddToAlbumModal
                          postId={postId}
                          onClose={openShortModal}
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
                          onClose={openShortModal}
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
