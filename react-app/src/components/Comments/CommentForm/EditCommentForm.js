import React from 'react';
import { useParams } from "react-router-dom";
import CommentForm from './index.js';

export default function EditCommentForm() {
  const { commentId, postId } = useParams();

  return (
      <CommentForm
        formType="Edit"
        commentId={commentId}
        postId={postId}
      />
  );
}
