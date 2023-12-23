// EditAlbumForm.js
import React from "react";
import AlbumForm from "./index";

export default function EditAlbumForm({
  albumId,
  albumTitle,
  currentPage,
  perPage,
  setActiveAlbumImages,
}) {
  return (
    <AlbumForm
      formType="Edit"
      albumId={albumId}
      albumTitle={albumTitle}
      currentPage={currentPage}
      perPage={perPage}
    />
  );
}
