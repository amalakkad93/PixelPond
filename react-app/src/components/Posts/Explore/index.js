import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../../Pagination";
import Spinner from "../../Spinner";
import { thunkGetAllPostsImages, clearPostsImageState, clearPostsData } from "../../../store/posts";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import {
  selectLoading,
  selectAllPostsImages,
  selectTotalPages,
  selectCurrentPage,
} from "../../../store/selectors";
import "./Explore.css";

const ImageItem = ({ imageUrl, postId, onClick }) => (
  <div className="photo-item" onClick={() => onClick(postId)}>
    <LazyLoadImage src={imageUrl} alt="Photo" effect="blur" />
  </div>
);

const Explore = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectLoading);
  const postsImages = useSelector(selectAllPostsImages);
  console.log("🚀 ~ file: index.js:30 ~ Explore ~ postsImages:", postsImages);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const perPage = 10;

  useEffect(() => {

    dispatch(clearPostsData('allPostsImages'));

    dispatch(thunkGetAllPostsImages(currentPage, perPage));
  }, [dispatch, currentPage, perPage]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="all-posts-images">
      {postsImages && postsImages.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="photo-grid"
          columnClassName="photo-grid_column"
        >
          {postsImages.map((post) => (
            <ImageItem
              key={post.post_id}
              imageUrl={post.image_url}
              postId={post.post_id}
              onClick={() => history.push(`/posts/${post.post_id}`)}
            />
          ))}
        </Masonry>
      )}

      <Pagination
        totalItems={totalPages * perPage}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={(newPage) =>
          dispatch(thunkGetAllPostsImages(newPage, perPage))
        }
      />
    </div>
  );
};

export default Explore;
