/**
 * EditCommentForm Component
 *
 * This component is a specialized version of the CommentForm for editing existing comments.
 * It renders the CommentForm component with the 'formType' prop set to 'Edit'. This component
 * takes an object containing 'commentId' and 'postId' to edit a specific comment. It also
 * passes the 'onCommentSuccess' prop to the CommentForm, facilitating the editing process.
 *
 * @param {Object} commentId - Object containing 'commentId' and 'postId' of the comment to be edited.
 * @param {number} postId - The ID of the post associated with the comment (passed through the object).
 * @param {function} onCommentSuccess - Callback function executed after successful comment update.
 */
import React from 'react';
import CommentForm from './index.js';

export default function EditCommentForm(commentId, postId, onCommentSuccess) {

  return (
      <CommentForm
        formType="Edit"
        commentId={commentId.commentId}
        postId={commentId.postId}
        onCommentSuccess={onCommentSuccess}
      />
  );
}
