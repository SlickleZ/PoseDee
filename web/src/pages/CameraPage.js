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

  // useEffect(() => {
  //   fetch("/time")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCurrentTime(data.time);
  //     });
  // }, []);

  // console.log(isObjectEmpty(userinfo));
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