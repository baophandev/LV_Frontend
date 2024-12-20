import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

export const fetchProducstApi = async ({ pageNumber = 0, pageSize = 0 }) => {
  const response = await axiosInstance.get("/product", {
    params: {
      page: pageNumber,
      size: pageSize,
    },
  });
  return response.data;
};


export const fetchProductApi = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}`);
  return response.data
}