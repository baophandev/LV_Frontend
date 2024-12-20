import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});


export const fetchCategoryApi = async () => {
    const response = await axiosInstance.get('/category');
    return response.data;
}

