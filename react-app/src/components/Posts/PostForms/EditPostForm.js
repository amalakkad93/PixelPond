import React from 'react';
import { useParams } from "react-router-dom";
import PostForm from './index.js';

export default function EditPostForm() {
  const { postId } = useParams();

  return (
      <PostForm
        formType="Edit"
        postId={postId}
      />
  );
}
