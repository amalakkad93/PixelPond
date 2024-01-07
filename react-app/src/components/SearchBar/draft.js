// import React, { useState, useEffect } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLoading } from "../../store/ui";
// import { thunkGetPostsByTags } from "../../store/tags";
// import { thunkGetAllPosts } from "../../store/posts";
// import { thunkSearchUsers } from "../../store/session";
// import useResponsivePagination from "../Pagination/useResponsivePagination";
// import { highlightText } from "../../assets/helpers/helpers";
// import "./SearchBar.css";

// const debounce = (func, delay) => {
//   let debounceTimer;
//   return function () {
//     const context = this;
//     const args = arguments;
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => func.apply(context, args), delay);
//   };
// };

// const SearchBar = ({ allTags, onTagSelected, onTagClear }) => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const location = useLocation();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTags, setSelectedTags] = useState([]);
//   // const [searchResults, setSearchResults] = useState([]);
//   const [isUserSearch, setIsUserSearch] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const perPage = useResponsivePagination(10);
//   const [searchResults, setSearchResults] = useState({ users: [], tags: [] });

//   const fetchData = async () => {
//     if (selectedTags.length > 0) {
//       // If there are selected tags, fetch posts that contain all these tags
//       dispatch(thunkGetPostsByTags(selectedTags, currentPage, perPage));
//     } else {
//       // If no tags are selected, fetch all posts
//       dispatch(thunkGetAllPosts(currentPage, perPage));
//     }
//   };

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const tagsArray = queryParams.getAll("tags");
//     setSelectedTags(tagsArray);
//   }, [location.search]);

//   useEffect(() => {
//     fetchData();
//   }, [selectedTags, currentPage, perPage]);

//   const handleSearch = async (searchTerm) => {
//     setShowDropdown(searchTerm.trim().length > 0);

//     if (searchTerm.length > 0) {
//       const userResults = (await dispatch(thunkSearchUsers(searchTerm))) ?? [];
//       const filteredTags = Array.isArray(allTags)
//         ? allTags.filter((tag) =>
//             tag.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         : [];

//       setSearchResults({
//         users: userResults,
//         tags: filteredTags,
//       });
//       if (isUserSearch) {
//         history.push(`/users/search?search=${encodeURIComponent(searchTerm)}`);
//       }
//     } else {
//       setSearchResults({ users: [], tags: [] });
//     }
//   };

//   const debouncedHandleSearch = debounce(handleSearch, 300);

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedHandleSearch(term);

//     history.push(`?search=${encodeURIComponent(term)}`);
//   };

//   const handleTagClick = (tag) => {
//     const updatedTags = selectedTags.includes(tag)
//       ? selectedTags.filter((t) => t !== tag)
//       : [...selectedTags, tag];
//     setSelectedTags(updatedTags);
//     setSearchTerm("");
//     setShowDropdown(false);
//     const newQueryParams = new URLSearchParams();
//     updatedTags.forEach((t) => newQueryParams.append("tags", t));
//     history.push(`/explore?${newQueryParams.toString()}`);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       setShowDropdown(false);
//       history.push(`/users/search?search=${encodeURIComponent(searchTerm)}`);
//     }
//   };
// const handleUserClick = (userId) => {
//   setSearchTerm("");
//   setShowDropdown(false);
//   history.push(`/posts/users/${userId}`);
// };
// const handleClear = (tag) => {
//   const updatedTags = selectedTags.filter((t) => t !== tag);
//   setSelectedTags(updatedTags);
//   const newQueryParams = new URLSearchParams();
//   updatedTags.forEach((t) => newQueryParams.append("tags", t));
//   history.push(`/explore?${newQueryParams.toString()}`);
//   fetchData();
// };

//   return (
//     <div className="tag-search-container">
//       {/* {searchTerm === "" && <i className="fas fa-search search-icon"></i>} */}
//       <input
//         type="text"
//         className="tag-search-input"
//         placeholder="Search tags or users..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         onKeyDown={handleKeyDown}
//       />
//       {showDropdown && (
//         <div className="tag-search-dropdown">
//           {searchResults.users.length > 0 && (
//             <div className="dropdown-section-header">Users</div>
//           )}
//           {searchResults.users.map((user, index) => (
//             <div
//               key={index}
//               className="user-search-item"
//               onClick={() => handleUserClick(user.id)}
//             >
//               <img
//                 src={user.profile_picture || "/default-profile.png"}
//                 alt={`${user.first_name} ${user.last_name}`}
//                 className="user-profile-picture"
//               />
//               {highlightText(
//                 `${user.first_name} ${user.last_name}`,
//                 searchTerm
//               )}
//               (@{user.username})
//             </div>
//           ))}
//           {searchResults.tags.length > 0 && (
//             <div className="dropdown-section-header">Tags</div>
//           )}
//           {searchResults.tags.map((tag, index) => (
//             <div
//               key={index}
//               className="tag-search-item"
//               onClick={() => handleTagClick(tag)}
//             >
//               <i className="tag-icon fas fa-tag"></i>
//               {highlightText(tag, searchTerm)}
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="tag-selected-container">
//         {selectedTags.map((tag, index) => (
//           <button
//             key={index}
//             className="tag-selected-button"
//             onClick={() => handleClear(tag)}
//           >
//             {tag} <span>X</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SearchBar;





