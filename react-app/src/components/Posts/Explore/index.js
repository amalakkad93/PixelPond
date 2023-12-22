import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Pagination from "../../Pagination";
import Spinner from "../../Spinner";
import {thunkGetAllPosts,} from "../../../store/posts";
import { setLoading, setError, clearUIState } from "../../../store/ui";
import { selectLoading, selectAllPostsImages,} from "../../../store/selectors";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;

  const fetchData = async (page) => {
    dispatch(setLoading(true));
    const response = await dispatch(thunkGetAllPosts(page, perPage));

    if (response) {
      setCurrentPage(response.current_page);
      setTotalPages(response.total_pages);
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, dispatch]);

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
        onPageChange={(newPage) => fetchData(newPage)}
      />
    </div>
  );
};

export default Explore;
