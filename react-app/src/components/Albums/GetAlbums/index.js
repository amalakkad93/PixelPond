import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { thunkGetAlbumsByUserId } from "../../../store/albums";
import {
  selectAllAlbums,
  selectCurrentPage,
  selectUserPosts,
  selectTotalAlbums,
} from "../../../store/selectors";
import { setLoading, setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import UserNavigationBar from "../../Navigation/UserNavigationBar";
import ImageDisplay from "../../ImageDisplay";
import "./GetAlbums.css";

const GetAlbums = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  console.log("🚀 ~ file: index.js:16 ~ GetAlbums ~ userId:", userId);
  const albums = useSelector(selectAllAlbums) || [];
  console.log("🚀 ~ file: index.js:14 ~ GetAlbums ~ albums:", albums);
  const userPosts = useSelector(selectUserPosts);
  console.log("🚀 ~ file: index.js:20 ~ GetAlbums ~ userPosts:", userPosts);
  // const currentPage = useSelector(selectCurrentPage);
  const totalAlbums = useSelector(selectTotalAlbums);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAbout, setShowAbout] = useState(false);

  const [activeAlbumId, setActiveAlbumId] = useState(null);

  const perPage = 4;
  const aboutMe = albums[0]?.about_me;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await dispatch(
          thunkGetAlbumsByUserId(userId, currentPage, perPage)
        );
        setTotalPages(response.totalPages);
        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, userId]);

  const toggleAbout = () => setShowAbout(!showAbout);

  if (!albums || albums.length === 0) return null;
  return (
    <>
     <nav className="album-navigation">
        <UserNavigationBar
          id={userId}
          onAboutClick={toggleAbout}
          showAbout={showAbout}
          albumCount={totalAlbums}
        />
      </nav>
      {showAbout && (
        <div className="about-section">
          <p>{aboutMe || "No about me information available."}</p>
        </div>
      )}
     {albums?.length === 0 ? (
        <div className="no-albums-message">
          <p>You currently have no albums.</p>
        </div>
      ) : (
        <div className="albums-container">
          {albums.map((album) => (
            <div
              key={album.id}
              className="album-item"
              onClick={() => setActiveAlbumId(album.id)}
            >
              <div className="album-title">{album.title}</div>
              {/* Conditionally render images based on the activeAlbumId */}
              {activeAlbumId === null && (
                <div className="album-images">
                  <div className="album-image-grid">
                    {album.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Image ${index} of ${album.title}`}
                        className="album-image"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Pagination component */}
      {activeAlbumId === null && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        useRedux={false}
      />
      )}
        {/* Display ImageDisplay component when an album is active */}
        {activeAlbumId && (
         <div className={`album-overlay ${activeAlbumId ? 'open' : ''}`}>
           <FontAwesomeIcon
            icon={faTimes}
            className="close-icon"
            onClick={() => setActiveAlbumId(null)}
          />
          <ImageDisplay mode="albumImages" albumId={activeAlbumId} />
        </div>
      )}
    </>
  );
};

export default GetAlbums;

//   return (
//     <>
      // <nav className="album-navigation">
      //   <UserNavigationBar
      //     id={userId}
      //     onAboutClick={toggleAbout}
      //     showAbout={showAbout}
      //     albumCount={totalAlbums}
      //   />
      // </nav>
      // {showAbout && (
      //   <div className="about-section">
      //     <p>{aboutMe || "No about me information available."}</p>
      //   </div>
      // )}
//       {albums?.length === 0 ? (
//         <div className="no-albums-message">
//           <p>You currently have no albums.</p>
//         </div>
//       ) : (

//         <div className="albums-container">
//           {albums.map((album) => (
//             <div
//               key={album.id}
//               className="album-item"
//               // onClick={() => setActiveAlbumId(album.id)}
//               onClick={() => {
//                 if (activeAlbumId === album.id) setActiveAlbumId(null);
//                 else setActiveAlbumId(album.id);
//               }}
//               // onClick={() => history.push(`/albums/${album?.id}`)}
//             >
//               <div className="album-title">{album.title}</div>
//               {activeAlbumId !== album.id && (
//               <div className="album-images">
//                 <div className="album-image-grid">
//                   {album.images.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image.url}
//                       alt={`Image ${index} of ${album.title}`}
//                       className="album-image"
//                     />
//                   ))}
//                 </div>
//               </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       {activeAlbumId && (
//         <div className="album-overlay">
//           <ImageDisplay mode="albumImages" albumId={activeAlbumId} />
//           <button onClick={() => setActiveAlbumId(null)}>Close</button>
//         </div>
//       )}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(newPage) => setCurrentPage(newPage)}
//         useRedux={false}
//       />


//     </>
//   );
// };

// export default GetAlbums;
