
import axios from "axios";

const port = '/2053/';

export const loginHelper = async (formData) => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/login`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: formData,
  });

  return response.data;
};

export const signUpHelper = async (formData) => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/signup`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    },
  });

  return response.data;
};

export const getUserData = async (username) => {
  const response = await axios({
    method: "get",
    url: `${process.env.PUBLIC_URL}/api/user/${username}`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });

  return response.data.data;
};

export const getUsers = async () => {
  const response = await axios({
    method: "get",
    url: `${process.env.PUBLIC_URL}/api/user`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
  return response.data;
};

export const delUser = async (username) => {
  const response = await axios({
    method: "delete",
    url: `${process.env.PUBLIC_URL}/api/user/${username}`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
  return response.data;
};

export const putUser = async (username, data) => {
  const response = await axios({
    method: "put",
    url: `${process.env.PUBLIC_URL}/api/user`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: {
      username: username,
      data: data,
    },
  });
  return response.data;
};

export const addFav = async (stop_id, username) => {
  console.log("addFav");

  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/favourite/stop`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: {
      stop_id,
      username,
    },
  });
};

export const removeFav = async (stop_id, username) => {
  console.log("removeFav");
  const response = await axios({
    method: "delete",
    url: `${process.env.PUBLIC_URL}/api/favourite/stop/${username}/${stop_id}`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
};
