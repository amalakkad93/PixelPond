// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import AWSImageUploader from '../Aws/AWSImageUploader';
// import { updateUserProfilePic } from '../../store/session';

// const UserProfileManager = () => {
//   const dispatch = useDispatch();
//   const [imageUploadInitiated, setImageUploadInitiated] = useState(false);

//   const handleUploadSuccess = (newImageUrl) => {
//     dispatch(updateUserProfilePic(newImageUrl))
//       .then(() => console.log('Profile picture updated successfully'))
//       .catch((error) => console.error('Error updating profile picture:', error));
//   };

//   const handleUploadFailure = (errorMessage) => {
//     console.error('Upload failed:', errorMessage);
//   };

//   return (
//     <div>
//       <AWSImageUploader
//         onUploadSuccess={handleUploadSuccess}
//         onUploadFailure={handleUploadFailure}
//         initiateUpload={imageUploadInitiated}
//       />

//     </div>
//   );
// };

// export default UserProfileManager;


import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import AWSImageUploader from '../Aws/AWSImageUploader';
import { updateUserProfilePic, setUser } from '../../store/session';
import { setLoading } from '../../store/ui'; // Import setLoading action

const UserProfileManager = ({ setIsEditingProfilePic, onProfilePicUpdate, refreshPageData,  setReloadPage }) => {
  const dispatch = useDispatch();
  const [imageUploadInitiated, setImageUploadInitiated] = useState(false);
  const userProfileManagerRef = useRef(null);

  const handleUploadSuccess = async (newImageUrl) => {
    dispatch(setLoading(true));
    try {
      const updatedUser = await dispatch(updateUserProfilePic(newImageUrl));
      console.log('Profile picture updated successfully');
      dispatch(setUser(updatedUser));
      setIsEditingProfilePic(false);
      onProfilePicUpdate(newImageUrl);
      // setReloadPage(prevState => !prevState);
      refreshPageData();

    } catch (error) {
      console.error('Error updating profile picture:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUploadFailure = (errorMessage) => {
    console.error('Upload failed:', errorMessage);
    dispatch(setLoading(false));
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsEditingProfilePic(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(userProfileManagerRef);

  return (
    <div ref={userProfileManagerRef}>
      <AWSImageUploader
        onUploadSuccess={handleUploadSuccess}
        onUploadFailure={handleUploadFailure}
        initiateUpload={imageUploadInitiated}
      />
    </div>
  );
};

export default UserProfileManager;



// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import AWSImageUploader from '../Aws/AWSImageUploader';
// import { updateUserProfilePic, setUser } from '../../store/session';
// import { setLoading } from '../../store/ui';

// const UserProfileManager = ({ setIsEditingProfilePic }) => {
//   const dispatch = useDispatch();
//   const [imageUploadInitiated, setImageUploadInitiated] = useState(false);
//   const userProfileManagerRef = useRef(null);

//   const handleUploadSuccess = (newImageUrl) => {
//     dispatch(updateUserProfilePic(newImageUrl))
//       .then((updatedUser) => {
//         console.log('Profile picture updated successfully');
//         // dispatch(setUser(updatedUser));
//         setIsEditingProfilePic(false);
//       })
//       .catch((error) => console.error('Error updating profile picture:', error));
//   };

//   const handleUploadFailure = (errorMessage) => {
//     console.error('Upload failed:', errorMessage);
//   };

//   function useOutsideAlerter(ref) {
//     useEffect(() => {
//       function handleClickOutside(event) {
//         if (ref.current && !ref.current.contains(event.target)) {
//           setIsEditingProfilePic(false);
//         }
//       }

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {

//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [ref]);
//   }


//   useOutsideAlerter(userProfileManagerRef);

//   return (
//     <div ref={userProfileManagerRef}>
//       <AWSImageUploader
//         onUploadSuccess={handleUploadSuccess}
//         onUploadFailure={handleUploadFailure}
//         initiateUpload={imageUploadInitiated}
//       />

//     </div>
//   );
// };

// export default UserProfileManager;
