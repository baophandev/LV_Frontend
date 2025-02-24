import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const token = localStorage.getItem("authToken");

export const getMyInfoApi = async (token) => {
  try {
    const response = await axiosInstance.get("/user/myInfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserAddressApi = async ({ token, userId }) => {
  try {
    const response = await axiosInstance.get("/address", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAddressApi = async ({ address }) => {
  try {
    const response = await axiosInstance.post("/address", address, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const deleteAddressApi = async ({addressId}) => {
  try{
    const response = await axiosInstance.delete("/address", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        addressId: addressId
      }
    });
    return response;
  }catch(err) {
    console.log(err);
  }
}