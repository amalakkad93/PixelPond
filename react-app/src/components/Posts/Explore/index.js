/**
 * Explore Component
 *
 * This component is responsible for displaying the main content of the Explore page.
 * It handles the logic for fetching posts based on the selected tag, pagination,
 * and managing the state for the current page, total pages, and selected tag.
 *
 * The component uses Redux thunks for data fetching and selectors for accessing
 * the Redux state. It includes the TagSearch component for tag-based searching
 * and ImageGrid for displaying the posts.
 */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../Pagination";
import useResponsivePagination from "../../Pagination/useResponsivePagination";
import Spinner from "../../Spinner";
import ImageGrid from "../../ImageDisplay/ImageGrid/ImageGrid";
import TagSearch from "../../Tags/TagSearch";
import {
  thunkGetAllPosts,
  // thunkGetAllTags,
  // thunkGetPostsByTag,
  // thunkGetPostsByTags,
} from "../../../store/posts";
import {
  thunkGetAllTags,
  thunkGetPostsByTag,
  thunkGetPostsByTags,
} from "../../../store/tags";

import { thunkFetchAllFavorites } from "../../../store/favorites";
import { setLoading } from "../../../store/ui";
import {
  selectLoading,
  selectAllPostsImages,
  selectSessionUser,
  selectAllTags,
  selectPostsByTag,
} from "../../../store/selectors";
import "./Explore.css";

const Explore = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  // Redux store state
  const loading = useSelector(selectLoading);
  const postsImages = useSelector(selectAllPostsImages);
  const postsByTag = useSelector(selectPostsByTag);
  console.log("🚀 ~ file: index.js:51 ~ Explore ~ postsByTag :", postsByTag )
  const sessionUser = useSelector(selectSessionUser);
  const allTags = useSelector(selectAllTags);
  console.log("🚀 ~ file: index.js:47 ~ Explore ~ allTags:", allTags);
  const perPage = useResponsivePagination(10);

  // Fetches posts based on the current page and selected tags
  const fetchData = async (page, tags = []) => {
    dispatch(setLoading(true));
    try {
      let response;
      if (tags.length > 0) {
        response = await dispatch(thunkGetPostsByTags(tags, page, perPage));
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

  // Update tag selection
  const updateTagSelection = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    fetchData(1, updatedTags);
  };

  useEffect(() => {
    if (sessionUser?.id) {
      dispatch(thunkFetchAllFavorites(sessionUser?.id));
    }
  }, [dispatch, sessionUser?.id]);

  useEffect(() => {
    fetchData(currentPage, selectedTags);
  }, [currentPage, selectedTags, dispatch]);

  useEffect(() => {
    dispatch(thunkGetAllTags());
  }, [dispatch]);

  if (loading) return <Spinner />;

  // Decide which posts to display: by selected tags or all posts
  const displayPosts = selectedTags.length > 0 ? postsByTag : postsImages;

  return (
    <div className="explore-container">
      <TagSearch
        allTags={allTags}
        selectedTags={selectedTags}
        onTagSelected={updateTagSelection}
        onClearTag={() => {
          setSelectedTags([]);
          fetchData(currentPage);
        }}
      />
      <div className="explor-photo-grid">
        <ImageGrid
          className="explor-photo-grid"
          displayedImages={displayPosts}
        />
      </div>
      <Pagination
        totalItems={totalPages * perPage}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={(newPage) => fetchData(newPage, selectedTags)}
      />
    </div>
  );
};

export default Explore;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Pagination from "../../Pagination";
// import Spinner from "../../Spinner";
// import ImageGrid from "../../ImageDisplay/ImageGrid/ImageGrid";
// import TagSearch from "../../Tags/TagSearch";
// import {
//   thunkGetAllPosts,
//   thunkGetAllTags,
//   thunkGetPostsByTag,
// } from "../../../store/posts";
// import {thunkFetchAllFavorites} from "../../../store/favorites";
// import { setLoading } from "../../../store/ui";
// import {
//   selectLoading,
//   selectAllPostsImages,
//   selectSessionUser,
//   selectAllTags,
//   selectPostsByTag,
// } from "../../../store/selectors";
// import "./Explore.css";

// const Explore = () => {
//   const dispatch = useDispatch();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [selectedTag, setSelectedTag] = useState("");

//   // Loading and posts state from Redux store
//   const loading = useSelector(selectLoading);
//   const postsImages = useSelector(selectAllPostsImages);
//   const postsByTag = useSelector(selectPostsByTag);
//   const sessionUser = useSelector(selectSessionUser);
//   const allTags = useSelector(selectAllTags);
//   const perPage = 10;

//   // Fetches posts based on the current page and selected tag.
//   const fetchData = async (page, tag = "") => {
//     dispatch(setLoading(true));
//     try {
//       let response;
//       response = tag
//         ? await dispatch(thunkGetPostsByTag(tag, page, perPage))
//         : await dispatch(thunkGetAllPosts(page, perPage));

//       if (response) {
//         setCurrentPage(response.current_page);
//         setTotalPages(response.total_pages);
//       }
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // Fetch user favorites if a session user exists.
//   useEffect(() => {
//     if (sessionUser?.id) {
//       dispatch(thunkFetchAllFavorites(sessionUser?.id));
//     }
//   }, [dispatch, sessionUser?.id]);

//   // Fetch posts whenever currentPage or selectedTag changes.
//   useEffect(() => {
//     fetchData(currentPage, selectedTag);
//   }, [currentPage, selectedTag, dispatch]);

//   // Fetch all tags for the tag search functionality.
//   useEffect(() => {
//     dispatch(thunkGetAllTags());
//   }, [dispatch]);

//   if (loading) return <Spinner />;

//   // Decides which posts to display: by tag or all posts.
//   const displayPosts = selectedTag ? postsByTag : postsImages;

//   return (
//     <div className="explore-container">
//       <TagSearch
//         allTags={allTags}
//         selectedTag={selectedTag}
//         onTagSelected={(tag) => {
//           setSelectedTag(tag);
//           fetchData(1, tag);
//         }}
//         onClearTag={() => {
//           setSelectedTag("");
//           fetchData(currentPage);
//         }}
//       />

//       <ImageGrid displayedImages={displayPosts} />

//       <Pagination
//         totalItems={totalPages * perPage}
//         itemsPerPage={perPage}
//         currentPage={currentPage}
//         onPageChange={(newPage) => fetchData(newPage, selectedTag)}
//       />
//     </div>
//   );
// };

// export default Explore;
