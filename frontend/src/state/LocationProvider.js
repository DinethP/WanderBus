
import React, { useState, useEffect, useContext } from "react";
import locationContext from "./LocationContext";
import {
  getLocations,
  postComment,
  delLocation,
  putLocation,
  postLocation,
  postCSV,
  flushData,
  getStopETA,
} from "../helpers/LocationHelper";
import userContext from "./UserContext";

const LocationProvider = (props) => {
  const user = useContext(userContext);

  const [locations, setLocations] = useState([]);
  const [init, setInit] = useState(false);

  const getlocs = async () => {
    const locs = await getLocations();
    setLocations(locs);
    setInit(true);
  };

  const findById = (id) => {
    return locations.find((val) => val.stop_id === id);
  };

  const addFav = (id) => {
    const locationIndex = locations.findIndex((val) => id === val.stop_id);
    const location = locations[locationIndex];
    location.favourite = location.favourite + 1;
    const newLocs = [...locations];
    newLocs[locationIndex] = location;

    setLocations(newLocs);
  };

  const removeFav = (id) => {
    const locationIndex = locations.findIndex((val) => id === val.stop_id);
    const location = locations[locationIndex];
    location.favourite = location.favourite - 1;
    const newLocs = [...locations];
    newLocs[locationIndex] = location;

    setLocations(newLocs);
  };

  const addComment = (id, commentContent) => {
    if (!user.user.logged_in) return;

    const locationIndex = locations.findIndex((val) => id === val.stop_id);
    const location = locations[locationIndex];
    location.comments.push({
      username: user.user.username,
      content: commentContent,
    });
    const newLocs = [...locations];
    newLocs[locationIndex] = location;

    setLocations(newLocs);

    postComment(id, user.user.username, commentContent);
  };

  const reloadData = async () => {
    const responseData = await flushData();
    if (responseData.status === 200) return true;
    else return false;
  };

  const addLoc = async (stopData, routeData) => {
    const data = {
      stop_id: stopData.id,
      name: stopData.name,
      lat: stopData.lat,
      long: stopData.long,
      routes: routeData,
      company: "CTB",
    };
    const responseData = await postLocation(data);
    if (responseData.status === 200) {
      return true;
    } else console.log("ERROR");
  };

  const addCSVLoc = async (data) => {
    const responseData = await postCSV(data);
    if (responseData.status === 200) {
      return true;
    } else console.log("ERROR");
  };

  const deleteLoc = (id) => {
    const locationIndex = locations.findIndex((val) => id === val.stop_id);
    let deleted = locations.splice(locationIndex, 1);
    let newLocs = [...locations];
    setLocations(newLocs);
    console.log("first");
    delLocation(id).catch((err) => {
      setLocations(newLocs.push(deleted));
    });
  };

  const updateLoc = (id, data) => {
    const locationIndex = locations.findIndex((val) => id === val.stop_id);
    const oldData = locations[locationIndex];
    let location = locations[locationIndex];
    for (let [key, value] of Object.entries(data)) {
      location[key === "id" ? "stop_id" : key] = value;
    }
    let newLocs = [...locations];
    newLocs[locationIndex] = { ...newLocs[locationIndex], location };
    setLocations(newLocs);
    console.log(locations);
    const updateData = {
      stop_id: data.id,
      name: data.name,
      lat: data.lat,
      long: data.long,
    };
    putLocation(id, updateData).catch((err) => {
      newLocs[locationIndex] = oldData;
      setLocations(newLocs);
    });
  };

  const getETA = async (stop_id) => {
    const responseData = await getStopETA(stop_id);
    if (responseData.status === 200) {
      return responseData.data;
    } else console.log("ERROR");
  };

  useEffect(() => {
    // console.log("TEST", "LocationProvider");
    if (!init) {
      getlocs();
    }
  });

  return (
    <locationContext.Provider
      value={{
        locations: locations,
        init: init,
        addComment,
        findById,
        addFav,
        removeFav,
        reloadData,
        addLoc,
        addCSVLoc,
        deleteLoc,
        updateLoc,
        getETA,
      }}
    >
      {props.children}
    </locationContext.Provider>
  );
};

export default LocationProvider;
