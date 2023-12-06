import { useSelector, shallowEqual } from 'react-redux';
// =========================================================
//               ****Session UseSelectors****
// =========================================================

export const selectSessionUser = state => state?.session?.user;
export const selectUserId = selectSessionUser?.id;

// =========================================================
//               ****Post UseSelectors****
// =========================================================

// Select a single post by its ID
export const selectPostById = (state, postId) => state.posts.posts.byId[postId];
// Select all posts as an array
export const selectAllPosts = (state) => state.posts.posts.allIds.map((id) => state.posts.posts.byId[id]|| {}, shallowEqual);
export const selectOwnerPosts = (state) => state.posts.ownerPosts.allIds.map((id) => state.posts.ownerPosts.byId[id]|| {}, shallowEqual);
// Select all posts by ID as an object (normalized structure)
export const selectAllPostsById = ((state) => state.posts.posts.byId || {}, shallowEqual);

// =========================================================
//               ****Album UseSelectors****
// =========================================================

// =========================================================
//               ****Favorite UseSelectors****
// =========================================================

// =========================================================
//               ****Comment UseSelectors****
// =========================================================
