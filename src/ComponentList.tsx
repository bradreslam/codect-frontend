import {useState, useEffect, useRef, forwardRef} from 'react';
import { getIds, getImage, getDescription } from './api'; // Import your API functions
import spinner from './assets/blocks-wave.svg';

const ComponentList = forwardRef(() => {
    const [items, setItems] = useState<
        { id: string; details: { endPoints: string; feature: string; description: string }; image: string }[]
    >([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState<string | null>(null); // State to manage errors
    const [page, setPage] = useState(0);
    const [idList, setIdList] = useState<string[]>([]);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null); // Ref for the last item

    const ITEMS_PER_PAGE = 10; // Number of items to load per "page"

    // Fetch a specific page of items
    const fetchItems = async (page: number) => {
        try {
             // Fetch ALL IDs (you could paginate this at the backend too)
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentIds = idList.slice(start, end);

            const fetchedItems = await Promise.all(
                currentIds.map(async (id: string) => {
                    const [image, details] = await Promise.all([
                        getImage(id),
                        getDescription(id),
                    ]);
                    return { id, details, image };
                })
            );

            setItems((prevItems) => [...prevItems, ...fetchedItems]);
        } catch (error) {
            setError('Error fetching data.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function fetchAndSetIdList() {
            try {
                const resolvedIdList = await getIds();
                if (isMounted) {
                    console.log('Setting ID List:', resolvedIdList);
                    setIdList(resolvedIdList);
                }
            } catch (error) {
                console.error('Error setting ID list:', error);
            }
        }

        fetchAndSetIdList();

        fetchItems(page);
        return () => {
            isMounted = false; // Prevent state update after unmount
        };
    }, []);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect(); // Cleanup previous observer

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && items[0].id == idList[0].toString()) {
                setPage((prevPage) => {
                    const nextPage = prevPage + 1;
                    fetchItems(nextPage);
                    return nextPage;
                });
            }
        });

        if (lastItemRef.current) observerRef.current.observe(lastItemRef.current);
    }, [items]); // Run this effect whenever `items` changes

    if (loading) {
        return <div style={{ position: 'relative', textAlign: 'center' }}>
            <img src={spinner}/>
            Loading...
        </div>; // Render a loading state
    }

    if (error) {
        return <div>{error}</div>; // Render error message if data fetching fails
    }

    return (
        <div data-cy={"componentList"}>
                {items.map((item, index) => (
                    <div key={item.id} style={{display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '12px',
                        backgroundColor: 'dimgrey',
                        paddingLeft: '10px',
                        borderRadius: '10px'}}
                        ref={index === items.length - 1 ? lastItemRef : null}>
                        {/* Row with EndPoints, Feature, and Image */}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '-50px'}}>
                            {/* Left Section: EndPoints and Feature */}
                            <div style={{flex: 1, paddingRight: '5px', marginBottom: '50px'}}>
                                <p><strong>EndPoints:</strong> {item.details.endPoints}</p>
                                <p><strong>Feature:</strong> {item.details.feature}</p>
                            </div>
                            {/* Right Section: Image */}
                            <div  style={{flex: 1, width: '200px', height: 'auto', marginBottom: '-30px'}}>
                                <div
                                    dangerouslySetInnerHTML={{__html: item.image}}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                        </div>
                        {/* Description below */}
                        <div style={{textAlign: 'left'}}>
                            <p>{item.details.description}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
});

export default ComponentList;