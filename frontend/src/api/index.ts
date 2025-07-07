// frontend/src/api/index.ts
import axios from "axios";
import { apiConfig } from "../config/api.config"; 
import { toast } from "../common/components/ui/use-toast";

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers, 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting errors (429)
    if (error.response && error.response.status === 429) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Too many requests. Please try again after 5 minutes.";

      toast({
        title: "Rate Limit Exceeded",
        description: errorMessage,
        variant: "destructive",
      });
    } else if (error.response && error.response.status >= 500) {
      toast({
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
        variant: "destructive",
      });
    } else if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status !== 429
    ) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Request failed. Please check your input and try again.";

      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    // Handle network errors
    else if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
      toast({
        title: "Network Error",
        description:
          "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    }
    // Handle timeout errors
    else if (error.code === "ECONNABORTED") {
      toast({
        title: "Request Timeout",
        description: "The request took too long to complete. Please try again.",
        variant: "destructive",
      });
    }
    // Handle other unexpected errors
    else {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);
export default apiClient;
