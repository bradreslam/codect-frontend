import { useState, useEffect, useRef, forwardRef } from "react";
import {signalRService } from "./SignalRService"; // Import SignalRService
import spinner from "./assets/blocks-wave.svg";

const ComponentList = forwardRef(() => {
    const [items, setItems] = useState<
        { id: string; details: { endPoints: string; feature: string; description: string }; image: string }[]
    >([]);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [idList, setIdList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    const ITEMS_PER_PAGE = 10;

    const loadingRef = useRef(false);

    const fetchItems = async (page: number, idList: string[]) => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            const start = page * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentIds = idList.slice(start, end);

            const fetchedItems = await Promise.all(
                currentIds.map(async (id) => {
                    const imagePromise = new Promise<string>((resolve) => {
                        signalRService.sendComponentImage(id);
                        signalRService.onReceiveComponentImage((imageId, image) => {
                            if (imageId === id) resolve(image);
                        });
                    });

                    const detailsPromise = new Promise<{
                        endPoints: string;
                        feature: string;
                        description: string;
                    }>((resolve) => {
                        signalRService.sendComponentInfo(id);
                        signalRService.onReceiveComponentInfo((infoId, info) => {
                            if (infoId === id) {
                                resolve({
                                    endPoints: info["endPoints"],
                                    feature: info["feature"],
                                    description: info["description"],
                                });
                            }
                        });
                    });

                    return {
                        id,
                        image: await imagePromise,
                        details: await detailsPromise,
                    };
                })
            );

            setItems((prevItems) => [...prevItems, ...fetchedItems]);
        } catch (error) {
            setError("Error fetching data.");
            console.error(error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    const initSignalR = async () => {
        try {
            await signalRService.startConnection();

            // Fetch IDs when connection is established
            await signalRService.sendIdList();
            signalRService.onReceiveIdList((ids) => {
                setIdList(ids);
                fetchItems(page, ids); // Fetch the first page
            });

            signalRService.onReceiveError((err) => {
                setError(err);
            });
        } catch (err) {
            console.error("Error initializing SignalR:", err);
            setError("Failed to connect to the server.");
        }
    };
    
    useEffect(()=>{
        initSignalR()

    }, []);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (items.length < idList.length) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchItems(nextPage, idList);
                        return nextPage;
                    });
                }
            }
        });

        if (lastItemRef.current) observerRef.current.observe(lastItemRef.current);

    }, [items, idList]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div data-cy="componentList">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "12px",
                        backgroundColor: "dimgrey",
                        paddingLeft: "10px",
                        borderRadius: "10px",
                    }}
                    ref={index === items.length - 1 ? lastItemRef : null}
                >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "-50px" }}>
                        <div style={{ flex: 1, paddingRight: "5px", marginBottom: "50px" }}>
                            <p>
                                <strong>EndPoints:</strong> {item.details.endPoints}
                            </p>
                            <p>
                                <strong>Feature:</strong> {item.details.feature}
                            </p>
                        </div>
                        <div style={{ flex: 1, width: "200px", height: "auto", marginBottom: "-30px" }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: item.image }}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <p>{item.details.description}</p>
                    </div>
                </div>
            ))}
            {loading && (
                <div style={{ position: "relative", textAlign: "center", marginBottom: "12px" }}>
                    <img src={spinner} alt="Loading..." />
                    Loading...
                </div>
            )}
        </div>
    );
});

export default ComponentList;