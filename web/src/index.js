import React from "react";
//import ReactDOM from 'react-dom';
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./pages/App";
import "./styles/App.css";
import HelloComponent from "./components/HelloComponent";
import reportWebVitals from "./reportWebVitals";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Home from "./pages/Home"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//ReactDOM.render(<p>Hello</p> , document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <>
        <HelloComponent/>
        <p>Heelloo</p>
      </>
  },
  {
    path: "/app", element: <App/>
  },
  {
    path: "/login", element: <Login/>
  },
  {
    path: "/callback", element: <Callback/>
  },
  {
    path: "/home", element: <Home/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  //เเก้ไขได้
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
