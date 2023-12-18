import React from 'react';
import { useParams } from "react-router-dom";
import PostForm from './index.js';

export default function EditPostForm({ postId, fetchPostDetailData } ) {

  return (
      <PostForm
        formType="Edit"
        postId={postId}
        fetchPostDetailData={fetchPostDetailData}
      />
  );
}
