import React from 'react';
import CommentForm from './index';

export default function CreateCommentForm({ postId, onCommentSuccess }) {


  return (
    <CommentForm
      formType="Create"
      postId={postId}
      onCommentSuccess={onCommentSuccess}
    />
  );
}


// export default function CreateCommentForm({ postId, onCommentSuccess }) {
//   return (
//       <CommentForm
//           formType="Create"
//           postId={postId}
//           onCommentSuccess={onCommentSuccess}
//       />
//   );
// }
