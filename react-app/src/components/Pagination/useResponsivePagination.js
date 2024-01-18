import { useState, useEffect, useCallback } from 'react';

const useResponsivePagination = (defaultPerPage = 10) => {
  const [perPage, setPerPage] = useState(defaultPerPage);

  const updatePerPage = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) {
      setPerPage(2);
    } else {
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
