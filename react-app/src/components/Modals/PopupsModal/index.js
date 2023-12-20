import React, { useState } from "react";
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

  const currentPage = useSelector(selectCurrentPage);
  const sessionUser = useSelector(selectSessionUser);
  const userId = sessionUser?.id;

  if (!showModal) return null;

  return (
    <>
      <div className={`modal ${showModal ? "show" : ""}`}>
        <div className="modal-content">
          <div className="modal-body">
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
              <span>PhotoStream</span>
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
              <span>Albums</span>
            </button>

            {/* Additional button with the faCameraRetro icon */}
            <button className="btn-explore">
              <FontAwesomeIcon icon={faCameraRetro} />
              <span>Explore</span>
            </button>
            <OpenModalButton
              className="btn-create-post"
              buttonText={
                <>
                  <FontAwesomeIcon icon={faPlusSquare} />
                  <span className="btn-create-post-span">Create a Post</span>
                </>
              }
              modalComponent={
                <CreatePostForm
                  // onPostCreated={() =>
                  //   dispatch(
                  //     thunkGetPostsByUserId(sessionUser.id, currentPage, 10)
                  //   )
                  // }
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
