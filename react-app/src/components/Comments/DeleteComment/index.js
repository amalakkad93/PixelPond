/**
 * DeleteComment Component
 *
 * This component is responsible for handling the deletion of a comment. It renders a confirmation
 * dialog asking the user to confirm the deletion of a comment. The component uses Redux for state
 * management, dispatching a thunk action to delete the comment. It also integrates with a modal control
 * context for closing the modal upon completion of the action. The component supports a callback function
 * which is called after a successful deletion.
 *
 * @param {number} postId - The ID of the post associated with the comment.
 * @param {number} commentId - The ID of the comment to be deleted.
 * @param {function} onDelete - Callback function to execute after successful deletion
 */
import React from "react";
import { useDispatch } from "react-redux";
import { useShortModal } from "../../../context/ModalShort";
import { thunkDeleteComment } from "../../../store/comments";

import "./DeleteComment.css";

export default function DeleteComment({ postId, commentId, onDelete }) {
  const dispatch = useDispatch();

  const { closeShortModal } = useShortModal();

  // handleDelete function: An asynchronous function that dispatches the thunkDeleteComment action.
  // Upon successful deletion, it closes the modal and optionally calls the onDelete callback.
  const handleDelete = async () => {
    try {
      await dispatch(thunkDeleteComment(postId, commentId));

      closeShortModal();
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Component rendering: The component renders a confirmation dialog with two buttons:
  // one to confirm the deletion and another to cancel and close the modal.
  return (
    <>
      <div className="tile-parent-delete-item">
        <h1 className="delete-item-h1-tag">Confirm Delete</h1>
        <p className="delete-item-p-tag">
          Are you sure you want to delete this comment?
        </p>
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
