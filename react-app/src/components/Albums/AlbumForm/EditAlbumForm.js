/**
 * EditAlbumForm Component
 *
 * This component is a specialized version of the AlbumForm for editing albums. It renders the
 * AlbumForm component with the 'formType' prop set to 'Edit'. It is responsible for passing the
 * necessary props to the AlbumForm component, such as 'albumId', 'albumTitle', and others, to
 * facilitate the editing of an existing album.
 *
 * @param {number} albumId - The ID of the album to be edited.
 * @param {string} albumTitle - The initial title of the album to be edited.
 * @param {number} currentPage - Current page number for pagination in the album list.
 * @param {number} perPage - Number of items per page in the album list.
 * @param {function} setActiveAlbumImages - Function to update active album images.
 * @param {function} onEdit - Callback function to execute after successful edit.
 * @param {function} closeShortModal - Function to close the modal.
 */
import React from "react";
import AlbumForm from "./index";

export default function EditAlbumForm({
  albumId,
  albumTitle,
  currentPage,
  perPage,
  setActiveAlbumImages,
  onEdit,
  closeShortModal,
}) {
  return (
    <AlbumForm
      formType="Edit"
      albumId={albumId}
      albumTitle={albumTitle}
      currentPage={currentPage}
      perPage={perPage}
      closeShortModal={closeShortModal}
      onEdit={onEdit}
    />
  );
}
