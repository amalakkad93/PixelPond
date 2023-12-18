import React from 'react';
import { useSelector } from 'react-redux';
import { selectPostComments } from '../../../store/selectors';
import CommentItem from './CommentItem';
import "./CommentsList.css";

const CommentsList = ({ postId }) => {
  const comments = useSelector(state => selectPostComments(state, postId));
  const sortedComments = comments.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="comments-list">
      {sortedComments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentsList;
