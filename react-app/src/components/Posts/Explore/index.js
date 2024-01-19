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
import { useLocation } from "react-router-dom";
import Pagination from "../../Pagination";
import useResponsivePagination from "../../Pagination/useResponsivePagination";
import Spinner from "../../Spinner";
import ImageGrid from "../../ImageDisplay/ImageGrid/ImageGrid";
import { thunkGetAllPosts } from "../../../store/posts";
import {
  thunkGetAllTags,
  thunkGetPostsByTags,
} from "../../../store/tags";

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
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redux store state
  const postsImages = useSelector(selectAllPostsImages);
  const postsByTag = useSelector(selectPostsByTag);
  const perPage = useResponsivePagination(10);

  // Fetches posts based on the current page and selected tags
  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      let response;
      if (selectedTags.length > 0) {
        response = await dispatch(
          thunkGetPostsByTags(selectedTags, page, perPage)
        );
      } else {
        response = await dispatch(thunkGetAllPosts(page, perPage));
      }

      if (response) {
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(thunkGetAllTags());
  }, [dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tagsArray = queryParams.getAll("tags");
    setSelectedTags(tagsArray);
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchData(currentPage);
  }, [selectedTags, currentPage, perPage, dispatch]);

  if (isLoading) return <Spinner />;

  // Decide which posts to display: by selected tags or all posts
  const displayPosts = selectedTags.length > 0 ? postsByTag : postsImages;

  return (
    <div className="explore-container">
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
        onPageChange={(newPage) => fetchData(newPage)}
      />
    </div>
  );
};

export default Explore;
