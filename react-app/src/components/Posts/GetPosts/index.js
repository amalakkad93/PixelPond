import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { setLoading, setError } from "../../../store/ui";
import { thunkGetAllPosts, thunkGetOwnerPosts } from "../../../store/posts";
import { selectOwnerPosts, selectAllPosts, selectSessionUser, selectCurrentPage, selectTotalPages  } from "../../../store/selectors";

import Pagination from "../../Pagination";
import "./GetAllPosts.css";

export default function GetPosts({ mode = "all" }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.ui);
  const posts = useSelector( mode === "owner" ? selectOwnerPosts : selectAllPosts);
  const sessionUser = useSelector(selectSessionUser);
  const currentPage = useSelector(selectCurrentPage);

  // const [currentPage, setCurrentPage] = useState(1);


  // const [totalPages, setTotalPages] = useState(0);
  const userId = selectSessionUser?.id;
  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        if (mode === "owner") {
          await dispatch(thunkGetOwnerPosts(userId, currentPage, perPage));
        } else {
          await dispatch(thunkGetAllPosts(currentPage, perPage));
        }

        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, mode]);



  if (!posts || posts.length === 0) return null;


  return (
    <div className="center-container">
      <div className="posts-container">
        {posts.map((post) => (
          // <div key={post.id} className="post-item" onClick={() => history.push(`/posts/${post.id}`)}>
          <div key={post.id} className="post-item" onClick={() => history.push(`/albums/${post.album_id}`)}>
            <img className= "main-image" src={post.banner_url} alt={`Banner for ${post.title}`} />

            <div className="user-details">
              <img className="profile-picture" src={post.profile_picture} alt={post.username} />
              <div className="post-title-username-div">
              <h3 className="post-title-h3">{post.title}</h3>
              <p className="post-title-p">{post.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination />
    </div>
  );
}
