
import React, { useContext } from "react";
import { Container, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import userContext from "../state/UserContext";
import locationContext from "../state/LocationContext";
import LocationTable from "./LocationTable";
import UserChart from "./UserChart";
import UserChart2 from "./UserChart2";

const UserPage = (props) => {
  const userCtx = useContext(userContext);
  const locationCtx = useContext(locationContext);

  const handleSignoutClick = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to sign out?")) userCtx.signout();
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
      {userCtx.user.fav_locations.length > 0 ? (
        <>
          <h5>Favorite Stops</h5>
          <LocationTable
            locations={userCtx.user.fav_locations.map((id) =>
              locationCtx.findById(id)
            )}
          />
        </>
      ) : (
        <>
          <h5>Favorite Stops:</h5>
          <h6>You dont have any favorite locations yet</h6>
        </>
      )}

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
        <h6>You can click on the map to modify your location</h6>
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

      <hr></hr>
      <h5>Trending Locations</h5>
      <h6>See which locations are popular amongst all users.</h6>
      <br></br>
      <UserChart locations={locationCtx.locations} />
      <br></br>
      <UserChart2 locations={locationCtx.locations} />
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCGXpHmTk63MUCUXfclORWPCTEh5B35qoQ",
})(UserPage);
