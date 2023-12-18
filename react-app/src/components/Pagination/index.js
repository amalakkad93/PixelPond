import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import './Pagination.css';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          // className={i === currentPage ? 'active' : ''}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="pagination-icon" />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
      >
        {/* <FontAwesomeIcon icon={faArrowRight} className="pagination-icon" /> */}
        <FontAwesomeIcon icon={faChevronRight} className="pagination-icon" />
      </button>
      
    </div>
  );
};

// Pagination.propTypes = {
//   totalItems: PropTypes.number.isRequired,
//   itemsPerPage: PropTypes.number.isRequired,
//   currentPage: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };

export default Pagination;

// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import { actionSetCurrentPage } from '../../store/paginations';
// import './Pagination.css';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const goToPage = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       onPageChange(newPage);
//     }
//   };

//   return (
//     <div className="pagination-controls">
//       <button
//         onClick={() => goToPage(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         <FontAwesomeIcon icon={faArrowLeft} />
//         Previous
//       </button>

//       <span className="page-info">
//         Page {currentPage} of {totalPages}
//       </span>

//       <button
//         onClick={() => goToPage(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         Next
//         <FontAwesomeIcon icon={faArrowRight} />
//       </button>
//     </div>
//   );
// };

// export default Pagination;

// const Pagination = ({ onPageChange, currentPage, totalPages, useRedux = false }) => {
//   const dispatch = useDispatch();

//   // Only use Redux state if useRedux is true
//   const reduxCurrentPage = useSelector((state) => state.paginations.currentPage);
//   const reduxTotalPages = useSelector((state) => state.paginations.totalPages);

//   const effectiveCurrentPage = useRedux ? reduxCurrentPage : currentPage;
//   const effectiveTotalPages = useRedux ? reduxTotalPages : totalPages;

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= effectiveTotalPages) {
//       if (useRedux) {
//         dispatch(actionSetCurrentPage(newPage));
//       }
//       onPageChange(newPage);
//     }
//   };

//   return (
//     <div className="pagination-controls">
//       <button
//         onClick={() => handlePageChange(effectiveCurrentPage - 1)}
//         disabled={effectiveCurrentPage === 1}
//       >
//         <FontAwesomeIcon icon={faArrowLeft} />
//         Previous
//       </button>

//       <span className="page-info">
//         Page {effectiveCurrentPage} of {effectiveTotalPages}
//       </span>

//       <button
//         onClick={() => handlePageChange(effectiveCurrentPage + 1)}
//         disabled={effectiveCurrentPage === effectiveTotalPages}
//       >
//         Next
//         <FontAwesomeIcon icon={faArrowRight} />
//       </button>
//     </div>
//   );
// };

// export default Pagination;
