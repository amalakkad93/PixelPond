import React from 'react';
import CommentForm from './index';

export default function CreateCommentForm({ postId }) {
  return (
      <CommentForm
          formType="Create"
          postId={postId}
      />
  );
}
