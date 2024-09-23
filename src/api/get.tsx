import axios from 'axios';

const api = axios.create({
    baseURL: 'https:/localhost:7278',  // Your .NET API URL
});
export const getDataFromApi = async () => {
    try {
        const response = await api.get('/api/ComponentController');

        // Assuming response.data is an array or an object with an array property
        return Array.isArray(response.data) ? response.data : Object.values(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array in case of error
    }
};