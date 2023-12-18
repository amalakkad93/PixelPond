import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { thunkAddComment, thunkEditComment } from '../../../store/comments';
import './CommentForm.css';

export default function CommentForm({ postId, formType, commentId, onCommentPost }) {
  console.log("🚀 ~ file: index.js:8 ~ CommentForm ~ formType:", formType)
  const dispatch = useDispatch();
  const history = useHistory();

  const [content, setContent] = useState('');
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSubmitButtonDisabled(!(content.length >= 10));
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === 'Create') {
      dispatch(thunkAddComment(postId, content))
        .then(() => {
          console.log('Comment added, redirecting...');
          setContent('');
          history.push(`/posts/${postId}`);
          if (onCommentPost) {
            onCommentPost();
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.message) {
            setMessage(error.message);
          } else {
            setMessage('An unexpected error occurred.');
          }
        });
    } else if (formType === 'Edit') {
      dispatch(thunkEditComment(commentId, { content }))
        .then(() => {
          if (onCommentPost) {
            onCommentPost();
          }
        })
        .catch((error) => {
          console.error(error);
          if (error.message) {
            setMessage(error.message);
          } else {
            setMessage('An unexpected error occurred.');
          }
        });
    }
  };

  return (
    <div className="comment-form-container">
      <form onSubmit={handleSubmit} className="comment-form" id="form-comment">
        <h2 className="comment-form-h2">
          {formType === 'Create' ? 'Add a Comment' : 'Edit Comment'}
        </h2>
        <div>{message && <div className="error">{message}</div>}</div>
        <textarea
          className="comment-textarea"
          placeholder="Add a comment..."
          type="text"
          name="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {errors.comment && <div className="error">{errors.comment}</div>}
        <button
          className="comment-submit-button"
          id="submit-comment-btn"
          type="submit"
          disabled={submitButtonDisabled}
        >
          {formType === 'Create' ? 'Post Comment' : 'Update Comment'}
        </button>
      </form>
    </div>
  );

}
