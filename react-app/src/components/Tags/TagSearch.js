// TagSearch.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllTags } from "../../store/posts";
import {selectAllTags} from '../../store/selectors';
import "./TagSearch.css";

const TagSearch = ({ onTagSelected, allTags }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(term.trim().length > 0);
  };

  const handleTagClick = (tag) => {
    onTagSelected(tag); // Directly use the tag string here
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Filter tags based on the search term
  const filteredTags = searchTerm.trim() && Array.isArray(allTags)
    ? allTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="tag-search-container">
      <input
        type="text"
        className="tag-search-input"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {showDropdown && filteredTags.length > 0 && (
        <div className="tag-search-dropdown">
          {filteredTags.map((tag, index) => (
            <div key={index} className="tag-search-item" onClick={() => handleTagClick(tag)}>
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSearch;
// const TagSearch = ({ onTagSelected, allTags }) => {
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredTags, setFilteredTags] = useState([]);
//   // const allTags = useSelector(selectAllTags);
//   useEffect(() => {
//     dispatch(thunkGetAllTags());
//   }, [dispatch]);

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     setFilteredTags(term.trim() ? allTags.filter(tag => tag.toLowerCase().startsWith(term.toLowerCase())) : []);
//   };

//   return (
//     <div className="tag-search-container">
//       <input
//         type="text"
//         className="tag-search-input"
//         placeholder="Search tags..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       {filteredTags.length > 0 && (
//         <div className="tag-search-dropdown">
//           {filteredTags.map((tag, index) => (
//             <div key={index} className="tag-search-item" onClick={() => onTagSelected(tag)}>
//               {tag}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TagSearch;
