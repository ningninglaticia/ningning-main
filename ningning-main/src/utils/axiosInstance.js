import axios from "axios";
import { BASE_URL } from "./contents"; 

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // แก้ไขที่นี่
        }
        return config;
    },
    (error) => { // แก้ไขที่นี่
        return Promise.reject(error); // แก้ไขที่นี่
    }
);

export default axiosInstance;
