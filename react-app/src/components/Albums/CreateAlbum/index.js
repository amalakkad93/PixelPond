import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkCreateAlbum,
  thunkGetAlbumsByUserId,
} from "../../../store/albums";
import { selectUserAlbums } from "../../../store/selectors";

const AlbumCreationForm = () => {
  const dispatch = useDispatch();
  const [albumTitle, setAlbumTitle] = useState('');
  const [error, setError] = useState(null);

  const handleAlbumSubmit = async (e) => {
      e.preventDefault();
      if (!albumTitle.trim()) {
          setError("Album title is required");
          return;
      }

      try {
          const response = await dispatch(thunkCreateAlbum({ title: albumTitle }));
          if (response.type !== "SUCCESS") {
              setError("Failed to create album");
          } else {
              setAlbumTitle('');
              setError(null);
          }
      } catch (error) {
          setError("An error occurred");
      }
  };

  return (
      <form onSubmit={handleAlbumSubmit}>
          <div className="form-group">
              <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Album Title"
              />
          </div>
          <button type="submit">Create Album</button>
          {error && <div className="error">{error}</div>}
      </form>
  );
};
export default AlbumCreationForm ;
