
import React from "react";
import ReactDOM from "react-dom";
import UserProvider from "./state/UserProvider";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import LocationProvider from "./state/LocationProvider";

ReactDOM.render(
  <UserProvider>
    <LocationProvider>
      <App />
    </LocationProvider>
  </UserProvider>,
  document.querySelector("#root")
);
