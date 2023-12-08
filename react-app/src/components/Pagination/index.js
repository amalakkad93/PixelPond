import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { actionSetCurrentPage } from '../../store/paginations';

import './Pagination.css';

const Pagination = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.paginations.currentPage);
  const totalPages = useSelector((state) => state.paginations.totalPages);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(actionSetCurrentPage(newPage));
    }
  };

  return (
    <div className="pagination-controls">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default Pagination;
