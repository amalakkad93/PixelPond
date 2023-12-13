import { shallowEqual } from 'react-redux';
// =========================================================
//               ****Ui UseSelectors****
// =========================================================


export const selectLoading = (state) => state.ui.loading;

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
// Select all posts by ID as an object
export const selectAllPostsById = ((state) => state.posts?.allPosts?.byId || {}, shallowEqual);
// Select a single post
export const selectSinglePost = ((state) => state.posts.singlePost);


export const selectUserPosts = (state) => {
  if (!state.posts.userPosts || !state.posts.userPosts.allIds) {
    return [];
  }

  return state.posts.userPosts.allIds.map((id) => state.posts.userPosts.byId[id], shallowEqual);
};


export const selectUserInfo= (state) => state.posts?.userInfo



export const selectNeighborPosts = (state) => {
  return state.posts.neighborPosts || { prevPostId: null, nextPostId: null };
};


export const selectUserPostBannerUrls = (state) => {
  return state.posts.userPosts.allIds.map((id) => state.posts.userPosts.byId[id]?.image);
};
export const selectUserPostImages = (state) => {
  return state.posts.userPosts.allIds.map((id) => state.posts.userPosts.byId[id]?.images);
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
  return userAlbums.allIds.map((id) => {
    const album = userAlbums.byId[id];

    // Reconstructing the album with its images
    const albumWithImages = {
      ...album,
      images: album.images.allIds.map(imageId => album.images.byId[imageId])
    };

    return albumWithImages;
  });
};

export const selectTotalAlbums = (state) => state.albums?.userAlbums?.allIds?.length;
export const selectAlbumUserInfo = (state) => state.albums?.albumInfo;

// =========================================================
//               ****Comment UseSelectors****
// =========================================================
export const selectPostComments = (state) => state.comments?.allCommentsOfPost?.allIds.map((id) => state.comments.allCommentsOfPost.byId[id]|| {}, shallowEqual);
// Selector to get comments for a specific post
export const selectPostComments1 = (state, postId) => {
  const comments = state.comments[postId];
  return comments ? comments.allIds.map(id => comments.byId[id]) : [];
};



// =========================================================
//               ****Favorite UseSelectors****
// =========================================================



// =========================================================
//               ****Paginations UseSelectors****
// =========================================================
export const selectCurrentPage = (state) => state.paginations.currentPage;
export const selectTotalPages = (state) => state.paginations.totalPages;
