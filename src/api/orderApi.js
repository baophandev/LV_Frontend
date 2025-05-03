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

export const createVNPayUrl = async (amount) => {
  try {
    const response = await axiosInstance.get("/api/vnpay/create-payment", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        amount: amount,
        orderInfo: "Thanh",
        orderType: "other",
        language: "vn",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating VNPay URL:", error);
    throw error;
  }
};

export const fetchOrdersApi = async ({
  pageNumber = 0,
  pageSize = 0,
  status,
  userId,
}) => {
  const response = await axiosInstance.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: pageNumber,
      size: pageSize,
      ...(status !== "ALL" && { status }),
      userId: userId,
    },
  });
  return response.data;
};
