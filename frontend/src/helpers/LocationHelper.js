
import axios from "axios";

const port = '/2053/'

export const getLocations = async () => {
  const response = await axios({
    method: "get",
    url: `${process.env.PUBLIC_URL}/api/stop`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
  return response.data.data;
};

export const delLocation = async (id) => {
  const response = await axios({
    method: "delete",
    url: `${process.env.PUBLIC_URL}/api/stop/${id}`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });

  return response.data.data;
};

export const putLocation = async (stop_id, data) => {
  const response = await axios({
    method: "put",
    url: `${process.env.PUBLIC_URL}/api/stop`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: {
      stop_id: stop_id,
      data: data,
    },
  });
};

export const flushData = async () => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/flush`,
  });
  return response.data;
};

export const postLocation = async (data) => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/stop`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: data,
  });
  return response.data;
};

export const postCSV = async (data) => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/stop/csv`,
    headers: { "Content-Type": "multipart/form-data" },
    data: data,
  });
  return response.data;
};

export const postComment = async (stop_id, username, content) => {
  const response = await axios({
    method: "post",
    url: `${process.env.PUBLIC_URL}/api/comment`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    data: {
      stop_id,
      username,
      content,
    },
  });
};

export const getStopETA = async (stop_id) => {
  const response = await axios({
    method: "get",
    url: `${process.env.PUBLIC_URL}/api/eta/CTB/${stop_id}`,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });
  return response.data;
};
