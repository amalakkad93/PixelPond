import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetUserPostsNotInAlbum } from '../../../store/posts';
import { selectSessionUser } from '../../../store/selectors';
import PostItem from './PostItem';

export default function UnassignedPostsPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectSessionUser);
  const [unassignedPosts, setUnassignedPosts] = useState([]);

  useEffect(() => {
    const fetchUnassignedPosts = async () => {
      if (sessionUser) {
        const posts = await dispatch(thunkGetUserPostsNotInAlbum(sessionUser.id));
        setUnassignedPosts(posts);
      }
    };
    fetchUnassignedPosts();
  }, [dispatch, sessionUser]);

  return (
    <div>
      <h2>Your Posts Not in Albums</h2>
      <div>
        {unassignedPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
