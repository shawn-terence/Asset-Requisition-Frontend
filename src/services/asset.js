
import axios from "axios";
import { API_BASE_URL } from "./user";
import { axiosInstance } from "./user";


export const assetService={
    addAsset: async (formData) => {
        try {
            const token=localStorage.getItem('token')
            const response = await axios.post(
                `${API_BASE_URL}/assets/add`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", 
                        Authorization: `Token ${token}`, 
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message;
                throw new Error(message);
            }
            throw new Error("An unexpected error occurred while adding the asset");
        }
    },

    getAvailableAssets:async()=>{
        try {
            const response=await axiosInstance.get('assets/available/all/');
            return response.data;
        }
        catch (error) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || error.message;
                throw new Error(message)
            }
            throw new Error('An unexpected error occurred while fetching the assets')
        }
    },
    getAllAssets:async()=>{
        try {
            const response=await axiosInstance.get('assets/all/');
            return response.data;
        }
        catch (error) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || error.message;
                throw new Error(message)
            }
            throw new Error('An unexpected error occurred while fetching the assets')
        }
    },
    assetRequest:async(id)=>{
        try {
            const response=await axiosInstance.post(`assets/${id}/request/`);
            return response.data;
        }
        catch (error) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || error.message;
                throw new Error(message)
            }
            throw new Error('An unexpected error occurred while requesting the asset')
        }
    },
    deleteAsset:async(id)=>{
        try {
            const response=await axiosInstance.delete(`assets/${id}/delete`);
            return response.data;
        }
        catch (error) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || error.message;
                throw new Error(message)
            }
            throw new Error('An unexpected error occurred while deleting the asset')
        }
    },
        // Update Asset
    updateAsset: async (id, formData) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.patch(
                    `${API_BASE_URL}/assets/${id}/update/`, 
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data", 
                            Authorization: `Token ${token}`, 
                        },
                    }
                );
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || error.message;
                    throw new Error(message);
                }
                throw new Error("An unexpected error occurred while updating the asset");
            }
        },
}