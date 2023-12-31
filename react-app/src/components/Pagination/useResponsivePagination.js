// useResponsivePagination.js
import { useState, useEffect, useCallback } from 'react';

const useResponsivePagination = (defaultPerPage = 10) => {
  const [perPage, setPerPage] = useState(defaultPerPage);

  const updatePerPage = useCallback(() => {
    const screenWidth = window.innerWidth;
    console.log("Screen width: ", screenWidth); // Debugging line
    if (screenWidth < 600) {
      console.log("Setting perPage to 2"); // Debugging line
      setPerPage(2);
    } else {
      console.log("Setting perPage to default: ", defaultPerPage); // Debugging line
      setPerPage(defaultPerPage);
    }
  }, [defaultPerPage]);

  useEffect(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, [updatePerPage]);

  return perPage;
};

export default useResponsivePagination;

