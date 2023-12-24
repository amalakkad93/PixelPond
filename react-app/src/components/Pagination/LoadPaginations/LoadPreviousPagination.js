import React, { useState, useEffect } from "react";

import "./LoadPreviousPagination.css";


const LoadPreviousPagination = ({
  currentPage,
  totalPages,
  perPage,
  totalItems,
  onLoadPrevious,

}) => {

  const [loading, setLoading] = useState(false);

  // const showLoadPreviousButton = currentPage > 1 || (totalItems > currentPage * perPage);
  const showLoadPreviousButton = currentPage > 1;

  useEffect(() => {
    if (currentPage > 1) {
      setLoading(false);
    }
  }, [currentPage, totalPages]);

  if (!showLoadPreviousButton) return null;
  return (
    <div className="load-more-pagination">
      {showLoadPreviousButton && (
        <button onClick={onLoadPrevious} className="load-previous-btn">
          {/* <i className="fa fa-chevron-up"></i> Load previous comments */}
          <i className="fa fa-chevron-up"></i> 
        </button>
      )}
    </div>
  );
};

export default LoadPreviousPagination;
