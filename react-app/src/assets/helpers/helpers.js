import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getPresignedUrl } from "../../store/aws";

import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import image4 from "../images/image4.jpg";
import image5 from "../images/image5.jpg";
import image6 from "../images/image6.jpg";
import image7 from "../images/image7.jpg";
import image8 from "../images/image8.jpg";
import image9 from "../images/image9.jpg";
import image10 from "../images/image10.jpg";
import image11 from "../images/image11.jpg";
import image12 from "../images/image12.jpg";
import image13 from "../images/image13.jpg";


export const useDynamicBackground = (bgContainerRef) => {
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
      image11,
      image12,
      image13,
    ],
    []
  );

  useEffect(() => {
    // Change the background image every 10 seconds
    const interval = setInterval(() => {
      setBgImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (bgContainerRef.current) {
      bgContainerRef.current.style.backgroundImage = `url(${images[bgImageIndex]})`;
      bgContainerRef.current.style.backgroundSize = 'cover';
      bgContainerRef.current.style.backgroundPosition = 'center';
    }

  }, [bgImageIndex, images, bgContainerRef]);

  return images[bgImageIndex]; // This line is optional, only if you need to use the current image elsewhere
};


// Custom hook to generate a dynamic greeting based on the time of day
export const useDynamicGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setGreeting('Good Morning! Discover inspiring photos to start your day');
    } else if (hour < 18) {
      setGreeting('Good Afternoon! Explore our photography collections');
    } else {
      setGreeting('Good Evening! Relax with stunning evening shots');
    }

    // Update document title only when greeting changes
    document.title = `Pixel Pond - ${greeting}`;
  }, [greeting]);

  return greeting;
};

export const uploadImageToAWS = async (file, dispatch) => {
  if (!file) {
      throw new Error("No file selected");
  }

  try {
      const presignedData = await dispatch(getPresignedUrl(file.name, file.type));
      if (!presignedData) {
          throw new Error("Failed to get presigned URL");
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedData.presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);

      return new Promise((resolve, reject) => {
          xhr.onload = () => {
              if (xhr.status === 200) {
                  resolve(presignedData.fileUrl + "?t=" + new Date().getTime());
              } else {
                  reject("Failed to upload image");
              }
          };
          xhr.onerror = () => reject("Error during the upload");
      });
  } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
  }
};


export const createInputChangeHandler = (setterFunction, setValidationObj, validationField) => (e) => {
  // Update the value using the provided setter function
  setterFunction(e.target.value);

  // Clear the validation error for the specific field
  setValidationObj((prev) => {
    const newObj = { ...prev };
    delete newObj[validationField];
    return newObj;
  });
};

export const highlightText = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase()
          ? <span key={index} className="highlighted-text">{part}</span>
          : part
      )}
    </span>
  );
};
