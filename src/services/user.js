import axios from "axios";


export const API_BASE_URL = "https://asset-requisition-backend.onrender.com/";


export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const userService = {

  userRegister: async (user) => {
    try {
      const response = await axiosInstance.post("/user/register", user);
      return response.data;
    } catch (error) {
      handleError(error, "Registration failed");
    }
  },


  userLogin: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}user/login`, data, {
        headers: { "Content-Type": "application/json" },
      });
  
      const token = response.data.token;
      const user = response.data.user; 
      const role = user?.role; 
      const identity = user?.id; 
  

      if (token) {
        localStorage.setItem("token", token); 
      }
      if (role) {
        localStorage.setItem("userRole", role);
      }
      if (identity) {
        localStorage.setItem("userId", identity); 
      }
  
      return response.data;
    } catch (error) {
      handleError(error, "Login failed");
    }
  },
  updateProfile: async (profileData) => { 
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}user/profile/`,
        profileData,  
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Token ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update profile");
    }
  },

  allUsers: async () => {
    try {
      const response = await axiosInstance.get("/user/all/");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch users");
    }
  },

  // Update Password
  updatePassword: async (data) => {
    try {
      const response = await axiosInstance.put("/user/updatepassword", data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update password");
    }
  },

  // Get User Details
  userDetails: async () => {
    try {
      const response = await axiosInstance.get("/user/userdetails");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to get user details");
    }
  },
  allUserDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`user/alldetails/${id}/`);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to get user details");
    }
  },

  // Change Role
  changeRole: async (data) => {
    try {
      const response = await axiosInstance.post("/user/changerole", data);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to change role");
    }
  },

  // Delete User
  userDelete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}/delete`);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to delete user");
    }
  },

  // Fetch User Assets
  userAssets: async () => {
    try {
      const response = await axiosInstance.get("/user/assets");
      return response.data;
    } catch (error) {
      handleError(error, "Failed to fetch user assets");
    }
  },
  userLogout: async () => {
    try {
      const response = await axiosInstance.post("/user/logout");
      
      // Clear client-side storage and headers
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      
      // Remove the authorization header from axios instance
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      return response.data;
    } catch (error) {
      // Even if server logout fails, force client-side cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      handleError(error, "Failed to logout user");
    }
  }
};

// Handle Errors
const handleError = (error, defaultMessage) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
  throw new Error(defaultMessage || "An unexpected error occurred");
};
