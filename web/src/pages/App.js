import React, { useState, useEffect } from "react";
import "../styles/App.css";
import useCookie, { setCookie } from "react-use-cookie";
import AppNavBar from "../components/AppNavBar";

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [userinfo, setUserInfo] = useCookie("userinfo", "");

  useEffect(() => {
    fetch("/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  // console.log(isObjectEmpty(userinfo));
  if(!isObjectEmpty(userinfo)){ return(
      <div className="App">
        <AppNavBar />
        <header className="App-header">
        {/* เเปลงจาก Json จาก userinfo เป็น name */}
        {/* {userinfo && JSON.parse(userinfo).name} */}

        <p>The current time is {currentTime}.</p>

      </header>
    </div>);
  }
  // If condition is null
  else { return(
        window.location.href = "/"
    );
  }
}

export default App;
