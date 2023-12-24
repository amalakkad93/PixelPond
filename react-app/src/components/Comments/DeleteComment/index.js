import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { thunkDeleteComment } from '../../../store/comments';
import './DeleteComment.css';

export default function DeleteComment({ postId, commentId, onDelete }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(thunkDeleteComment(postId, commentId));

      closeModal();
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
          <button id="cancel-item-btn" onClick={closeModal}>
            No (Keep)
          </button>
        </div>
      </div>
    </>
  );
}
