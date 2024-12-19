import React, {useEffect, useState, useRef, Suspense} from 'react';
import {X} from "@phosphor-icons/react";
import ComponentList from "../ComponentList.tsx";
import Toast from "typescript-toastify";

const Sidebar: React.FC = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [ContactPoints, setSelectedOptions] = useState<string[]>([]);
    const [Feature, setSelectedDropdownOption] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
    const componentListRef = useRef<{ updateData: (id: string) => Promise<void> }>(null);

    const options = ["N", "E", "S", "W"];

    const toggleOverlay = () => {
        setIsOverlayOpen(!isOverlayOpen);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = {
            ContactPoints,
            Feature,
        };

        try {
            const response = await fetch('https://localhost:7278/components/new-component', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convert the data to JSON
            });

            // Handle error responses
            if (!response.ok) {
                // Read response body for error details
                const errorDetails = await response.json();

                // Safely extract the error message from the response
                const errorMessage = errorDetails?.message || "An unknown error occurred";

                new Toast({
                    position: "top-right",
                    toastMsg: `Error: ${errorMessage}`,
                    autoCloseTime: 5000,
                    canClose: true,
                    showProgress: true,
                    pauseOnHover: true,
                    pauseOnFocusLoss: true,
                    type: "error",
                    theme: "dark",
                });
                return;
            }

            // Success notification
            new Toast({
                position: "top-right",
                toastMsg: "Component was created successfully",
                autoCloseTime: 2000,
                canClose: true,
                showProgress: true,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                type: "success",
                theme: "dark",
            });

            // Call `updateData` if the `componentListRef` is available
            if (componentListRef.current) {
                await componentListRef.current.updateData(response.toString()); // Pass the appropriate ID
            }

            toggleOverlay();
        } catch (error) {
            // Handle unexpected errors
            console.error("Error during submission:", error);
            new Toast({
                position: "top-right",
                toastMsg: `Unexpected error: ${error}`,
                autoCloseTime: 2000,
                canClose: true,
                showProgress: true,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                type: "error",
                theme: "dark",
            });
        }
    };


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('https://localhost:7278/features');
                if (!response.ok) new Error("Failed to fetch options");
                const data: string[] = await response.json(); // Assuming the response is a list of strings
                setDropdownOptions(data); // Update state with the fetched options
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };

        fetchOptions();
    }, []);


    const handleCheckboxChange = (option: string) => {
        setSelectedOptions(prevSelected =>
            prevSelected.includes(option)
                ? prevSelected.filter(item => item !== option) // Remove if already selected
                : [...prevSelected, option] // Add if not selected
        );
    };

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDropdownOption(event.target.value);
    };

    return (
        <>
            {/* Main Sidebar */}
            <aside style={{
                width: '250px',
                height: '100vh',
                backgroundColor: 'gray',
                color: '#fff',
                padding: '20px',
                position: 'fixed',
                left: 0,
                top: 0
            }}>
                <button
                    onClick={toggleOverlay}
                    data-cy="toggle-overlay"
                    data-is-open={isOverlayOpen}
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: 'blue',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Open component creator
                </button>
                <div style={{marginTop: '20px', overflowY: 'auto', maxHeight: '90%'}}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ComponentList/>
                    </Suspense>
                </div>
            </aside>

            {/* Overlay Sidebar for Data Input */}
            {isOverlayOpen && (
                <aside style={{
                    width: '250px',
                    height: '100vh',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '20px',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                }}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                        <button
                            type="button"
                            onClick={toggleOverlay}
                            style={{
                                padding: '5px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                marginRight: '10px' // Add some spacing between the button and the heading
                            }}
                        >
                            <X weight="bold" size={30}/>
                        </button>
                        <h2 style={{margin: 0}}>Input Data</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Dropdown Menu */}
                        <div style={{marginBottom: '10px'}}>
                            <h3>Choose an Option:</h3>
                            <select
                                data-cy={"Feature-select"}
                                value={Feature}
                                onChange={handleDropdownChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#555',
                                    color: '#fff',
                                    border: '1px solid #888'
                                }}
                            >
                                <option value="" disabled>Select an option</option>
                                {dropdownOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Checkbox Options */}
                        <div style={{marginBottom: '10px'}}>
                            <h3>Select wire ends:</h3>
                            {options.map(option => (
                                <label key={option} style={{display: 'block', marginBottom: '5px'}}>
                                    <input
                                        data-cy={"endpoint-select"}
                                        type="checkbox"
                                        value={option}
                                        checked={ContactPoints.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                    />
                                    <span style={{marginLeft: '8px'}}>{option}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            data-cy={"submit-component"}
                            type="submit"
                            style={{
                                padding: '5px',
                                backgroundColor: 'green',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Create component
                        </button>
                    </form>
                </aside>
            )}
        </>
    );
};

export default Sidebar;