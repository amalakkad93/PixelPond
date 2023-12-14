import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreatePost, thunkUpdatePost } from "../../../store/posts";
import AWSImageUploader from "../../Images/AWSImageUploader";
import {
  selectPostById,
  selectUserAlbums,
  selectSessionUser,
} from "../../../store/selectors";

import {
  thunkGetAlbumsByUserId,
  thunkCreateAlbum,
  thunkUpdateAlbum,
} from "../../../store/albums";
import CreateAlbum from "../../Albums/CreateAlbum";
import EditAlbum from "../../Albums/EditAlbum";

import "./PostForm.css";

const PostForm = ({ postId, formType }) => {
  const dispatch = useDispatch();
  const existingPost = useSelector((state) => selectPostById(state, postId));
  const userAlbums = useSelector(selectUserAlbums);
  const sessionUser = useSelector(selectSessionUser);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [albumTitle, setAlbumTitle] = useState(""); // New album title
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkGetAlbumsByUserId(sessionUser.id));
    }
    if (formType === "Edit" && existingPost) {
      setTitle(existingPost.title);
      setDescription(existingPost.description);
      setAlbumId(existingPost.album_id);
      setUploadedImageUrl(existingPost.image);
    }
  }, [formType, existingPost, sessionUser, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (albumTitle && !albumId) {
      const response = await dispatch(thunkCreateAlbum({ title: albumTitle }));
      if (response.type === "SUCCESS") {
        setAlbumId(response.data.id);
      }
    }

    const postData = {
      title,
      description,
      album_id: albumId,
      image_url: uploadedImageUrl,
    };

    if (formType === "Create") {
      dispatch(thunkCreatePost(postData));
    } else if (formType === "Edit") {
      dispatch(thunkUpdatePost(postId, postData));
    }
  };

  return (
    <form className="PostForm" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      ></textarea>
      {userAlbums.length > 0 ? (
        <>
          <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
            <option value="">Select an Album</option>
            {userAlbums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            placeholder="Or Create New Album"
          />
        </>
      ) : (
        <input
          type="text"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          placeholder="Album Title"
        />
      )}
      <AWSImageUploader
        onUploadSuccess={(url) => setUploadedImageUrl(url)}
        onUploadFailure={(errorMessage) => console.error(errorMessage)}
      />
      <button type="submit">
        {formType === "Create" ? "Create Post" : "Update Post"}
      </button>
    </form>
  );
};

export default PostForm;
