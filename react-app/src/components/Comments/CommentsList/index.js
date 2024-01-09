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

import "./CommentItem.css";

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
    if (page < 1) {
      console.log("Invalid page number");
      return;
    }

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
    if (totalItems > 0 || currentPage === 1) {
      fetchComments(currentPage);
    }
  }, [currentPage, postId, totalItems]);

  useEffect(() => {
    setCurrentPage(1);
    if (totalItems > 0 || currentPage === 1) {
      fetchComments(1);
    }
  }, [postId]);


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
        <CommentItem
          key={comment.id}
          comment={comment}
          sessionUser={sessionUser}
          showOptionsFor={showOptionsFor}
          setShowOptionsFor={setShowOptionsFor}
          fetchComments={fetchComments}
          postId={postId}
        />
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
      {sessionUser && (
        <div className="create-comment-form">
        <CreateCommentForm
          postId={postId}
          onCommentSuccess={() => fetchComments(1)}
        />
      </div>
      )}
    </div>
  );
};

export default CommentsList;
