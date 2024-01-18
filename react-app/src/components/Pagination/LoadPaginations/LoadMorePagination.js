import React, { useState, useEffect } from "react";

import "./LoadMorePagination.css";

const LoadMorePagination = ({ currentPage, totalPages, onLoadMore }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentPage > 1) {
      setLoading(false);
    }
  }, [currentPage, totalPages]);

  if (currentPage >= totalPages) return null;

  return (
    <div className="load-more-pagination">
      {currentPage < totalPages && !loading && (
        <button onClick={onLoadMore}>
          <i className="fa fa-comments"></i> Load more comments
        </button>
      )}
    </div>
  );
};

export default LoadMorePagination;
