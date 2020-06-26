
import React, { useContext } from "react";
import { Router, Route } from "react-router-dom";
import history from "../history";
import Header from "./Header";
import MapPage from "./MapPage";
import ListPage from "./ListPage";
import LoginSignUp from "./LoginSignUp";
import UserPage from "./UserPage";
import AdminPage from "./AdminPage";
import LocationPage from "./LocationPage";
import SearchResult from "./SearchResult";
import userContext from "../state/UserContext";
import LocationFormPage from "./LocationFormPage";
import AboutPage from "./AboutPage";

const App = () => {
  const context = useContext(userContext);
  return (
    <>
      <Router basename={'/2053/proj'} history={history}>
        <Header />
        <Route
          path={`${process.env.PUBLIC_URL}/`}
          component={context.user.logged_in ? UserPage : LoginSignUp}
          exact
        />
        <Route path={`${process.env.PUBLIC_URL}/about`} component={AboutPage} exact />
        <Route path={`${process.env.PUBLIC_URL}/list`} component={ListPage} exact />
        <Route path={`${process.env.PUBLIC_URL}/map`} component={MapPage} exact />
        <Route path={`${process.env.PUBLIC_URL}/location/:id`} component={LocationPage} exact />
        <Route path={`${process.env.PUBLIC_URL}/search/:field/:query`} component={SearchResult} exact />
        <Route path={`${process.env.PUBLIC_URL}/admin`} component={AdminPage} exact />
        <Route path={`${process.env.PUBLIC_URL}/locationForm`} component={LocationFormPage} exact />
      </Router>
    </>
  );
};

export default App;
