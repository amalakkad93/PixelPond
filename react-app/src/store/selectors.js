import { shallowEqual } from 'react-redux';
// =========================================================
//               ****Session UseSelectors****
// =========================================================

export const selectSessionUser = state => state?.session?.user;
export const selectUserId = selectSessionUser?.id;

// =========================================================
//               ****Post UseSelectors****
// =========================================================

// Select all posts as an array
export const selectAllPosts = (state) => state.posts?.AllPosts?.allIds.map((id) => state.posts.AllPosts.byId[id]|| {}, shallowEqual);
export const selectOwnerPosts = (state) => state.posts?.ownerPosts?.allIds.map((id) => state.posts.ownerPosts.byId[id]|| {}, shallowEqual);
// Select all posts by ID as an object (normalized structure)
export const selectAllPostsById = ((state) => state.posts?.AllPosts?.byId || {}, shallowEqual);
// Select a single post
export const selectSinglePost = ((state) => state.posts.singlePost);


// =========================================================
//               ****Album UseSelectors****
// =========================================================

// =========================================================
//               ****Favorite UseSelectors****
// =========================================================

// =========================================================
//               ****Comment UseSelectors****
// =========================================================
