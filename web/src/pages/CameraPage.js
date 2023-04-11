import React, { useState, useEffect } from "react";
import "../styles/App.css";
import useCookie, { setCookie } from "react-use-cookie";
import AppNavBar, { navigation } from "../components/AppNavBar";
import ScrollToTopComp from "../components/ScrollToTopComp";
import FAQ from "../components/FAQ";
import Camerat from "../components/Camerat";
import DateTime from "../components/DateTime";
import AlertComp from "../components/AlertComp";

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0;
};


function CameraPage() {
  // const [currentTime, setCurrentTime] = useState(0);
  const [userinfo, setUserInfo] = useCookie("userinfo", "");

    //   // Remove local storage and cookies when the user closes the browser tab
    //   useEffect(() => {
    //     const handleUnload = () => {
    //         localStorage.clear(); // clear local storage
    //         setCookie("userinfo", ""); // clear the userinfo cookie
    //     };

    //     window.addEventListener('beforeunload', handleUnload);

    //     return () => {
    //         window.removeEventListener('beforeunload', handleUnload);
    //     };
    // }, []);

  if (!isObjectEmpty(userinfo)) {
    return (
      <div className="App">
        <AppNavBar/>
        <ScrollToTopComp />
        <Camerat />
        {/* <DateTime /> */}
        <header className="App-header">
          {/* เเปลงจาก Json จาก userinfo เป็น name */}
          {/* {userinfo && JSON.parse(userinfo).name} */}

          {/* <p>The current time is {currentTime}.</p> */}
        </header>
      </div>
    );
  }
  // If condition is null
  else {
    return (window.location.href = "/");
  }
}

export default CameraPage;