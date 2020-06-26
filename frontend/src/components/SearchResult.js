
import React, { useContext } from "react";
import locationContext from "../state/LocationContext";
import userContext from "../state/UserContext";
import { Container } from "react-bootstrap";
import LocationTable from "./LocationTable";

const SearchResult = (props) => {
  const locationCtx = useContext(locationContext);
  const userCtx = useContext(userContext);

  const calcDistanceToUser = (lat, long) => {
    const uLat = userCtx.user.location.lat; // user lat
    const uLong = userCtx.user.location.long; // user long
    const R = 6371; // radius of the earth in km
    const dLat = toRad(lat - uLat); // delta lat
    const dLong = toRad(long - uLong); // delta long
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) *
        Math.cos(toRad(uLat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const locations =
    props.match.params.query !== "all"
      ? locationCtx.locations.filter((val) => {
          const queryLower = props.match.params.query.toLowerCase();
          switch (props.match.params.field) {
            case "id":
              return val.stop_id.toLowerCase().includes(queryLower);
            case "name":
              return val.name.toLowerCase().includes(queryLower);
            case "lat":
              return val.lat.toLowerCase().includes(queryLower);
            case "long":
              return val.long.toLowerCase().includes(queryLower);
            case "nearby":
              return queryLower >= calcDistanceToUser(val.lat, val.long);

            default:
              break;
          }
        })
      : locationCtx.locations;

  return (
    <Container className="mt-3">
      {`( ` + locations.length + ` search results )`}
      <LocationTable locations={locations} />
    </Container>
  );
};

export default SearchResult;
