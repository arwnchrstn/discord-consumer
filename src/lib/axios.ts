import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.db_manager_url as string,
  headers: {
    "Content-Type": 'application/json',
  },
  timeout: 1000 * 90,
  timeoutErrorMessage: `DB Manager did not respond`
})

export default axiosInstance