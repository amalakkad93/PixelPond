/**
 * AlbumForm Component
 *
 * This component serves as a form for creating or editing album details. It is designed to handle
 * both the creation of new albums and the editing of existing ones, based on the 'formType' prop.
 * The form includes input for the album title and a submit button. It uses Redux for state management,
 * dispatching actions to create or update albums. Error handling is included to manage and display
 * form submission errors. The component also integrates with a modal control context to handle
 * closing the modal on successful form submission or cancellation.
 *
 * @param {string} formType - The type of form, either 'Create' or 'Edit'.
 * @param {number} [albumId] - The ID of the album to be edited (required for 'Edit' formType).
 * @param {string} [albumTitle] - The initial title of the album (used in 'Edit' formType).
 * @param {number} currentPage - Current page number, used for pagination in the album list.
 * @param {number} perPage - Number of items per page in the album list.
 * @param {function} [setActiveAlbumImages] - Function to update active album images (optional).
 * @param {function} [onEdit] - Callback function to execute after successful edit (optional).
 */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useShortModal } from "../../../context/ModalShort";
import { thunkCreateAlbum, thunkUpdateAlbum } from "../../../store/albums";

import "./AlbumForm.css";

const AlbumForm = ({
  formType,
  albumId,
  albumTitle: initialAlbumTitle,
  currentPage,
  perPage,
  setActiveAlbumImages,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const { closeShortModal } = useShortModal();

  const [albumTitle, setAlbumTitle] = useState(initialAlbumTitle || "");
  const [error, setError] = useState(null);
  let isMounted = true;

  useEffect(() => {}, [albumTitle]);

  // useEffect hook for handling initial album title updates and component cleanup.
  // This hook sets the album title when the component is in 'Edit' formType and
  // the initialAlbumTitle is provided. It also includes a cleanup function that
  // sets the 'isMounted' flag to false when the component unmounts.
  useEffect(() => {
    // Update initial album title
    if (formType === "Edit" && initialAlbumTitle) {
      setAlbumTitle(initialAlbumTitle);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [initialAlbumTitle, formType]);

  // Asynchronous function to handle form submission.
  // It validates the album title, dispatches create or update actions based on formType,
  // and handles post-submission actions like error handling and closing the modal.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation for album title
    if (!albumTitle.trim()) {
      setError("Album title is required");
      return;
    }

    try {
      let response;
      // Dispatch actions based on the form type
      if (formType === "Create") {
        response = await dispatch(
          thunkCreateAlbum({ title: albumTitle }, currentPage, perPage)
        );
      } else {
        response = await dispatch(
          thunkUpdateAlbum(albumId, { title: albumTitle })
        );
      }
      // Handling response and post-submission actions
      if (response.type === "SUCCESS") {
        if (isMounted) {
          setAlbumTitle("");
          setError(null);
          closeShortModal();
          onEdit && onEdit();
        }
      } else {
        if (isMounted) {
          setError(response.error || "Failed to process album");
        }
      }
    } catch (error) {
      console.error("Album form error:", error);
      setError("An error occurred");
    }
  };
  
  // Form rendering with input field, submit button, and error display
  return (
    <form className="album-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          className="album-form-input"
          type="text"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          placeholder="Album Title"
        />
      </div>
      <button className="album-form-btn" type="submit">
        {formType === "Create" ? "Create Album" : "Update Album"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default AlbumForm;
