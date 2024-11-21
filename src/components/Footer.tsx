import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: 'dimgrey',
            padding: '100px', // Make the footer taller
            textAlign: 'center',
            position: 'fixed', // Make it fixed to always be at the bottom
            left: '290px', // Adjust to the sidebar's width
            bottom: 0, // Stick it to the bottom
            width: 'calc(100% - 290px)', // Full width to overlap the sidebar
            zIndex: 1 // Ensure it overlaps the sidebar
        }}>
            <p>Temp data</p>
        </footer>
    );
};

export default Footer;