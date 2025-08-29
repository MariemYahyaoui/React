import axios from "axios";

export const http = axios.create({
  baseURL: "https://mockapi.io/projects/68ac399f7a0bbe92cbb9b587",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);
