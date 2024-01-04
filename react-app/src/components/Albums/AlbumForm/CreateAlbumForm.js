// CreateAlbumForm.js
import React from "react";
import AlbumForm from "./index";

export default function CreateAlbumForm({ currentPage, perPage, closeShortModal }) {
  return (
    <AlbumForm formType="Create" currentPage={currentPage} perPage={perPage} closeShortModal={closeShortModal} />
  );
}
