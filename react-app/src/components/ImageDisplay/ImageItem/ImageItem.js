import React, { useContext, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import AddToAlbumModal from "../../Albums/AddToAlbumModal";
import RemoveFromAlbumModal from "../../Albums/RemoveFromAlbumModal";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
import { useShortModal } from "../../../context/ModalShort";

import { thunkToggleFavorite } from "../../../store/favorites";
import {isPostFavorited, selectSessionUser} from "../../../store/selectors";

import "./ImageItem.css";

const ImageItem = memo(
  ({ imageUrl, postId, onClick, addPostToAlbumMode, showRemoveIcon }) => {
    const dispatch = useDispatch();
    const { closeShortModal } = useShortModal();
    const { openShortModal } = useShortModal();
    const sessionUser = useSelector(selectSessionUser);
    const userId = sessionUser?.id;
    const favorite = useSelector(state => isPostFavorited(state, postId));

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

             <FontAwesomeIcon icon={favorite ? solidStar : regularStar} className="favorite-icon" />
          </button>
        </div>
        {addPostToAlbumMode && (
          <OpenShortModalButton
            className="add-to-album-modal-trigger"
            modalComponent={
              <AddToAlbumModal postId={postId} onClose={closeShortModal} />
            }
            buttonText={
              <FontAwesomeIcon icon={faPlus} className="add-to-album-icon" />
            }
          />
        )}
        {showRemoveIcon && (
          <OpenShortModalButton
            className="remove-from-album-modal-trigger"
            modalComponent={
              <RemoveFromAlbumModal postId={postId} onClose={openShortModal } />
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
    );
  }
);

export default ImageItem;

// const ImageItem = memo(({ imageUrl, postId, onClick, isUnassignedMode }) => {
//   const [showAddToAlbumModal, setShowAddToAlbumModal] = useState(false);

//   return (
//     <div className="photo-item">
//       <LazyLoadImage src={imageUrl} alt="Photo" effect="blur" onClick={() => onClick(postId)} />
//       {isUnassignedMode && (
//         <button className="add-to-album-btn" onClick={() => setShowAddToAlbumModal(true)}>
//           <FontAwesomeIcon icon={faPlus} />
//         </button>
//       )}
//       {showAddToAlbumModal && (
//         <AddToAlbumModal postId={postId} onClose={() => setShowAddToAlbumModal(false)} />
//       )}
//     </div>
//   );
// });

// export default ImageItem;
