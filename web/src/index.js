import React from "react";
//import ReactDOM from 'react-dom';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import "./styles/App.css";
import App from "./pages/App";
//import HelloComponent from "./components/HelloComponent";
import reportWebVitals from "./reportWebVitals";
import Login from "./pages/Login";
import Callback from "./pages/Callback";
import Home from "./pages/Home"
import Error404 from "./pages/Error404"

//ReactDOM.render(<p>Hello</p> , document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "*",
    element: 
      <>
        <Error404/>
      </>
  },
  {
    path: "/app", element: <App/>
  },
  {
    path: "/" , element: <Home/>
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
