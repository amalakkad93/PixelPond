import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetPostComments } from "../../../store/comments";
import {
  selectPostComments,
  selectSessionUser,
} from "../../../store/selectors";
import CommentItem from "./CommentItem";
import OpenModalButton from "../../Modals/OpenModalButton";
import EditCommentForm from "../CommentForm/EditCommentForm";
import DeleteComment from "../DeleteComment";
import CreateCommentForm from "../CommentForm/CreateCommentForm";
import LoadMorePagination from "../../Pagination/LoadPaginations/LoadMorePagination";
import LoadPreviousPagination from "../../Pagination/LoadPaginations/LoadPreviousPagination";

import "./CommentsList.css";

const CommentsList = ({ postId }) => {
  const dispatch = useDispatch();
  const commentsRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const sessionUser = useSelector(selectSessionUser);
  const perPage = 10;

  const comments = useSelector((state) => selectPostComments(state, postId));

  const sortedComments = comments.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const fetchComments = (page) => {
    dispatch(thunkGetPostComments(postId, page, perPage))
      .then((response) => {
        if (response) {
          console.log("Response:", response);
          setCurrentPage(response.current_page);
          setTotalPages(response.total_pages);
          setTotalItems(response.total_items);
        } else {
          console.log("No response or error in fetching comments");
        }
      })
      .catch((err) => console.log("Error fetching comments:", err));
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage, postId]);

  return (
    <div className="comments-list">
      <LoadPreviousPagination
        className="load-previous-comments-btn"
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        totalItems={totalItems}
        onLoadPrevious={() => {
          if (currentPage > 1) {
            setCurrentPage((current) => current - 1);
          }
        }}
      />

      {/* comments */}
      {sortedComments.map((comment) => (
        <div key={comment.id}>
          {sessionUser && sessionUser.id === comment.user_id && (
            <div className="comment-actions">
              <i
                className="fas fa-ellipsis-h"
                onClick={() =>
                  setShowOptionsFor(
                    showOptionsFor === comment.id ? null : comment.id
                  )
                }
              ></i>
              {showOptionsFor === comment.id && (
                <div className="options-modal">
                  <OpenModalButton
                    className="edit-comment-button"
                    buttonText={
                      <i className="fas fa-edit" aria-hidden="true"></i>
                    }
                    modalComponent={
                      <EditCommentForm
                        commentId={comment.id}
                        postId={comment.post_id}
                        onCommentSuccess={() => {
                          fetchComments(1);
                          setShowOptionsFor(null);
                        }}
                      />
                    }
                  />
                  <OpenModalButton
                    className="delete-modal"
                    buttonText={
                      <i className="fas fa-trash" aria-hidden="true"></i>
                    }
                    modalComponent={
                      <DeleteComment
                        postId={postId}
                        commentId={comment.id}
                        onDelete={() => {
                          fetchComments(1);
                          setShowOptionsFor(null);
                        }}
                      />
                    }
                  />
                </div>
              )}
            </div>
          )}

          <CommentItem comment={comment} />
        </div>
      ))}
      <LoadMorePagination
        className="load-more-comments-btn"
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        totalItems={totalItems}
        onLoadMore={() => {
          if (currentPage < totalPages) {
            setCurrentPage((current) => current + 1);
          }
        }}
      />
      <CreateCommentForm
        postId={postId}
        onCommentSuccess={() => fetchComments(1)}
      />
    </div>
  );
};

export default CommentsList;
