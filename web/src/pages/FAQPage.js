import React, { useState, useEffect } from "react";
import "../styles/App.css";
import useCookie, { setCookie } from "react-use-cookie";
import AppNavBar, { navigation } from "../components/AppNavBar";
import ScrollToTopComp from "../components/ScrollToTopComp";
import FAQ from "../components/FAQ";

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0;
};


function FAQPage() {
  const [userinfo, setUserInfo] = useCookie("userinfo", "");

  useEffect(() => {
    document.title = 'PoseDee | FAQ';
  }, []);

  // console.log(isObjectEmpty(userinfo));
  if (!isObjectEmpty(userinfo)) {
    return (
      <div className="App">
        <AppNavBar/>
        <ScrollToTopComp />
        <FAQ />
      </div>
    );
  }
  // If condition is null
  else {
    return (window.location.href = "/");
  }
}

export default FAQPage;