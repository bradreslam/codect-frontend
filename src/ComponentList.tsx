import  { useState, useEffect } from 'react';
import { getDataFromApi } from './api/get'; // Import your API function

const DataListComponent = () => {
    const [dataList, setDataList] = useState<string[]>([]); // Specify the type as an array of strings
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error] = useState(null); // State to manage errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDataFromApi();
                setDataList(data); // Store the data in state
            } catch (error) {
                console.error( error);
            } finally {
                setLoading(false); // Turn off loading
            }
        };

        fetchData(); // Call the async function when the component mounts
    }, []); // Empty dependency array means this effect runs only once on mount

    if (loading) {
        return <div>Loading...</div>; // Render a loading state
    }

    if (error) {
        return <div>{error}</div>; // Render error message if data fetching fails
    }

    return (
        <ul>
            {dataList.map((item, index) => (
                <li key={index}>{item}</li>
                ))}
        </ul>
    );
};

export default DataListComponent;