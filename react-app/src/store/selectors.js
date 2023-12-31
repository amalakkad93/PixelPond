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
export const selectUserById = state => state.session.usersById


// =========================================================
//               ****Post UseSelectors****
// =========================================================

// Select all posts as an array
// export const selectAllPosts = (state) => state.posts?.allPosts?.allIds.map((id) => state.posts.allPosts.byId[id]|| {});
export const selectAllPosts = (state) => {
  const posts = state.posts?.allPosts?.allIds.map((id) => state.posts.allPosts.byId[id] || {});
  const ownerIds = [...new Set(posts.map(post => post.owner_id))];
  return { posts, ownerIds };
};

export const selectAllPostsImages = (state) => {
  return state.posts.allPosts.allIds.map(postId => {
    const post = state.posts.allPosts?.byId?.[postId];
    return {
      post_id: post.id,
      image_url: post.image_url
    };
  });
};



export const selectOwnerPosts = (state) => state.posts?.ownerPosts?.allIds.map((id) => state.posts.ownerPosts.byId[id]|| {});
// Select all posts by ID as an object
export const selectAllPostsById = ((state) => state.posts?.allPosts?.byId || {});
// Select a single post
export const selectSinglePost = ((state) => state.posts.singlePost);

export const selectUserPosts = (state) => state.posts.userPosts.byId || {};
export const selectPostById = (state) => state.posts.userPosts.allIds
export const selectUserPostsWithNoAlbumId = (state) => state.posts.userPostsNoAlbum.byId || {};
export const selectPostWithNoAlbumIdById = (state) => state.posts.userPostsNoAlbum.allIds

export const selectPostUserInfo= (state) => state.posts?.userInfo


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

// export const selectAlbumImages =  (state, albumId) => {
//   const album = state.albums.singleAlbum.byId[albumId];
//   return album ? album.imageIds.map(id => album.images[id]) : [];
// };


// export const selectAlbumImages = (state, albumId) => {
//   const album = state.albums?.singleAlbum?.byId?.[albumId];
//   if (!album || !album?.images) return [];

//   return album.imageIds?.map(id => {
//     const image = album.images?.[id];
//     return {
//       ...image,
//       post_id: image?.post_id,
//     };
//   });
// };

export const selectAlbumDetails = (state, albumId) => {
  const album = state.albums?.singleAlbum?.byId?.[albumId];
  if (!album) return { images: [], title: '' };

  const images = album.imageIds?.map(id => {
    const image = album.images?.[id];
    return {
      ...image,
      post_id: image?.post_id,
    };
  });

  return {
    images: images || [],
    title: album.title || 'Untitled Album',
  };
};

export const selectAlbumUserInfo= (state) => state.albums?.userInfo

export const selectAllAlbums = (state) => {
  const { userAlbums } = state?.albums;
  return userAlbums?.allIds.map((id) => {
    const album = userAlbums?.byId?.[id];

    const albumWithImages = {
      ...album,
      images: album?.images?.allIds?.map(imageId => album?.images?.byId?.[imageId])
    };

    return albumWithImages;
  });
};


export const selectTotalAlbums = (state) => state.albums?.userAlbums?.allIds?.length;
export const selectAlbumInfo = (state, albumId) => state.albums?.singleAlbum?.byId?.[albumId];

export const selectUserAlbums = (state) => {
  const albumsById = state.albums?.userAlbums?.byId;
  return albumsById ? Object.values(albumsById) : [];
};
// =========================================================
//               ****Comment UseSelectors****
// =========================================================
export const selectPostComments = (state) => state.comments?.allCommentsOfPost?.allIds.map((id) => state.comments.allCommentsOfPost.byId[id]|| {});
// Selector to get comments for a specific post
export const selectPostComments1 = (state, postId) => {
  const comments = state.comments[postId];
  return comments ? comments?.allIds.map(id => comments?.byId?.[id]) : [];
};

// =========================================================
//               ****Aws UseSelectors****
// =========================================================
export const selectUploadedImageUrl = (state) => state.aws?.uploadedImageUrl;

// =========================================================
//               ****Favorite UseSelectors****
// =========================================================
// export const selectFavoritePosts = (state) => state.favorites?.allFavorites || {};
export const selectFavoritePosts = (state) => {

  return state.favorites.allFavorites;
};

// export const selectFavoriteById =  (state) => state.favorites?.favoritesById || {};




// Selector to get all favorites
export const selectAllFavorites = (state) => {
  return Object.values(state.favorites.favoritesById);
};


// Selector to check if a post is favorited
export const isPostFavorited = (state, postId) => {
  const favorites = Object.values(state.favorites.favoritesById);
  return favorites.some(favorite => favorite.post_id === postId);
};

// Selector to get a favorite by ID
export const selectFavoriteById = (state, favoriteId) => {
  return state.favorites.favoritesById[favoriteId];
};

// =========================================================
//               ****Tags UseSelectors****
// =========================================================
export const selectAllTags = (state) => state.tags?.allTags || [];

export const selectPostsByTag = (state) => {
  return state.tags.postsByTag.allIds.map(postId => {
    const post = state.tags.postsByTag?.byId?.[postId];
    return {
      post_id: post.id,
      image_url: post.image_url
    };
  });
};
// =========================================================
//               ****Paginations UseSelectors****
// =========================================================

export const selectCurrentPageAllPosts = (state) => state.posts.allPosts.pagination.currentPage;
export const selectTotalPagesAllPosts = (state) => state.posts.allPosts.pagination.totalPages;

export const selectCurrentPage = (state) => state.posts.pagination.currentPage;
export const selectTotalPages = (state) => state.posts.pagination.totalPages;
