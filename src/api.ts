import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7278',  // Your .NET API URL
});
export const getDescription = async (id: string) => {
    try {
        const response = await api.get(`/components/${id}`);

        return response.data;

    } catch (error) {
        console.error('Error fetching component info:', error);
        return null;  // Return null in case of error
    }
};
export const getIds = async (): Promise<string[]> => {
    try {
        const response = await api.get(`/components/ids`);

        const data = response.data;

        if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
            return data as string[]; // Safe to assert
        }

        throw new Error("Id list is invalid");
    } catch (error) {
        console.error('Error fetching component ids:', error);
        throw error;
    }
};
export const getImage = async (id: string) => {
    try {
        const response = await api.get(`/components/${id}/image`);

        return response.data;

    } catch (error) {
        console.error('Error fetching base64 image:', error);
        return null;  // Return null in case of error
    }
};