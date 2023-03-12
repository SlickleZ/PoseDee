import React, { useState, useEffect } from "react";
import "../styles/App.css";
import useCookie, { setCookie } from "react-use-cookie";

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [userinfo, setUserInfo] = useCookie("userinfo", "");
  const RemoveCookie = (locale) => {
    setCookie('userinfo', locale, {
      days: 0,
    });
  };
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
        <header className="App-header">

        {/* เเปลงจาก Json จาก userinfo เป็น name */}
        {/* {userinfo && JSON.parse(userinfo).name} */}

        {
          userinfo && <>
            <img src={JSON.parse(userinfo).picture}/>
            <p>Name: {JSON.parse(userinfo).name}</p>
            <p>Email: {JSON.parse(userinfo).email}</p>
          </>
        }
        <p>The current time is {currentTime}.</p>

        <button type="button" onClick={() => {
            RemoveCookie()
            window.location.href = "/login";
          }} > Logout </button>
      </header>
    </div>);
  }
  else { return(
    <div className="App">
    <header className="App-header">

    <p>No user founded</p>
    <p>Please login</p>

    <button type="button" onClick={() => {
        RemoveCookie()
        window.location.href = "/login";
      }} > Login Page </button>
  </header>
</div>   
    );
  }
}

export default App;
