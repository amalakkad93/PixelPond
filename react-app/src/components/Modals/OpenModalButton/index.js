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
    setModalContent(modalComponent);
    if (onModalClose) setOnModalClose(onModalClose);
    if (onButtonClick) onButtonClick();
  };

  return (
    <button className={`more-info-button ${className}`} onClick={onClick}>{buttonText}</button>
  );
}

export default OpenModalButton;
