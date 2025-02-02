import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

export const getMyInfoApi = async (token) => {
    try {
        const response = await axiosInstance.get("/user/myInfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    }catch(error){
        throw error;
    }
}