/**
 * DeleteAlbum Component
 *
 * This component is responsible for handling the deletion of an album. It renders a confirmation
 * dialog asking the user to confirm the deletion of an album. The component uses Redux for state
 * management, dispatching a thunk action to delete the album. It also integrates with a modal control
 * context for closing the modal upon completion of the action. The component supports a callback function
 * which is called after a successful deletion.
 *
 * @param {number} albumId - The ID of the album to be deleted.
 * @param {function} onDelete - Callback function to execute after successful deletion (optional).
 */
import React from "react";
import { useDispatch } from "react-redux";
import { useShortModal } from "../../../context/ModalShort";
import { thunkDeleteAlbum } from "../../../store/albums";
import "./DeleteAlbum.css";

export default function DeleteAlbum({ albumId, onDelete }) {
  const dispatch = useDispatch();
  const { closeShortModal } = useShortModal();

  // handleDelete function: An asynchronous function that dispatches the thunkDeleteAlbum action.
  // Upon successful deletion, it closes the modal and optionally calls the onDelete callback.
  const handleDelete = async () => {
    try {
      await dispatch(thunkDeleteAlbum(albumId));

      closeShortModal();
      onDelete && onDelete();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Component rendering: The component renders a confirmation dialog with two buttons:
  // one to confirm the deletion and another to cancel and close the modal.
  return (
    <>
      <div className="tile-parent-delete-item">
        <div className="delete-item-h1-p-tag">
          <h1 className="delete-item-h1-tag">Confirm Delete</h1>
          <p className="delete-item-p-tag">
            Are you sure you want to delete this album?
          </p>
        </div>
        <div className="delete-keep-item-cancel-btn">
          <button id="delete-item-btn" onClick={handleDelete}>
            Yes (Delete)
          </button>
          <button id="cancel-item-btn" onClick={closeShortModal}>
            No (Keep)
          </button>
        </div>
      </div>
    </>
  );
}
