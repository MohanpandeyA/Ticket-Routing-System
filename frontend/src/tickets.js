import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const createTicket = (data) => {
  return API.post("/tickets", data);
};
