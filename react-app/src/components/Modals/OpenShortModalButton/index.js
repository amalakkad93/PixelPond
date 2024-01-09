import React from 'react';
import { useShortModal } from '../../../context/ModalShort';
import './OpenShortModalButton.css'

function OpenShortModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // callback function that will be called once the button that opens the modal is clicked
  onModalShortClose, // callback function that will be called once the modal is closed
  className = '' // default to an empty string if no class is passed
}) {
  const {  setShortModalContent, setOnShortModalClose } = useShortModal();

  const onClick = () => {
    // setIsShortModal(useShortModal);
    setShortModalContent(modalComponent);
    if (onModalShortClose) setOnShortModalClose(onModalShortClose);
    if (onButtonClick) onButtonClick();
  };

  return (
    <button className={`short-modal-more-info-button ${className}`} onClick={onClick}>{buttonText}</button>
    // <button onClick={onClick}>{buttonText}</button>
  );
}

export default OpenShortModalButton;
