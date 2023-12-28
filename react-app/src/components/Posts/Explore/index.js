import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../../Pagination";
import Spinner from "../../Spinner";
import ImageGrid from "../../ImageDisplay/ImageGrid/ImageGrid";
import { thunkGetAllPosts, thunkGetAllTags, thunkGetPostsByTag } from "../../../store/posts";
import { thunkFetchAllFavorites } from "../../../store/favorites";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import {
  selectLoading,
  selectAllPostsImages,
  selectSessionUser,
  selectAllTags,
  selectPostsByTag,
} from "../../../store/selectors";
import TagSearch from "../../Tags/TagSearch";
import "./Explore.css";

const Explore = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const loading = useSelector(selectLoading);
  const postsImages = useSelector(selectAllPostsImages);
  const postsByTag = useSelector(selectPostsByTag);
  const sessionUser = useSelector(selectSessionUser);
  const allTags = useSelector(selectAllTags);
  const perPage = 10;

  // const fetchData = async (page) => {
  //   dispatch(setLoading(true));
  //   const response = await dispatch(thunkGetAllPosts(page, perPage));

  //   if (response) {
  //     setCurrentPage(response.current_page);
  //     setTotalPages(response.total_pages);
  //   }

  //   dispatch(setLoading(false));
  // };

  const fetchData = async (page, tag = "") => {
    dispatch(setLoading(true));
    try {
      let response;
      if (tag) {

        response = await dispatch(thunkGetPostsByTag(tag, page, perPage));
      } else {

        response = await dispatch(thunkGetAllPosts(page, perPage));
      }

      if (response) {
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };


  const onTagSelected = (tag) => {
    setSelectedTag(tag);
    fetchData(1, tag);
  };

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  useEffect(() => {
    fetchData(currentPage, selectedTag);
  }, [currentPage, selectedTag, dispatch]);

  useEffect(() => {
    dispatch(thunkGetAllTags());
  }, [dispatch]);


  if (loading) {
    return <Spinner />;
  }
  const displayPosts = selectedTag ? postsByTag : postsImages;
  return (
    <div className="explore-container">
      <TagSearch allTags={allTags} onTagSelected={onTagSelected} />

      <ImageGrid displayedImages={displayPosts} />

      <Pagination
        totalItems={totalPages * perPage}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={(newPage) => fetchData(newPage, selectedTag)}
      />
    </div>
  );
};
export default Explore;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
// import Masonry from "react-masonry-css";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import Pagination from "../../Pagination";
// import Spinner from "../../Spinner";
// import {thunkGetAllPosts,} from "../../../store/posts";
// import { setLoading, setError, clearUIState } from "../../../store/ui";
// import { selectLoading, selectAllPostsImages,} from "../../../store/selectors";
// import "./Explore.css";

// const ImageItem = ({ imageUrl, postId, onClick }) => (
//   <div className="photo-item" onClick={() => onClick(postId)}>
//     <LazyLoadImage src={imageUrl} alt="Photo" effect="blur" />
//   </div>
// );

// const Explore = () => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const loading = useSelector(selectLoading);
//   const postsImages = useSelector(selectAllPostsImages);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const perPage = 10;

//   const fetchData = async (page) => {
//     dispatch(setLoading(true));
//     const response = await dispatch(thunkGetAllPosts(page, perPage));

//     if (response) {
//       setCurrentPage(response.current_page);
//       setTotalPages(response.total_pages);
//     }

//     dispatch(setLoading(false));
//   };

//   useEffect(() => {
//     fetchData(currentPage);
//   }, [currentPage, dispatch]);

//   const breakpointColumnsObj = {
//     default: 4,
//     1100: 3,
//     700: 2,
//     500: 1,
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <div className="all-posts-images">
//       {postsImages && postsImages.length > 0 && (
//         <Masonry
//           breakpointCols={breakpointColumnsObj}
//           className="photo-grid"
//           columnClassName="photo-grid_column"
//         >
//           {postsImages.map((post) => (
//             <ImageItem
//               key={post.post_id}
//               imageUrl={post.image_url}
//               postId={post.post_id}
//               onClick={() => history.push(`/posts/${post.post_id}`)}
//             />
//           ))}
//         </Masonry>
//       )}

//       <Pagination
//         totalItems={totalPages * perPage}
//         itemsPerPage={perPage}
//         currentPage={currentPage}
//         onPageChange={(newPage) => fetchData(newPage)}
//       />
//     </div>
//   );
// };

// export default Explore;
