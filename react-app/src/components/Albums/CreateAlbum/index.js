// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   thunkCreateAlbum,
//   thunkGetAlbumsByUserId,
// } from "../../../store/albums";
// import { selectUserAlbums } from "../../../store/selectors";

// const CreateAlbum = ({ albumTitle, setAlbumTitle }) => {
//   const dispatch = useDispatch();
//   const userAlbums = useSelector(selectUserAlbums);
//   const sessionUser = useSelector((state) => state.session.user);
//   const [creatingNewAlbum, setCreatingNewAlbum] = useState(false);
//   // const [albumTitle, setAlbumTitle] = useState('');
//   const [albumId, setAlbumId] = useState("");

//   useEffect(() => {
//     if (sessionUser) {
//       dispatch(thunkGetAlbumsByUserId(sessionUser.id));
//     }
//   }, [dispatch, sessionUser]);

//   const handleNewAlbumSubmit = async (e) => {
//     e.preventDefault();
//     if (albumTitle) {
//       const newAlbum = await dispatch(thunkCreateAlbum({ title: albumTitle }));
//       // onAlbumCreated(newAlbum);
//     }
//   };

//   return (
//     <>
//       {userAlbums.length > 0 && !creatingNewAlbum ? (
//         <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
//           {userAlbums.map((album) => (
//             <option key={album.id} value={album.id}>
//               {album.title}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <form onSubmit={handleNewAlbumSubmit}>
//           <input
//             type="text"
//             value={albumTitle}
//             onChange={(e) => setAlbumTitle(e.target.value)}
//             placeholder="Album Title"
//           />
//           {/* <button type="submit">Create Album</button> */}
//         </form>
//       )}
//       {/* {userAlbums.length > 0 && (
//         <button
//           type="button"
//           onClick={() => setCreatingNewAlbum(!creatingNewAlbum)}
//         >
//           {creatingNewAlbum ? "Choose Existing Album" : "Create New Album"}
//         </button>
//       )} */}
//     </>
//   );
// };

// export default CreateAlbum;
const CreateAlbum = ({ albumTitle, setAlbumTitle }) => {
  return (
    <input
      type="text"
      value={albumTitle}
      onChange={(e) => setAlbumTitle(e.target.value)}
      placeholder="Album Title"
    />
  );
};
export default CreateAlbum;
