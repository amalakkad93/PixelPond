import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetUserInfo } from "../../store/actions";
import { selectAlbumUserInfo } from "../../store/selectors";

const About = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectAlbumUserInfo); 

  useEffect(() => {
    dispatch(thunkGetUserInfo(userId));
  }, [dispatch, userId]);

  return (
    <div className="about-container">
      {userInfo?.about_me ? (
        <p>{userInfo.about_me}</p>
      ) : (
        <p>Loading about me...</p>
      )}
    </div>
  );
};

export default About;
