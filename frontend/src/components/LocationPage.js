
import React, { useContext, useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

import locationContext from "../state/LocationContext";
import userContext from "../state/UserContext";
import LocationTable from "./LocationTable";
import CommentSection from "./CommentSection";
import EtaTable from "./EtaTable";

const LocationPage = (props) => {
  const user = useContext(userContext);
  const locs = useContext(locationContext);
  const locationId = props.match.params.id;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (locs.locations.length) {
      setLocation(locs.locations.find((val) => val.stop_id === locationId));
    }
  });

  return (
    <Container className="mt-3">
      {location ? (
        <>
          <LocationTable
            locations={[location]}
            page={window.location.href.split("/")[3]}
          />
          <hr />
          <EtaTable stop_id={locationId} />
          <hr />
          <Map
            google={props.google}
            initialCenter={{ lat: location.lat, lng: location.long }}
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
              title={location.name}
              name={location.name}
              position={{ lat: location.lat, lng: location.long }}
            />
          </Map>

          {user.user.logged_in ? (
            <div className="text-center ">
              <Button
                className={
                  user.isFavorite(location.stop_id)
                    ? "fav-red"
                    : "fav-red-outline"
                }
                onClick={() => {
                  user.isFavorite(location.stop_id)
                    ? locs.removeFav(location.stop_id)
                    : locs.addFav(location.stop_id);
                  user.favorite(location.stop_id);
                }}
              >
                {user.isFavorite(location.stop_id) ? (
                  <>
                    <FontAwesomeIcon icon={faHeart} /> Favorite
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faHeartBroken} /> Not Favorite
                  </>
                )}
              </Button>
            </div>
          ) : (
            ""
          )}
          <hr />
          <CommentSection id={location.stop_id} comments={location.comments} />
        </>
      ) : (
        "Loading..."
      )}
    </Container>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(LocationPage);
