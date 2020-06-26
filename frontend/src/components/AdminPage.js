
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrosshairs,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import userContext from "../state/UserContext";
import locationContext from "../state/LocationContext";
import AdminChart from "./AdminChart";
import AdminChart2 from "./AdminChart2";
import UserTable from "./UserTable";

const AdminPage = (props) => {
  const userCtx = useContext(userContext);
  const locationCtx = useContext(locationContext);
  const history = useHistory();

  useEffect(() => {
    console.log("TEST", "AdminPage");
    userCtx.loginAsAdmin();
  }, []);

  const handleSignoutClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to sign out?")) {
      userCtx.signout();
      history.push("/");
    }
  };

  const handleMapClick = (location, map) => {
    userCtx.setUser({
      ...userCtx.user,
      location: {
        lat: location.lat(),
        long: location.lng(),
      },
    });
  };

  const handleMyPosClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      userCtx.setUser({
        ...userCtx.user,
        location: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        },
      });
    });
  };

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between">
        <h5>Hello, {userCtx.user.username}</h5>
        <Button variant="primary" type="submit" onClick={handleSignoutClick}>
          Sign out
          <FontAwesomeIcon
            className="fa-signout"
            icon={faSignOutAlt}
          ></FontAwesomeIcon>
        </Button>
      </div>
      <hr />
      <div className="map-container">
        <div className="d-flex justify-content-between">
          <h5>My location</h5>
          <OverlayTrigger
            placement={"top"}
            overlay={<Tooltip>Mark current position</Tooltip>}
          >
            <FontAwesomeIcon
              onClick={handleMyPosClick}
              className="fa-crosshair"
              icon={faCrosshairs}
            ></FontAwesomeIcon>
          </OverlayTrigger>
        </div>
        <h6>Your can click on the map to modify your location</h6>
        <Map
          onClick={(t, map, c) => handleMapClick(c.latLng, map)}
          google={props.google}
          center={{
            lat: userCtx.user.location.lat,
            lng: userCtx.user.location.long,
          }}
          initialCenter={{
            lat: userCtx.user.location.lat,
            lng: userCtx.user.location.long,
          }}
          zoom={14}
          style={{
            height: 500,
            width: "100%",
            margin: "0 auto",
            position: "relative",
          }}
          containerStyle={{
            position: "relative",
            width: "100%",
            margin: "20px 0px",
          }}
        >
          <Marker
            onClick={() => {}}
            title={"My location"}
            name={"My location"}
            position={{
              lat: userCtx.user.location.lat,
              lng: userCtx.user.location.long,
            }}
          />
        </Map>
      </div>
      <hr />
      <h5>User Management</h5>
      <UserTable />
      <hr />
      <h5>User Activity Statistics</h5>
      <h6>Track which users are most active by comments and favourites.</h6>
      <br></br>
      <AdminChart />
      <br></br>
      <AdminChart2 />
      <br></br>
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCGXpHmTk63MUCUXfclORWPCTEh5B35qoQ",
})(AdminPage);
