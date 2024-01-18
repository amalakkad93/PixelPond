/**
 * CommentsList Component
 *
 * This component is responsible for displaying a list of comments for a specific post. It handles
 * fetching comments from the server and manages pagination. The component sorts comments by their
 * creation date and allows users to load previous or more comments. It integrates with the Redux
 * store for state management and dispatching actions. Additionally, the component provides a form
 * for creating new comments.
 *
 * @param {number} postId - The ID of the post for which the comments are being displayed.
 */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { thunkGetPostComments } from "../../../store/comments";
import {
  selectPostComments,
  selectSessionUser,
} from "../../../store/selectors";
import CommentItem from "./CommentItem";
import CreateCommentForm from "../CommentForm/CreateCommentForm";
import LoadMorePagination from "../../Pagination/LoadPaginations/LoadMorePagination";
import LoadPreviousPagination from "../../Pagination/LoadPaginations/LoadPreviousPagination";

import "./CommentItem.css";

const CommentsList = ({ postId }) => {
  // Setup of hooks and state management variables
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const sessionUser = useSelector(selectSessionUser);
  const perPage = 10;

  const comments = useSelector((state) => selectPostComments(state, postId));

  // Sorting comments by creation date in descending order
  // This ensures that the most recent comments are displayed first
  const sortedComments = comments.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Function to fetch comments
  const fetchComments = (page) => {
    if (page < 1) {
      console.log("Invalid page number");
      return;
    }

    dispatch(thunkGetPostComments(postId, page, perPage))
      .then((response) => {
        if (response) {
          setCurrentPage(response.current_page);
          setTotalPages(response.total_pages);
          setTotalItems(response.total_items);
        } else {
          console.log("No response or error in fetching comments");
        }
      })
      .catch((err) => console.log("Error fetching comments:", err));
  };

  // useEffect hooks for initial fetch and re-fetch based on dependencies
  useEffect(() => {
    // ... useEffect implementation for fetching comments on current page change ...
    if (totalItems > 0 || currentPage === 1) {
      fetchComments(currentPage);
    }
  }, [currentPage, postId, totalItems]);

  useEffect(() => {
    // ... useEffect implementation for fetching comments on postId change ...
    setCurrentPage(1);
    if (totalItems > 0 || currentPage === 1) {
      fetchComments(1);
    }
  }, [postId]);

  return (
    <div className="comments-list">
      {/* Load previous comments pagination */}
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

      {/* Rendering each comment using CommentItem component */}
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment?.id}
          comment={comment}
          sessionUser={sessionUser}
          showOptionsFor={showOptionsFor}
          setShowOptionsFor={setShowOptionsFor}
          fetchComments={fetchComments}
          postId={postId}
        />
      ))}
      {/* Load more comments pagination */}
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
      {/* CreateCommentForm for adding new comments */}
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
