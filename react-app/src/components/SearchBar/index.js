/**
 * SearchBar Component
 *
 * This component is responsible for handling the search functionality, including searching
 * for tags and users. It allows users to type in a search term, displays suggestions in a
 * dropdown, and handles user interactions with these suggestions. Users can search for tags,
 * select them from the dropdown, and view selected tags. Additionally, users can search for
 * other users and navigate to their profiles. The component integrates with Redux for state
 * management and uses React Router for navigation.
 *
 * @param {Array} allTags - Array of all available tags for searching.
 * @param {function} onTagSelected - Function to handle when a tag is selected.
 * @param {function} onTagClear - Function to clear the selected tag.
 */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/ui";
import { thunkGetPostsByTags } from "../../store/tags";
import { thunkGetAllPosts } from "../../store/posts";
import { thunkSearchUsers } from "../../store/session";
import useResponsivePagination from "../Pagination/useResponsivePagination";
import { highlightText } from "../../assets/helpers/helpers";
import "./SearchBar.css";

// Utility function for debouncing - used to limit the rate at which a function can fire.
const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const SearchBar = ({ allTags, onTagSelected, onTagClear }) => {
  // Redux dispatch and React Router hooks for state management and navigation.
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // State definitions.
  const [searchTerm, setSearchTerm] = useState(""); // Current search input.
  const [selectedTags, setSelectedTags] = useState([]); // Tags selected by the user.
  const [showDropdown, setShowDropdown] = useState(false); // Control visibility of the dropdown.
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page.
  const [searchResults, setSearchResults] = useState({ users: [], tags: [] }); // Store search results.

  // Pagination hook for responsive page sizes.
  const perPage = useResponsivePagination(10);
  const containerRef = useRef(null);

  // fetchData: Fetches data based on selected tags or loads all posts.
  const fetchData = async () => {
    if (selectedTags.length > 0) {
      dispatch(thunkGetPostsByTags(selectedTags, currentPage, perPage));
    } else {
      dispatch(thunkGetAllPosts(currentPage, perPage));
    }
  };

  // useEffect hooks for data fetching and URL query parameter handling.

  // Effect for fetching data on component mount or update
  useEffect(() => {
    fetchData();
  }, [selectedTags, currentPage, perPage]);

  // Effect for handling URL query parameters (tags)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tagsArray = queryParams.getAll("tags");
    setSelectedTags(tagsArray);
    if (tagsArray.length > 0) {
      dispatch(thunkGetPostsByTags(tagsArray));
    }
  }, [location.search, dispatch]);

  // Function for handling search input changes with debouncing
  const handleSearch = async (term) => {
    setShowDropdown(term.trim().length > 0);
    if (term.length > 0) {
      const userResults = (await dispatch(thunkSearchUsers(term))) ?? [];
      const filteredTags = Array.isArray(allTags)
        ? allTags.filter((tag) =>
            tag.toLowerCase().includes(term.toLowerCase())
          )
        : [];

      setSearchResults({ users: userResults, tags: filteredTags });
    } else {
      setSearchResults({ users: [], tags: [] });
    }
  };

  // Debounced version of handleSearch
  const debouncedHandleSearch = debounce(handleSearch, 300);


  // Event handlers for search interactions (input change, tag/user selection, etc.)
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedHandleSearch(term);
  };

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);

    const newQueryParams = new URLSearchParams();
    updatedTags.forEach((t) => newQueryParams.append("tags", t));
    history.push(`/explore?${newQueryParams.toString()}`);

    dispatch(thunkGetPostsByTags(updatedTags));
    setShowDropdown(false);
  };

  const handleUserClick = (userId) => {
    setSearchTerm("");
    setShowDropdown(false);
    history.push(`/posts/users/${userId}`);
  };

  const handleClear = (tag) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    const newQueryParams = new URLSearchParams();
    updatedTags.forEach((t) => newQueryParams.append("tags", t));
    history.push(`/explore?${newQueryParams.toString()}`);
    fetchData();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowDropdown(false);
      history.push(`/users/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="tag-search-container">
      {/* {searchTerm === "" && <i className="fas fa-search search-icon"></i>} */}
      <input
        type="text"
        className="tag-search-input"
        placeholder="Search tags or users..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      {showDropdown && (
        <div className="tag-search-dropdown">
          {searchResults.users.length > 0 && (
            <div className="dropdown-section-header">Users</div>
          )}
          {searchResults.users.map((user, index) => (
            <div
              key={index}
              className="user-search-item"
              onClick={() => handleUserClick(user.id)}
            >
              <img
                src={user.profile_picture || "/default-profile.png"}
                alt={`${user.first_name} ${user.last_name}`}
                className="user-profile-picture"
              />
              {highlightText(
                `${user.first_name} ${user.last_name}`,
                searchTerm
              )}
              (@{user.username})
            </div>
          ))}
          {searchResults.tags.length > 0 && (
            <div className="dropdown-section-header">Tags</div>
          )}
          {searchResults.tags.map((tag, index) => (
            <div
              key={index}
              className="tag-search-item"
              onClick={() => handleTagClick(tag)}
            >
              <i className="tag-icon fas fa-tag"></i>
              {highlightText(tag, searchTerm)}
            </div>
          ))}
        </div>
      )}

      <div className="tag-selected-container">
        {selectedTags.map((tag, index) => (
          <button
            key={index}
            className="tag-selected-button"
            onClick={() => handleClear(tag)}
          >
            {tag} <span>X</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
