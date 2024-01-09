import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStream,
  faImages,
  faCameraRetro,
  faUserCircle,
  faPhotoVideo,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import OpenModalButton from "../../Modals/OpenModalButton";
import CreatePostForm from "../../Posts/PostForms/CreatePostForm";
import { thunkGetPostsByUserId } from "../../../store/posts";
import { selectSessionUser, selectCurrentPage } from "../../../store/selectors";
import "./PopupsModal.css";

export default function PopupsModal({ showModal, onClose }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const modalRef = useRef();
  const currentPage = useSelector(selectCurrentPage);
  const sessionUser = useSelector(selectSessionUser);
  const userId = sessionUser?.id;

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, onClose]);

  if (!showModal) return null;

  return (
    <>
      <div className={`modal-pop ${showModal ? "show" : ""}`}>
        <div className="modal-pop-content" ref={modalRef}>
          <div className="modal-pop-body">
            <button
              className="btn-photo-stream"
              onClick={() => {
                history.push(`/user/profile`);
                // setModalVisible(false);
                onClose();
              }}
            >

              <FontAwesomeIcon icon={faUserCircle} />
              <span>My Profile</span>
            </button>

            <button
              className="btn-photo-stream"
              onClick={() => {
                history.push(`/owner/photostream`);
                // setModalVisible(false);
                onClose();
              }}
            >
              {/* <FontAwesomeIcon icon={faStream} /> */}
              <FontAwesomeIcon icon={faImages} />
              <span>My PhotoStream</span>
            </button>

            <button
              onClick={() => {
                history.push(`/albums/users/${userId}`);
                // setModalVisible(false);
                onClose();
              }}
              className="btn-albums"
            >
              <FontAwesomeIcon icon={faPhotoVideo} />
              <span>My Albums</span>
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
