import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import LoginFormModal from "./components/LoginFormModal";
import GetPosts from "./components/Posts/GetPosts";
import PostDetail from "./components/Posts/PostDetail";
import AlbumImages from "./components/Albums/AlbumImages";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" ><LoginFormModal /></Route>
          <Route path="/signup"><SignupFormModal /></Route>
          <Route path="/posts/all"><GetPosts mode="all" /></Route>
          <Route path="/posts/owner"><GetPosts mode="owner" /></Route>
          <Route path="/posts/:postId"><PostDetail /></Route>
          <Route path="/albums/:albumId"><AlbumImages /></Route>

        </Switch>
      )}
    </>
  );
}

export default App;
