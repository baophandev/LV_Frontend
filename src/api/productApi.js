import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const USER_ID = window.localStorage.getItem("USER_ID");

export const fetchProducstApi = async ({ pageNumber = 0, pageSize = 0 }) => {
  const response = await axiosInstance.get("/product/status", {
    params: {
      status: "ACTIVE",
      page: pageNumber,
      size: pageSize,
    },
  });
  return response.data;
};

export const fetchProducstByCategoryIdApi = async ({
  categoryId,
  pageNumber = 0,
  pageSize = 0,
}) => {
  const response = await axiosInstance.get(`product/category/${categoryId}`, {
    params: {
      status: "ACTIVE",
      page: pageNumber,
      size: pageSize,
    },
  });
  return response.data;
};

export const fetchProductApi = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}`, {
    params: {
      userId: USER_ID,
    },
  });
  return response.data;
};

export const fetchAttributeApi = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}/attribute`);
  return response.data;
};

export const getVariantDiscount = async (variantId) => {
  try {
    const response = await axiosInstance.get(
      `/product/discount/getActive/${variantId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductReview = async ({ pageNumber = 0, pageSize = 6, productId }) => {
  try{
    const response = await axiosInstance.get('/review', {
      params:{
        page: pageNumber,
        size: pageSize,
        productId: productId
      }
    })
    return response.data;
  }catch(error){
    throw error;
  }
}

export const getProductDiscountedApi = async ({ pageNumber = 0, pageSize = 0 }) => {
  try{
    const response = await axiosInstance.get("/product/discounted", {
      params: {
        page: pageNumber,
        size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fecthProductFilterApi = async ({categoryId, sortDirection}) => {
  try{
    const response = await axiosInstance.get('/product/filter', {
      params: {
        status: "ACTIVE",
        categoryId: categoryId ? categoryId : null,
        sortDirection: sortDirection ? sortDirection : "DESC",
      }
    })
    return response.data;
  }catch(error){
    throw error;
  }
}

export const searchProductApi = async ({ name }) => {
  try {
    const response = await axiosInstance.get("/product/search", {
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentBannerApi = async () => {
  try {
    const response = await axiosInstance.get("/banner/current");
    return response.data;
  } catch (err) {
    throw err;
  }
};