// import React, { useState, useEffect } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLoading } from "../../store/ui";
// import { thunkGetPostsByTags } from "../../store/tags";
// import { thunkGetAllPosts } from "../../store/posts";
// import { thunkSearchUsers } from "../../store/session";
// import useResponsivePagination from "../Pagination/useResponsivePagination";
// import "./SearchBar.css";

// const debounce = (func, delay) => {
//   let debounceTimer;
//   return function () {
//     const context = this;
//     const args = arguments;
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => func.apply(context, args), delay);
//   };
// };

// const SearchBar = ({ allTags, onTagSelected, onTagClear }) => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const location = useLocation();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTags, setSelectedTags] = useState([]);
//   // const [searchResults, setSearchResults] = useState([]);
//   const [isUserSearch, setIsUserSearch] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const perPage = useResponsivePagination(10);
//   const [searchResults, setSearchResults] = useState({ users: [], tags: [] });

// const fetchData = async () => {
//   if (selectedTags.length > 0) {
//     // If there are selected tags, fetch posts that contain all these tags
//     dispatch(thunkGetPostsByTags(selectedTags, currentPage, perPage));
//   } else {
//     // If no tags are selected, fetch all posts
//     dispatch(thunkGetAllPosts(currentPage, perPage));
//   }
// };

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const tagsArray = queryParams.getAll("tags");
//     setSelectedTags(tagsArray);
//   }, [location.search]);

// useEffect(() => {
//   fetchData();
// }, [selectedTags, currentPage, perPage]);

//   const handleSearch = async (searchTerm) => {
//     setShowDropdown(searchTerm.trim().length > 0);

//     if (searchTerm.length > 0) {
//       const userResults = (await dispatch(thunkSearchUsers(searchTerm))) ?? [];
//       const filteredTags = Array.isArray(allTags)
//         ? allTags.filter((tag) =>
//             tag.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//         : [];

//       setSearchResults({
//         users: userResults,
//         tags: filteredTags,
//       });
//     } else {
//       setSearchResults({ users: [], tags: [] });
//     }
//   };

//   const debouncedHandleSearch = debounce(handleSearch, 300);

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     debouncedHandleSearch(term);
//   };

//   const handleTagClick = (tag) => {
//     const updatedTags = selectedTags.includes(tag)
//       ? selectedTags.filter((t) => t !== tag)
//       : [...selectedTags, tag];
//     setSelectedTags(updatedTags);
//     setSearchTerm("");
//     setShowDropdown(false);
//     const newQueryParams = new URLSearchParams();
//     updatedTags.forEach((t) => newQueryParams.append("tags", t));
//     history.push(`/explore?${newQueryParams.toString()}`);
//   };

//   const handleUserClick = (userId) => {
//     setSearchTerm("");
//     setShowDropdown(false);

//     history.push(`/user-profile/${userId}`);
//   };

// const handleClear = (tag) => {
//   const updatedTags = selectedTags.filter((t) => t !== tag);
//   setSelectedTags(updatedTags);
//   // Update URL
//   const newQueryParams = new URLSearchParams();
//   updatedTags.forEach((t) => newQueryParams.append("tags", t));
//   history.push(`/explore?${newQueryParams.toString()}`);
//   fetchData();
// };

//   // Filters tags based on the search term
//   const filteredTags =
//     searchTerm.trim() && Array.isArray(allTags)
//       ? allTags.filter((tag) =>
//           tag.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       : [];

//   return (
//     <div className="tag-search-container">
//       <input
//         type="text"
//         className="tag-search-input"
//         placeholder="Search tags or users..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         onKeyDown={(e) => e.key === "Enter" && handleSearchChange(e)}
//       />
//       {showDropdown && (
//         <div className="tag-search-dropdown">
//           {searchResults.users.map((user, index) => (
//             <div
//               key={index}
//               className="search-result-item"
//               onClick={() => handleUserClick(user.id)}
//             >
//               {user.first_name} {user.last_name} (@{user.username})
//             </div>
//           ))}
//           {searchResults.tags.map((tag, index) => (
//             <div
//               key={index}
//               className="search-item"
//               onClick={() => handleTagClick(tag)}
//             >
//               {tag}
//             </div>
//           ))}
//         </div>
//       )}
//       {selectedTags.map((tag, index) => (
//         <button
//           key={index}
//           className="tag-selected-button"
//           onClick={() => handleClear(tag)}
//         >
//           {tag} <span>X</span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default SearchBar;
