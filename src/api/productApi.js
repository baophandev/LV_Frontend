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

export const getProductReview = async ({
  pageNumber = 0,
  pageSize = 6,
  productId,
}) => {
  try {
    const response = await axiosInstance.get("/review", {
      params: {
        page: pageNumber,
        size: pageSize,
        productId: productId,
        isShowed: "true",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductDiscountedApi = async ({
  pageNumber = 0,
  pageSize = 0,
}) => {
  try {
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
};

export const fecthProductFilterApi = async ({ categoryId, sortDirection }) => {
  try {
    const response = await axiosInstance.get("/product/filter", {
      params: {
        status: "ACTIVE",
        categoryId: categoryId ? categoryId : null,
        sortDirection: sortDirection ? sortDirection : "DESC",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const compareProductsApi = async (productId1, productId2) => {
  try {
    const [
      product1Response,
      product2Response,
      attribute1Response,
      attribute2Response,
    ] = await Promise.all([
      axiosInstance.get(`/product/${productId1}`),
      axiosInstance.get(`/product/${productId2}`),
      axiosInstance.get(`/product/${productId1}/attribute`),
      axiosInstance.get(`/product/${productId2}/attribute`),
    ]);

    return {
      product1: product1Response.data,
      product2: product2Response.data,
      attributes1: attribute1Response.data,
      attributes2: attribute2Response.data,
    };
  } catch (error) {
    throw error;
  }
};
