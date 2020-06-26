
import React, { useState, useEffect } from "react";
import userContext from "./UserContext";
import {
  loginHelper,
  signUpHelper,
  getUserData,
  getUsers,
  addFav,
  removeFav,
  delUser,
  putUser,
} from "../helpers/UserHelper";

const UserProvider = (props) => {
  const [UserState, setUserState] = useState({
    username: null,
    email: null,
    fav_locations: [],
    logged_in: false,
    isAdmin: false,
    location: {
      lat: 22.2988,
      long: 114.1722,
    },
  });
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  const isFavorite = (id) => {
    if (!UserState.fav_locations) return false;
    const f = UserState.fav_locations.findIndex((val) => id == val);
    if (f > -1) {
      return true;
    }
    return false;
  };

  const favorite = (id) => {
    const newUserState = { ...UserState };

    if (!UserState.fav_locations) {
      newUserState.fav_locations = [id];
      addFav(id, UserState.username);
    } else {
      const f = UserState.fav_locations.findIndex((val) => id === val);
      if (f > -1) {
        newUserState.fav_locations.splice(f, 1);
        removeFav(id, UserState.username);
      } else {
        newUserState.fav_locations.push(id);
        addFav(id, UserState.username);
      }
    }

    setUserState(newUserState);
  };

  const login = async (formData) => {
    setLoading(true);
    const responseData = await loginHelper(formData);
    if (responseData.status === 200) {
      const userData = await getUserData(formData.username);
      setUserState({
        ...UserState,
        username: userData.username,
        email: userData.email,
        fav_locations: userData.fav_stops,
        logged_in: true,
      });
      setLoading(false);
    } else {
      console.log(responseData);
      setLoading(false);
      return false;
    }
  };

  const loginAsAdmin = async () => {
    setUserState({
      ...UserState,
      username: "Admin",
      logged_in: true,
      isAdmin: true,
    });
  };

  const getAllUsers = async () => {
    const responseData = await getUsers();
    if (responseData.status === 200) {
      return responseData.data;
    } else {
      console.log("ERROR");
    }
  };

  const signUp = async (formData) => {
    setLoading(true);
    const responseData = await signUpHelper({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      fav_locations: [],
      logged_in: true,
    });
    if (responseData.status === 200) {
      const userData = await getUserData(formData.username);
      setUserState({
        ...UserState,
        username: userData.username,
        email: userData.email,
        fav_locations: userData.fav_stops,
        logged_in: true,
      });
      setLoading(false);
    } else {
      setLoading(false);
      return false;
    }
  };

  const signout = () => {
    setUserState({
      ...UserState,
      logged_in: false,
      isAdmin: false,
    });
    setInit(false);
  };

  const createUser = async (data) => {
    const responseData = await signUpHelper({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    if (responseData.status === 200) {
      const userData = await getUserData(data.username);
      return userData;
    }
  };

  const deleteUser = async (username) => {
    const responseData = await delUser(username);
    if (responseData.status === 200) {
      return true;
    }
  };

  const updateUser = async (username, data) => {
    const responseData = await putUser(username, data);
    if (responseData.status === 200) {
      const userData = await getUserData(data.username);
      return userData;
    }
  };

  useEffect(() => {
    console.log("TEST", "UserProvider");
    if (!init && UserState.logged_in) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserState({
          ...UserState,
          location: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
        });
      });
      setInit(true);
    }
  });

  return (
    <userContext.Provider
      value={{
        user: UserState,
        setUser: setUserState,
        loading,
        login,
        loginAsAdmin,
        signUp,
        signout,
        favorite,
        isFavorite,
        deleteUser,
        updateUser,
        createUser,
        getAllUsers,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserProvider;
