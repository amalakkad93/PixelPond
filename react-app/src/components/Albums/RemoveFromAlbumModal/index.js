import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkRemovePostFromAlbum,
  thunkGetAlbumsByUserId,
  thunkGetAlbumImages,
} from "../../../store/albums";
import { selectUserAlbums, selectSessionUser } from "../../../store/selectors";
import { useShortModal } from "../../../context/ModalShort";

import "./RemoveFromAlbumModal.css";
const ITEMS_PER_PAGE = 10;
const RemoveFromAlbumModal = ({ postId }) => {
  const dispatch = useDispatch();
  const { closeShortModal } = useShortModal();
  const sessionUser = useSelector(selectSessionUser);
  const userAlbumsRaw = useSelector(selectUserAlbums);
  const userAlbums = useMemo(() => userAlbumsRaw || [], [userAlbumsRaw]);

  console.log(
    "🚀 ~ file: index.js:14 ~ RemoveFromAlbumModal ~ userAlbums:",
    userAlbums
  );
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [albumsContainingPost, setAlbumsContainingPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    }
  }, [dispatch, sessionUser]);

  useEffect(() => {
    if (userAlbums && userAlbums.length > 0) {
      console.log("User Albums:", userAlbums);
      console.log("Post ID:", postId);

      const postIdInt = parseInt(postId, 10);

      const filteredAlbums = userAlbums.filter((album) => {
        const imageIds = album.images?.allIds;
        return imageIds?.some((imageId) => {
          const image = album.images.byId[imageId];
          return image?.post_id === postIdInt;
        });
      });


      console.log("Filtered Albums:", filteredAlbums);

      setAlbumsContainingPost(filteredAlbums);

      if (filteredAlbums.length > 0) {
        setSelectedAlbumId(filteredAlbums[0].id);
      }
    }
  }, [userAlbums, postId]);

  const handleRemoveFromAlbum = async () => {
    if (selectedAlbumId) {
      try {
        await dispatch(thunkRemovePostFromAlbum(postId, selectedAlbumId));
        dispatch(
          thunkGetAlbumImages(selectedAlbumId, currentPage, ITEMS_PER_PAGE)
        );
        dispatch(
          thunkGetAlbumsByUserId(sessionUser.id, currentPage, ITEMS_PER_PAGE)
        );

        closeShortModal();
      } catch (error) {
        console.error("Error removing post from album:", error);
      }
    }
  };

  console.log(
    "🚀 ~ file: index.js:17 ~ RemoveFromAlbumModal ~ albumsContainingPost:",
    albumsContainingPost
  );
  return (
    <div className="remove-from-album-modal">
      <h2>Remove from Album</h2>
      <select
        value={selectedAlbumId}
        onChange={(e) => setSelectedAlbumId(e.target.value)}
      >
        <option value="">Select Album</option>
        {albumsContainingPost.map((album) => (
          <option key={album.id} value={album.id}>
            {album.title}
          </option>
        ))}
      </select>
      <button onClick={handleRemoveFromAlbum}>Remove</button>
      <button onClick={closeShortModal}>Cancel</button>
    </div>
  );
};

export default RemoveFromAlbumModal;
