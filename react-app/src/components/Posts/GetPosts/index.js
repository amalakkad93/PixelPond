import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setLoading, setError } from "../../../store/ui";
import {
  thunkGetAllPosts,
  thunkGetOwnerPosts,
} from "../../../store/posts";
import {
  selectOwnerPosts,
  selectAllPosts,
  selectSessionUser,
} from "../../../store/selectors";
import Pagination from "../../Pagination";
import useResponsivePagination from "../../Pagination/useResponsivePagination";

import "./GetAllPosts.css";

export default function GetPosts({ mode = "all" }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.ui);
  const sessionUser = useSelector(selectSessionUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const userId = selectSessionUser?.id;
  const perPage = useResponsivePagination(10);
  const { posts, ownerIds } = useSelector(
    mode === "owner" ? selectOwnerPosts : selectAllPosts
  );

  const fetchData = async (page) => {
    try {
      dispatch(setLoading(true));
      let response;

      if (mode === "owner") {
        response = await dispatch(thunkGetOwnerPosts(userId, page, perPage));
      } else {
        response = await dispatch(thunkGetAllPosts(page, perPage));
      }

      if (response) {
        setCurrentPage(response.current_page);
        setTotalPages(response.total_pages);
      }
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError("An error occurred"));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, mode, dispatch]);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="center-container">
      <div className="posts-container">
        {posts && posts.map((post) => (
          <div
            key={post?.id}
            className="post-item"
            onClick={() => {
              const path = post?.owner_id === sessionUser?.id ? `/owner/photostream` : `/posts/users/${post?.owner_id}`;
              history.push(path);
            }}
          >
            <img
              className="main-image"
              src={post?.image_url}
              alt={`Banner for ${post?.title}`}
            />

            <div className="user-details-in-all-posts">
              <img
                className="profile-picture-get-posts"
                src={post?.user_info?.profile_picture}
                alt={post?.user_info?.username}
              />
              <div className="post-title-username-div">
                <h3 className="post-title-h3">{post?.title}</h3>
                <p className="post-title-p">{post?.user_info?.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        totalItems={totalPages * perPage}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={(newPage) => fetchData(newPage)}
      />
    </div>
  );
}
