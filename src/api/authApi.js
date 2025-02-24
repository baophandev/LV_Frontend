import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

export const loginApi = async (phoneNumber, password) => {
  try {
    const response = await axiosInstance.post("/auth/token", {
      phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerApi = async (formData) => {
  try {
    const response = await axiosInstance.post("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
