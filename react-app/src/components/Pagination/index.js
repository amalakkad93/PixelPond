import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import './Pagination.css';

  const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, disableNext, disablePrevious }) => {
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
        disabled={disablePrevious}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="pagination-icon" />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        disabled={disableNext}
      >
        <FontAwesomeIcon icon={faChevronRight} className="pagination-icon" />
      </button>
    </div>
  );
};
export default Pagination;
