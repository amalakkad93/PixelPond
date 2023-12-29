/**
 * TagSearch Component
 *
 * This component is responsible for handling the tag-based search functionality.
 * It allows users to search for tags, select a tag from the dropdown, and
 * also see the currently selected tag. Users can clear the selected tag to
 * revert to viewing all posts.
 *
 * @param {function} onTagSelected - Function to handle when a tag is selected.
 * @param {Array} allTags - Array of all available tags for searching.
 * @param {string} selectedTag - The currently selected tag.
 * @param {function} onClearTag - Function to clear the selected tag.
 */
import React, { useState } from "react";
import "./TagSearch.css";

const TagSearch = ({ onTagSelected, allTags, selectedTag, selectedTags, onClearTag }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Handles changes in the search input field.
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(term.trim().length > 0);

    if (e.key === "Enter" && term.trim()) {
      handleTagClick(term);
    }
  };

  // Handles the event when a tag is clicked from the dropdown.
  const handleTagClick = (tag) => {
    onTagSelected(tag);
    setSearchTerm("");
    setShowDropdown(false);
  };

  // Filters tags based on the search term entered by the user.
  const filteredTags = searchTerm.trim() && Array.isArray(allTags)
    ? allTags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="tag-search-container">
      <input
        type="text"
        className="tag-search-input"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleSearchChange}
      />
      {showDropdown && filteredTags.length > 0 && (
        <div className="tag-search-dropdown">
          {filteredTags.map((tag, index) => (
            <div
              key={index}
              className="tag-search-item"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
     {selectedTags.map((tag, index) => (
        <button key={index} className="tag-selected-button" onClick={() => onTagSelected(tag)}>
          {tag} <span>X</span>
        </button>
      ))}
    </div>
  );
};

export default TagSearch;
// const TagSearch = ({ onTagSelected, allTags, selectedTag, onClearTag }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Handles changes in the search input field.
//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     setShowDropdown(term.trim().length > 0);

//     if (e.key === "Enter" && term.trim()) {
//       handleTagClick(term);
//     }
//   };

//   // Handles the event when a tag is clicked from the dropdown.
//   const handleTagClick = (tag) => {
//     onTagSelected(tag);
//     setSearchTerm("");
//     setShowDropdown(false);
//   };

//   // Filters tags based on the search term entered by the user.
//   const filteredTags = searchTerm.trim() && Array.isArray(allTags)
//     ? allTags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//     : [];

//   return (
//     <div className="tag-search-container">
//       <input
//         type="text"
//         className="tag-search-input"
//         placeholder="Search tags..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//         onKeyDown={handleSearchChange}
//       />
//       {showDropdown && filteredTags.length > 0 && (
//         <div className="tag-search-dropdown">
//           {filteredTags.map((tag, index) => (
//             <div
//               key={index}
//               className="tag-search-item"
//               onClick={() => handleTagClick(tag)}
//             >
//               {tag}
//             </div>
//           ))}
//         </div>
//       )}
//       {selectedTag && (
//         <button className="tag-selected-button" onClick={onClearTag}>
//           {selectedTag} <span>X</span>
//         </button>
//       )}
//     </div>
//   );
// };

// export default TagSearch;
