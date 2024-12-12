import { useState, useEffect } from 'react';
import { getIds, getImage, getDescription } from './api'; // Import your API functions

const ComponentList = () => {
    const [items, setItems] = useState<
        { id: string; details: { endPoints: string; feature: string; description: string }; image: string }[]
    >([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState<string | null>(null); // State to manage errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ids = await getIds(); // Fetch IDs
                const fetchedItems = await Promise.all(
                    ids.map(async (id: string) => {
                        const [image, details] = await Promise.all([
                            getImage(id), // Fetch image for the ID
                            getDescription(id), // Fetch description for the ID
                        ]);
                        return { id, details, image };
                    })
                );
                setItems(fetchedItems); // Store fetched items in state
            } catch (error) {
                setError('Error fetching data.'); // Set error message if fetching fails
                console.error(error);
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
        <div data-cy={"componentList"}>
            {items.length > 0 ? (
                items.map(({ id, details, image }) => (
                    <div key={id} style={{display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '12px',
                        backgroundColor: 'dimgrey',
                        paddingLeft: '10px',
                        borderRadius: '10px'}}>
                        {/* Row with EndPoints, Feature, and Image */}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '-50px'}}>
                            {/* Left Section: EndPoints and Feature */}
                            <div style={{flex: 1, paddingRight: '5px', marginBottom: '50px'}}>
                                <p><strong>EndPoints:</strong> {details.endPoints}</p>
                                <p><strong>Feature:</strong> {details.feature}</p>
                            </div>
                            {/* Right Section: Image */}
                            <div  style={{flex: 1, width: '200px', height: 'auto', marginBottom: '-30px'}}>
                                <div
                                    dangerouslySetInnerHTML={{__html: image}}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                        </div>
                        {/* Description below */}
                        <div style={{textAlign: 'left'}}>
                            <p>{details.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div>No items to display</div>
            )}
        </div>
    );
};

export default ComponentList;