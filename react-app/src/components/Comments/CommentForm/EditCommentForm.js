import React from 'react';
import { useParams } from "react-router-dom";
import CommentForm from './index.js';

export default function EditCommentForm(commentId, postId, onCommentSuccess) {
console.log("🚀 ~ file: EditCommentForm.js:6 ~ EditCommentForm ~ postId:", commentId.postId)
console.log("🚀 ~ file: EditCommentForm.js:6 ~ EditCommentForm ~ commentId:", commentId.commentId)


  return (
      <CommentForm
        formType="Edit"
        commentId={commentId.commentId}
        postId={commentId.postId}
        onCommentSuccess={onCommentSuccess}
      />
  );
}
