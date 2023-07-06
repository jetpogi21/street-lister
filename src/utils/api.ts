import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8001",
});

export default axiosClient;
