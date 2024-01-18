import React, { useRef, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ShortModal.css'

const ShortModalContext = React.createContext();

export function ShortModalProvider({ children }) {
  const modalRef = useRef();
  const [shortmodalContent, setShortModalContent] = useState(null);
  const [isShortModal, setIsShortModal] = useState(false);
  // callback function that will be called when modal is closing
  const [onModalShortClose, setOnShortModalClose] = useState(null);

  const closeShortModal = () => {
    setShortModalContent(null); // clear the modal contents
    // If callback function is truthy, call the callback function and reset it
    // to null:
    if (typeof onModalClose === 'function') {
      setOnShortModalClose(null);
      onModalShortClose();
    }
  };

  const contextValue = {
    modalRef, // reference to modal div
    shortmodalContent, // React component to render inside modal
    setShortModalContent, // function to set the React component to render inside modal
    setOnShortModalClose, // function to set the callback function called when modal is closing
    setIsShortModal,
    closeShortModal // function to close the modal
  };

  return (
    <>
      <ShortModalContext.Provider value={contextValue}>
        {children}
      </ShortModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}


export function ShortModal({ className }) {

  const { modalRef, shortmodalContent, closeShortModal } = useContext(ShortModalContext);
  // If there is no div referenced by the modalRef or modalContent is not a
  // truthy value, render nothing:
  if (!modalRef || !modalRef.current || !shortmodalContent) return null;

//   Render the following component to the div referenced by the modalRef
  return ReactDOM.createPortal(
    <div id="short-modal" className={className}>
      <div id="short-modal-background" onClick={closeShortModal} />
      <div id="short-modal-content" className={className}>
        {shortmodalContent}
      </div>
    </div>,
    modalRef.current
  );
}


export const useShortModal = () => useContext(ShortModalContext);
