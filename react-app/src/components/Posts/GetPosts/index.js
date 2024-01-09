import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { setLoading, setError } from "../../../store/ui";
import {
  thunkGetAllPosts,
  thunkGetOwnerPosts,
  clearPostsData,
} from "../../../store/posts";
import { fetchUserInfoById } from "../../../store/session";
import {
  selectOwnerPosts,
  selectAllPosts,
  selectSessionUser,
  selectCurrentPage,
  selectTotalPages,
  selectCurrentPageAllPosts,
  selectTotalPagesAllPosts,
} from "../../../store/selectors";

import Pagination from "../../Pagination";
import useResponsivePagination from "../../Pagination/useResponsivePagination";

import "./GetAllPosts.css";

const fetchedUserIds = new Set();

export default function GetPosts({ mode = "all" }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.ui);
  // const posts = useSelector(
  //   mode === "owner" ? selectOwnerPosts : selectAllPosts
  // );
  const sessionUser = useSelector(selectSessionUser);

  // const currentPage = useSelector(selectCurrentPageAllPosts);
  // const totalPages = useSelector(selectTotalPagesAllPosts);
  // const currentPage = useSelector(selectCurrentPage);
  // const totalPages = useSelector(selectTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const userId = selectSessionUser?.id;
  // const perPage = 10;
  const perPage = useResponsivePagination(10);
  const { posts, ownerIds } = useSelector(
    mode === "owner" ? selectOwnerPosts : selectAllPosts
  );
  const usersById = useSelector((state) => state.session.byId);
  console.log("🚀 ~ file: index.js:46 ~ GetPosts ~ usersById :", usersById )
  console.log("PerPage value in GetPosts: ", perPage);

  // useEffect(() => {
  //   ownerIds.forEach(id => {
  //     if (!fetchedUserIds.has(id)) {
  //       fetchedUserIds.add(id);
  //       dispatch(fetchUserInfoById(id));
  //     }
  //   });
  // }, [dispatch, ownerIds]);

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
        {posts.map((post) => (
          <div
            key={post?.id}
            className="post-item"
            // onClick={() => history.push(`/posts/users/${post?.owner_id}`)}
            onClick={() => {
              const path = post?.owner_id === sessionUser.id ? `/owner/photostream` : `/posts/users/${post?.owner_id}`;
              history.push(path);
            }}
          >
            <img
              className="main-image"
              src={post?.image_url}
              alt={`Banner for ${post.title}`}
            />

            <div className="user-details-in-all-posts">
              <img
                className="profile-picture-get-posts"
                src={post.user_info?.profile_picture}
                alt={post.user_info?.username}
              />
              <div className="post-title-username-div">
                <h3 className="post-title-h3">{post.title}</h3>
                <p className="post-title-p">{post.user_info?.username}</p>
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
