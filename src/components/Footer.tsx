import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: '#f8f9fa',
            padding: '100px', // Make the footer taller
            textAlign: 'center',
            position: 'fixed', // Make it fixed to always be at the bottom
            left: 0, // Align it with the left side of the screen
            bottom: 0, // Stick it to the bottom
            width: '100%', // Full width to overlap the sidebar
            zIndex: 1 // Ensure it overlaps the sidebar
        }}>
            <p>&copy; 2024 My Website. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;