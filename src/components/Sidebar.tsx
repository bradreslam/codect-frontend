import React, { useState, useEffect } from 'react';
import { X } from "@phosphor-icons/react";
import ComponentList from "../ComponentList.tsx";

const Sidebar: React.FC = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [ContactPoints, setSelectedOptions] = useState<string[]>([]);
    const [Feature, setSelectedDropdownOption] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

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
            const response = await fetch('https://localhost:7278/api/components/createComponent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convert the data to JSON
            });

            if (!response.ok) new Error('Failed to submit form');

            const result = await response.json(); // Process the response if needed
            console.log("Form submitted successfully:", result);
            // Optionally, close the overlay after submission
            toggleOverlay();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('https://localhost:7278/api/components/featureList');
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
                    <ComponentList/>
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