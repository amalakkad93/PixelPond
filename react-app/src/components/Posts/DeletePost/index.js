
import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import {thunkDeletePost} from '../../../store/posts';
import './DeletePost.css';

export default function DeletePost({
  postId,
  onDelete
}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(thunkDeletePost(postId));

      closeModal();
      onDelete();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="tile-parent-delete-item">
        <div className="delete-item-h1-p-tag">
          <h1 className="delete-item-h1-tag">Confirm Delete</h1>
          <p className="delete-item-p-tag">
            Are you sure you want to delete this {postId ? "post" : "image"}?
          </p>
        </div>
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
