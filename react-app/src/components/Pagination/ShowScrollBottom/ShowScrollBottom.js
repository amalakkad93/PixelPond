import React, { useState, useEffect } from 'react';
import './ShowScrollBottom.css';

const ShowScrollBottom = ({ commentsRef }) => {
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const checkScroll = () => {
    if (!commentsRef.current) {
      return;
    }
    const { scrollTop } = commentsRef.current;
    setShowScrollBottom(scrollTop > 200);
  };

  useEffect(() => {
    const refCurrent = commentsRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", checkScroll);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", checkScroll);
      }
    };
  }, [commentsRef]);

  const scrollToBottom = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollTo({
        top: commentsRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!showScrollBottom) return null;

  return (
    <button onClick={scrollToBottom} className="scroll-to-bottom-btn">
      <i className="fa fa-chevron-down"></i>
    </button>
  );
};

export default ShowScrollBottom;
