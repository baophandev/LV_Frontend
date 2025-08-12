import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

// Lấy token mỗi lần gọi API để đảm bảo token luôn mới nhất
const getAuthToken = () => localStorage.getItem("authToken");

export const fetchCartApi = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
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
          Authorization: `Bearer ${getAuthToken()}`,
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
          Authorization: `Bearer ${getAuthToken()}`,
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

export const updateCartQuantityApi = async ({ userId, cartItemId, quantity }) => {
  const params = new URLSearchParams();
  params.append("userId", userId);
  params.append("cartItemId", cartItemId);
  params.append("quantity", quantity);

  const response = await axiosInstance.post("/cart/updateQuantity", params, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return response.data;
};

export const updateCartVariantApi = async ({ userId, cartItemId, newVariantId }) => {
  try {
    const params = new URLSearchParams();
    params.append("userId", userId);
    params.append("cartItemId", cartItemId);
    params.append("variantId", newVariantId);

    const response = await axiosInstance.post("/cart/updateVariant", params, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi API updateCartVariantApi:", error?.response?.data || error);
    throw error;
  }
};