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

// import React, { useState, useEffect } from "react";

// import "./LoadMorePagination.css";

// const LoadMorePagination = ({
//   currentPage,
//   totalPages,
//   perPage,
//   totalItems,
//   onLoadMore,
//   onLoadPrevious,
//   commentsRef,
// }) => {
//   const [showScrollBottom, setShowScrollBottom] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const checkScroll = () => {
//     if (!commentsRef.current) {
//       return;
//     }
//     const { scrollTop } = commentsRef.current;
//     setShowScrollBottom(scrollTop > 200);

//     if (scrollTop === 0 && currentPage > 1 && !loading) {
//       setLoading(true);
//       onLoadMore();
//     }
//   };

//   useEffect(() => {
//     const refCurrent = commentsRef.current;
//     if (refCurrent) {
//       refCurrent.addEventListener("scroll", checkScroll);
//     }
//     return () => {
//       if (refCurrent) {
//         refCurrent.removeEventListener("scroll", checkScroll);
//       }
//     };
//   }, [commentsRef, currentPage, totalPages, loading]);

//   useEffect(() => {
//     if (currentPage > 1) {
//       setLoading(false);
//     }
//   }, [currentPage, totalPages]);

//   const scrollToBottom = () => {
//     if (commentsRef.current) {
//       commentsRef.current.scrollTo({
//         top: commentsRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };

//   // if (currentPage <= 1 && !showScrollBottom) return null;
//   // if (currentPage >= totalPages && !showScrollBottom) return null;

//   // const showLoadPreviousButton = currentPage > 1 || (totalItems > currentPage * perPage);
//   return (
//     <div className="load-more-pagination">
//       {currentPage < totalPages && !loading && (
//         <button onClick={onLoadMore}>
//           <i className="fa fa-comments"></i> Load more comments
//         </button>
//       )}

// {/*
//       { (currentPage > 1 || (totalItems > currentPage * perPage) ) && (
//         <button onClick={onLoadPrevious} className="load-previous-btn">
//           <i className="fa fa-chevron-up"></i> Load previous comments
//         </button>
//       )} */}

//       {showScrollBottom && (
//         <button onClick={scrollToBottom} className="scroll-to-bottom-btn">
//           <i className="fa fa-chevron-down"></i>
//         </button>
//       )}
//     </div>
//   );
// };

// export default LoadMorePagination;
