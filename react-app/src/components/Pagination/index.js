import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { actionSetCurrentPage } from '../../store/paginations';
import './Pagination.css';

const Pagination = ({ onPageChange, currentPage, totalPages, useRedux = false }) => {
  const dispatch = useDispatch();

  // Only use Redux state if useRedux is true
  const reduxCurrentPage = useSelector((state) => state.paginations.currentPage);
  const reduxTotalPages = useSelector((state) => state.paginations.totalPages);

  const effectiveCurrentPage = useRedux ? reduxCurrentPage : currentPage;
  const effectiveTotalPages = useRedux ? reduxTotalPages : totalPages;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= effectiveTotalPages) {
      if (useRedux) {
        dispatch(actionSetCurrentPage(newPage));
      }
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination-controls">
      <button
        onClick={() => handlePageChange(effectiveCurrentPage - 1)}
        disabled={effectiveCurrentPage === 1}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Previous
      </button>

      <span className="page-info">
        Page {effectiveCurrentPage} of {effectiveTotalPages}
      </span>

      <button
        onClick={() => handlePageChange(effectiveCurrentPage + 1)}
        disabled={effectiveCurrentPage === effectiveTotalPages}
      >
        Next
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default Pagination;
