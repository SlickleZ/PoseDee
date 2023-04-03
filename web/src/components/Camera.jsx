import React, { useState, useEffect } from 'react';

function Camera() {
    // const [src, setSrc] = useState('');

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     fetch('/camera_feed')
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.blob();
    //       })
    //       .then(blob => {
    //         const url = URL.createObjectURL(blob);
    //         setSrc(url);
    //       })
    //       .catch(error => {
    //         console.error('Error:', error);
    //       });
    //   }, 1000);
  
    //   return () => clearInterval(interval);
    // }, []);
  
    // return (
    //   <img src={src} alt="Camera Feed" />
    // );
}

export default Camera
