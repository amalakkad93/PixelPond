/**
 * CreateCommentForm Component
 *
 * This component is a specialized version of the CommentForm specifically for creating new comments.
 * It renders the CommentForm component with the 'formType' prop set to 'Create'. It is responsible
 * for passing down the 'postId' and 'onCommentSuccess' props to the CommentForm, allowing users to
 * add new comments to a post.
 *
 * @param {number} postId - The ID of the post to which the comment will be added.
 * @param {function} onCommentSuccess - Callback function executed after successful comment submission.
 */
import React from "react";
import CommentForm from "./index";

export default function CreateCommentForm({ postId, onCommentSuccess }) {
  return (
    <CommentForm
      formType="Create"
      postId={postId}
      onCommentSuccess={onCommentSuccess}
    />
  );
}
