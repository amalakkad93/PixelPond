import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import LoginFormModal from "./components/LoginFormModal";
import GetPosts from "./components/Posts/GetPosts";
import PostDetail from "./components/Posts/PostDetail";
import GetAlbums from "./components/Albums/GetAlbums";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import UserProfile from "./components/UserProfile/UserProfile";
import ImageDisplay from "./components/ImageDisplay";
import NotFound from "./components/NotFound";

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
          <Route path="/owner/photostream"><ImageDisplay mode="ownerPhotoStream"  /></Route>
          <Route path="/owner/albums"><ImageDisplay mode="ownerAlbumImages"  /></Route>
          {/* <Route path="/posts/owner/:userId"><ImageDisplay mode="ownerPhotoStream" /></Route> */}
          {/* <Route path="/posts/users/:userId"><PhotoStream /></Route> */}
          <Route path="/posts/users/:userId"><ImageDisplay mode="photoStream"  /></Route>
          <Route path="/users/show"><UserProfile /></Route>
          <Route path="/posts/:postId"><PostDetail /></Route>
          <Route path="/albums/users/:userId"><GetAlbums /></Route>
          {/* <Route path="/albums/:albumId"><AlbumImages /></Route> */}
          <Route path="/albums/:albumId"><ImageDisplay mode="albumImages"/></Route>

          <Route path="*" element={<NotFound />} />


        </Switch>
      )}
    </>
  );
}

export default App;
