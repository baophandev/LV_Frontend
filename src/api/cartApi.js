import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const token = localStorage.getItem("authToken");

export const fetchCartApi = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addtoCartApi = async ({ userId, variantId, quantity }) => {
  try {
    const response = await axiosInstance.post(
      "/cart",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          variantId,
          quantity,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi API addtoCartApi:", error?.response?.data || error);
    throw error;
  }
};

export const deleteCartItemApi = async ({userId, itemId}) => {
  try{
    const response = await axiosInstance.delete(
      "/cart/deleteItem",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          itemId,
        },
      }
    );
    return response.data;
  }catch(err){
    console.error("Lỗi API deleteCartItemApi:", err?.response?.data || err);
    throw err;
  }
}