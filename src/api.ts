import axios from 'axios';

const api = axios.create({
    baseURL: 'https:/localhost:7278',  // Your .NET API URL
});
export const getDescription = async (id: string) => {
    try {
        const response = await api.get(`/api/components/${id}/ComponentInfo`);

        return response.data;

    } catch (error) {
        console.error('Error fetching component info:', error);
        return null;  // Return null in case of error
    }
};
export const getIds = async () => {
    try {
        const response = await api.get(`/api/components/getAllComponentIds`);

        return response.data;

    } catch (error) {
        console.error('Error fetching component ids:', error);
        return null;  // Return null in case of error
    }
};
export const getImage = async (id: string) => {
    try {
        const response = await api.get(`/api/components/${id}/image.svg`);

        return response.data;

    } catch (error) {
        console.error('Error fetching base64 image:', error);
        return null;  // Return null in case of error
    }
};