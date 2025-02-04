import axios from "axios";
import { axiosInstance } from "./user"; 

export const requestsService = {
    getRequests: async () => {
        try {
            const response = await axiosInstance.get('requests');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while fetching requests');
        }
    },

    employeeRequests: async () => {
        try {
            const response = await axiosInstance.get('requests/user');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while fetching requests');
        }
    },

    requestAction: async (id, data) => {
        try {
            const response = await axiosInstance.patch(`requests/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while updating the requests');
        }
    },

    deleteRequest: async (id) => {
        try {
            const response = await axiosInstance.delete(`requests/${id}/delete`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while deleting the requests');
        }
    },

    // New functions for return requests
    employeeReturnAsset: async (requestId) => {
        try {
            const response = await axiosInstance.post(`requests/${requestId}/return/`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while submitting the return request');
        }
    },

    adminHandleReturn: async (requestId, action) => {
        try {
            const response = await axiosInstance.patch(`requests/${requestId}/handle-return/`, { action });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while handling the return request');
        }
    },

    adminPendingReturnRequests: async () => {
        try {
            const response = await axiosInstance.get('requests/pending-returns/');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || error.message;
                throw new Error(message);
            }
            throw new Error('An unexpected error occurred while fetching pending return requests');
        }
    },
};