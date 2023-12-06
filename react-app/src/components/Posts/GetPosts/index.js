import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError } from "../../../store/ui";
import { thunkGetAllPosts, thunkGetOwnerPosts } from "../../../store/posts";
import { selectOwnerPosts, selectAllPosts, selectSessionUser  } from "../../../store/selectors";
import "./GetAllPosts.css";

export default function GetPosts({ mode = "all" }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.ui);
  const posts = useSelector( mode === "owner" ? selectOwnerPosts : selectAllPosts);
  const sessionUser = useSelector(selectSessionUser);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        if (mode === "owner") {
          await dispatch(thunkGetOwnerPosts());
        } else {
          const res = await dispatch(thunkGetAllPosts(currentPage, perPage));
          console.log("🚀 ~ file: index.js:23 ~ fetchData ~ res:", res);
        }

        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("An error occurred"));
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, currentPage, perPage, mode]);


  console.log("🚀 ~ file: index.js:37 ~ GetPosts ~ posts:", posts);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="center-container">
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <img className= "main-image" src={post.photo_url} alt={`Banner for ${post.title}`} />

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
    </div>
  );
}
