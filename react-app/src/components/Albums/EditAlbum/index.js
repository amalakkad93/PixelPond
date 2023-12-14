// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { thunkUpdateAlbum } from '../../../store/albums';
// import { selectUserAlbums } from '../../../store/selectors';

// const EditAlbum = ({ initialAlbumId, initialTitle, onAlbumUpdated }) => {
//   const dispatch = useDispatch();
//   const userAlbums = useSelector(selectUserAlbums);
//   const [albumId, setAlbumId] = useState(initialAlbumId);
//   const [albumTitle, setAlbumTitle] = useState(initialTitle);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (albumTitle) {
//       const updatedAlbum = await dispatch(thunkUpdateAlbum(albumId, { title: albumTitle }));
//       onAlbumUpdated(updatedAlbum);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//   <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
//       {userAlbums.map(album => (
//         <option key={album.id} value={album.id}>{album.title}</option>
//       ))}
//     </select>
//       <input
//         type="text"
//         value={albumTitle}
//         onChange={(e) => setAlbumTitle(e.target.value)}
//         placeholder="Album Title"
//       />

//     </form>
//   );
// };

// export default EditAlbum;
const EditAlbum = ({ userAlbums, albumId, setAlbumId }) => {
  return (
    <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
      {userAlbums.map(album => (
        <option key={album.id} value={album.id}>{album.title}</option>
      ))}
    </select>
  );
};
export default EditAlbum;
