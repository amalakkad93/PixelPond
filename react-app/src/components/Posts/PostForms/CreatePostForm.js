import React from 'react';
import PostForm from './index';

export default function CreatePostForm({ onPostCreated, currentPage }) {
  return (
      <PostForm
          formType="Create"
          onPostCreated={onPostCreated}
          currentPage={currentPage}

      />
  );
}
