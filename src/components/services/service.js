import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const apiAuth = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response;
  } catch (error) {
    if (error.response.status === 403) {
      return { status: error.response.status };
    }
  }
};

export const apiGet = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = "/login";
    }
    throw error;
  }
};

export const apiRefresh = async (url) => {
  try {
    api.interceptors.request.use(
      (req) => {
        const token = localStorage.getItem("refreshtoken");
        if (token) {
          req.headers["Authorization"] = `Bearer ${token}`;
        }
      },
    );
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      // window.location.href = "/login";
    }
    throw error;
  }
};

export const apiPost = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    if (error.response.status === 403) {
      window.location.href = "/login";
    }
    throw error;
  }
};

export default api;
