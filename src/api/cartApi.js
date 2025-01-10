import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});


export const fetchCartApi = async ({userId}) => {
    try{
        const response = await axiosInstance.get(`/cart/${userId}`);
        return response.data;
    }catch(error){
        throw error;
    }

}