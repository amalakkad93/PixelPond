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
export const selectAllPosts = (state) => state.posts?.allPosts?.allIds.map((id) => state.posts.allPosts.byId[id]|| {}, shallowEqual);
export const selectOwnerPosts = (state) => state.posts?.ownerPosts?.allIds.map((id) => state.posts.ownerPosts.byId[id]|| {}, shallowEqual);
// Select all posts by ID as an object (normalized structure)
export const selectAllPostsById = ((state) => state.posts?.allPosts?.byId || {}, shallowEqual);
// Select a single post
export const selectSinglePost = ((state) => state.posts.singlePost);

export const selectUserPosts = (state) => state.posts?.userPosts?.allIds.map((id) => state.posts.userPosts.byId[id] || [], shallowEqual);
// Selector to get profile picture from the first post in userPosts
export const selectFirstUserPostProfilePicture = (state) => {
  const firstPostId = state.posts.userPosts.allIds[0];
  return state.posts.userPosts.byId[firstPostId]?.profile_picture;
};



// =========================================================
//               ****Album UseSelectors****
// =========================================================
export const selectAlbumImages = (state) => {
  const { byId, allIds } = state.albums.singleAlbum;
  return allIds.map(id => byId[id]);
};
export const selectAllAlbums = (state) => {

  const { userAlbums } = state.albums;
  return userAlbums.allIds.map((id) => userAlbums.byId[id]);
};
export const selectAlbumUserInfo = (state) => state.albums.userInfo.user_info;





// =========================================================
//               ****Favorite UseSelectors****
// =========================================================

// =========================================================
//               ****Comment UseSelectors****
// =========================================================


// =========================================================
//               ****Paginations UseSelectors****
// =========================================================
export const selectCurrentPage = (state) => state.paginations.currentPage;
export const selectTotalPages = (state) => state.paginations.totalPages;
