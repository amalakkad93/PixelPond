import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStream, faImages, faCameraRetro, faUserCircle,  faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import "./PopupsModal.css";

export default function PopupsModal({ showModal, onClose }) {

  const history = useHistory();

  const handlePhotoStream = () => {
    history.push('/owner/photostream');
    // setModalVisible(false);
    onClose();
  };

  const handleAlbum = () => {
    history.push('/owner/albums');
    // setModalVisible(false);
    onClose();
  };

  if (!showModal) return null;


  return (
    <>
     <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-body">
          <button onClick={handlePhotoStream} className="btn-photo-stream">
              {/* <FontAwesomeIcon icon={faStream} /> */}
              <FontAwesomeIcon icon={faImages} />
              <span>PhotoStream</span>
            </button>

            <button onClick={handleAlbum} className="btn-albums">

              <FontAwesomeIcon icon={faPhotoVideo} />
              <span>Albums</span>
            </button>

            {/* Additional button with the faCameraRetro icon */}
            <button className="btn-explore">
              <FontAwesomeIcon icon={faCameraRetro} />
              <span>Explore</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
