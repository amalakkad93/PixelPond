import React from 'react';
import { useModal } from '../../../context/Modal';
import { useShortModal } from '../../../context/ModalShort';
import './OpenModalButton.css'

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // callback function that will be called once the button that opens the modal is clicked
  onModalClose, // callback function that will be called once the modal is closed
  useShortModal = false,
  sliding = false, // if true, the modal will slide in from the bottom
  className = '' // default to an empty string if no class is passed
}) {
  const { setModalContent, setIsShortModal, setOnModalClose } = useModal();

  const onClick = () => {
    // setIsShortModal(useShortModal);
    setModalContent(modalComponent);
    if (onModalClose) setOnModalClose(onModalClose);
    if (onButtonClick) onButtonClick();
  };

  return (
    <button className={`more-info-button ${className}`} onClick={onClick}>{buttonText}</button>
    // <button onClick={onClick}>{buttonText}</button>
  );
}

export default OpenModalButton;


// import React from 'react';
// import { useModal } from '../../context/Modal';

// function OpenModalButton({
//   modalComponent, // component to render inside the modal
//   buttonText, // text of the button that opens the modal
//   onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
//   onModalClose // optional: callback function that will be called once the modal is closed
// }) {
//   const { setModalContent, setOnModalClose } = useModal();

//   const onClick = () => {
//     if (onModalClose) setOnModalClose(onModalClose);
//     setModalContent(modalComponent);
//     if (onButtonClick) onButtonClick();
//   };

//   return (
//     <button onClick={onClick}>{buttonText}</button>
//   );
// }

// export default OpenModalButton;
