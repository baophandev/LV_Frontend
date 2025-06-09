import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const token = localStorage.getItem("authToken");

export const createReviewApi = async (formData) => {
  try {
    const response = await axiosInstance.post("/review", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}