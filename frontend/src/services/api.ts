import axios from "axios";

const API_URL = "http://192.168.0.12:3005";

export const api = axios.create({
  baseURL: API_URL,
});
