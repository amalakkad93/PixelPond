import React, { useState, useEffect, useMemo } from "react";
import image1 from "../image1.png";
import image2 from "../image2.jpg";
import image3 from "../image3.jpg";
import image4 from "../image4.jpg";
import image5 from "../image5.jpg";
import image6 from "../image6.jpg";
import image7 from "../image7.jpg";
import image8 from "../image8.jpg";
import image9 from "../image9.jpg";
import image10 from "../image10.jpg";

export const useDynamicBackground = () => {
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const images = useMemo(
    () => [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
      image10,
    ],
    []
  );

  useEffect(() => {
    // Change the background image every 60 seconds
    const interval = setInterval(() => {
      setBgImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Apply the background image
    document.documentElement.style.backgroundImage = `url(${images[bgImageIndex]})`;

    return () => {
      // Revert to default background when the component unmounts
      document.documentElement.style.background = "white";
      document.documentElement.style.backgroundImage = "none";
    };
  }, [bgImageIndex, images]);

  return images[bgImageIndex]; // This line is optional, only if you need to use the current image elsewhere


    // useEffect(() => {
  //   // Check if the user is on the login/signup pages or if they're logged in
  //   const whiteBackgroundRoutes = [
  //     "/login",
  //     "/signup",
  //     "/restaurants/nearby",
  //     "/favorites",
  //     "/restaurants",
  //     "/menu-item"
  //   ];

  //   const isMenuItemDetailPage = /^\/restaurant\/\d+\/menu-item\/\d+$/.test(location.pathname);

  //   // Using .some() to check if location.pathname matches any of the routes
  //   if (
  //     whiteBackgroundRoutes.some((route) => location.pathname.startsWith(route)) ||
  //     isMenuItemDetailPage
  //   ) {
  //     document.documentElement.style.background = "white";
  //     document.documentElement.style.backgroundImage = "none";
  //   } else {
  //     document.documentElement.style.backgroundImage = `url(${images[bgImageIndex]})`;
  //   }
  // }, [sessionUser, bgImageIndex, images, location.pathname]);
};




// Custom hook to generate a dynamic greeting based on the time of day
// export const useDynamicGreeting = () => {
//   const [greeting, setGreeting] = useState('');

//   useEffect(() => {
//     const now = new Date();
//     const hour = now.getHours();

//     if (hour < 12) {
//       setGreeting('Good Morning! Order breakfast near you');
//     } else if (hour < 18) {
//       setGreeting('Good Afternoon! Order lunch near you');
//     } else {
//       setGreeting('Good Evening! Order dinner near you');
//     }

//     // Set document title
//     document.title = greeting;
//   }, [greeting]);

//   return greeting;
// };
