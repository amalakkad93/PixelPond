/**
 * CreateAlbumForm Component
 *
 * This component is a specialized version of the AlbumForm for creating new albums. It renders the
 * AlbumForm component with the 'formType' prop set to 'Create'. It handles the creation of new albums
 * by providing the necessary props to the AlbumForm component. The component is designed to work within
 * a modal context, providing a straightforward interface for users to add new albums to their collection.
 *
 * @param {number} currentPage - Current page number for pagination in the album list.
 * @param {number} perPage - Number of items per page in the album list.
 * @param {function} closeShortModal - Function to close the modal.
 */
import React from "react";
import AlbumForm from "./index";

export default function CreateAlbumForm({
  currentPage,
  perPage,
  closeShortModal,
}) {
  return (
    <AlbumForm
      formType="Create"
      currentPage={currentPage}
      perPage={perPage}
      closeShortModal={closeShortModal}
    />
  );
}
