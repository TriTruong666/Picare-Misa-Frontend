import axios from "axios"

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_TEST_API_URL
    : process.env.NEXT_PUBLIC_API_URL

const axiosClient = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

export default axiosClient