import React from 'react';
import CommentsList from '../CommentsList';
import CommentForm from '../CommentForm';

const CommentsSection = ({ postId }) => {
  return (
    <div className="comments-section">
      <CommentForm postId={postId} />
      <CommentsList postId={postId} />
    </div>
  );
};

export default CommentsSection;
