import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AOS from 'aos'
import 'aos/dist/aos.css'



AOS.init({ duration: 2000, easing: 'ease-in-out', once: false })
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
