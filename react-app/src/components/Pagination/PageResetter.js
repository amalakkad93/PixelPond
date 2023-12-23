// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { setCurrentPagePost } from '../../store/posts';
// import { selectCurrentPage } from '../../store/selectors';

// const PageResetter = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const currentPage = useSelector(selectCurrentPage);
//   console.log("🚀 ~ file: PageResetter.js:12 ~ PageResetter ~ currentPage:", currentPage)

//   useEffect(() => {
//     if (currentPage !== 1) {
//       dispatch(setCurrentPagePost(1));
//     }
//   }, [dispatch, location.pathname, currentPage]);

//   return null;
// };

// export default PageResetter;
