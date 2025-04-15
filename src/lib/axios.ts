import 'dotenv/config'
import axios from "axios";

console.log(process.env.db_manager_url)

const axiosInstance = axios.create({
  baseURL: process.env.db_manager_url as string,
  headers: {
    "Content-Type": 'application/json',
  },
  timeout: 1000 * 90,
  timeoutErrorMessage: `DB Manager did not respond`
})

export default axiosInstance