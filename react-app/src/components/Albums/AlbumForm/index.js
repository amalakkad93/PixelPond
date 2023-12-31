import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useShortModal } from "../../../context/ModalShort";
import {
  thunkCreateAlbum,
 thunkUpdateAlbum,
  thunkGetAlbumsByUserId,
} from "../../../store/albums";
import { selectUserAlbums } from "../../../store/selectors";

import "./AlbumForm.css";

const AlbumForm = ({ formType, albumId, albumTitle: initialAlbumTitle, currentPage, perPage, setActiveAlbumImages,  onEdit }) => {
    const dispatch = useDispatch();
    const { closeShortModal } = useShortModal();

    const [albumTitle, setAlbumTitle] = useState(initialAlbumTitle || "");
    const [newTitle, setNewTitle] = useState("");
    const [error, setError] = useState(null);
    let isMounted = true;

    useEffect(() => {

    }, [albumTitle]);

    useEffect(() => {
      // Update initial album title
      if(formType === "Edit" && initialAlbumTitle) {
          setAlbumTitle(initialAlbumTitle);
      }

      // Cleanup function
      return () => {
          isMounted = false;
      };
  }, [initialAlbumTitle, formType]);


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!albumTitle.trim()) {
        setError("Album title is required");
        return;
      }

      try {
        let response;
        if (formType === "Create") {
          response = await dispatch(thunkCreateAlbum({ title: albumTitle }, currentPage, perPage));
        } else {
          // response = await dispatch(thunkUpdateAlbum(albumId, { title: albumTitle }, currentPage, perPage));
          response = await dispatch(thunkUpdateAlbum(albumId, { title: albumTitle }));
        }

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
        <button  className="album-form-btn" type="submit">{formType === "Create" ? "Create Album" : "Update Album"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    );
  };

  export default AlbumForm;

// const AlbumCreationForm = ({ currentPage, perPage }) => {
//   const dispatch = useDispatch();
// const { closeModal } = useModal();
//   const [albumTitle, setAlbumTitle] = useState("");
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!albumTitle.trim()) {
//       setError("Album title is required");
//       return;
//     }

//     try {
//       const response = await dispatch(thunkCreateAlbum({ title: albumTitle }, currentPage, perPage));
//       if (response.type === "SUCCESS") {
//         setAlbumTitle("");
//         setError(null);
//         console.log("About to close modal");
//         closeModal();
//       } else {
//         setError(response.error || "Failed to create album");
//       }
//     } catch (error) {
//       console.error("Album creation error:", error);
//       setError("An error occurred");
//     }
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="form-group">
//         <input
//           type="text"
//           value={albumTitle}
//           onChange={(e) => setAlbumTitle(e.target.value)}
//           placeholder="Album Title"
//         />
//       </div>
//       <button type="submit">Create Album</button>
//       {error && <div className="error">{error}</div>}
//     </form>
//   );
// };
// export default AlbumCreationForm;
