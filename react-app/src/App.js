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
import UserProfile from "./components/Users/UserProfile/UserProfile";
import ImageDisplay from "./components/ImageDisplay";
import Explore from "./components/Posts/Explore";
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
        <>
          {/* <PageResetter /> */}
          <Switch>
            <Route path="/login">
              <LoginFormModal />
            </Route>
            <Route path="/signup">
              <SignupFormModal />
            </Route>
            <Route path="/explore">
              <Explore />
            </Route>

            <Route path="/posts/all">
              <GetPosts mode="all" />
            </Route>
            <Route path="/posts/owner">
              <GetPosts mode="owner" />
            </Route>
            <Route path="/owner/photostream">
              <ImageDisplay mode="ownerPhotoStream" key="ownerPhotoStream" />
            </Route>
            <Route path="/owner/albums">
              <ImageDisplay mode="ownerAlbumImages" key="ownerAlbumImages" />
            </Route>
            <Route path="/owner/posts/add">
              <ImageDisplay mode="addPostToAnAlbum" key="addPostToAnAlbum" />
            </Route>

            <Route path="/posts/users/:userId">
              <ImageDisplay mode="photoStream" key="photoStream" />
            </Route>
            <Route path="/users/show">
              <UserProfile />
            </Route>
            <Route path="/posts/:postId">
              <PostDetail />
            </Route>
            <Route path="/albums/users/:userId">
              <GetAlbums />
            </Route>
            <Route path="/albums/:albumId">
              <ImageDisplay mode="albumImages" key="albumImages" />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Switch>
        </>
      )}
    </>
  );
}

export default App;
