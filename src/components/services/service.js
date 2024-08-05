import axios from "axios";
const baseURL = "http://localhost:5001/api/v1/"
const api = axios.create({
  baseURL: baseURL,
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

export const apiAuth = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response;
  } catch (error) {
    if (error.response.status === 403 || error.response.status === 403) {
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
    const token = localStorage.getItem("refreshtoken")
    const userid = localStorage.getItem("userid")
    const response = await axios.get(`${baseURL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {userid:userid} 
    })
    return  response.data
  } catch (error) {
    if (error.response.status === 403) {
      return { status: error.response.status };
    }
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
