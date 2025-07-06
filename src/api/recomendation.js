import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

export const getProductRecommendations = async ({ userId }) => {
  try {
    const token = localStorage.getItem("authToken"); // Di chuyển vào trong hàm

    const response = await axiosInstance.get(
      `/recommendations/user/${userId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};