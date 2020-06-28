
import React, { useContext, useState } from "react";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

import locationContext from "../state/LocationContext";
import { Redirect } from "react-router";

const MapPage = (props) => {
  const [clicked, setClicked] = useState(false);
  const [id, setId] = useState(null);

  const locs = useContext(locationContext);

  const handleClick = (id) => {
    setId(id);

    setClicked(true);
  };

  return (
    <div className="map-container">
      {clicked ? (
        <Redirect to={`${process.env.PUBLIC_URL}/location/${id}`} />
      ) : (
        <Map
          google={props.google}
          initialCenter={{ lat: 22.2988, lng: 114.1722 }}
          zoom={14}
          className={"map"}
        >
          {locs.locations.map((location) => (
            <Marker
              onClick={() => handleClick(location.stop_id)}
              title={location.name}
              name={location.name}
              position={{ lat: location.lat, lng: location.long }}
            />
          ))}
        </Map>
      )}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
})(MapPage);
