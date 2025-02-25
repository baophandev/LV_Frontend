import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const token = localStorage.getItem("authToken");

export const createOrderApi = async ({ order, userId }) => {
  try {
    const response = await axiosInstance.post(`/order/${userId}`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchAllOrdersApi = async ({ userId, pageNumber, pageSize }) => {
  try {
    const response = await axiosInstance.get("/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchOrderByIdApi = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
