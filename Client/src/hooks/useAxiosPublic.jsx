import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:3000", // Public API endpoint
});

const useAxioPublic = () => {
  return axiosPublic;
};

export default useAxioPublic;
