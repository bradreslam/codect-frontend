import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: 'dimgrey',
            padding: '10px', // Make the footer taller
            textAlign: 'center',
            position: 'fixed',
            left: '290px', // Adjust to the sidebar's width
            bottom: 0, // Stick it to the bottom
            width: 'calc(100% - 290px)', // Full width to overlap the sidebar
            zIndex: 1, // Ensure it overlaps the sidebar
            alignItems: 'center',
        }}>
            <ul
                style={{
                    listStyleType: 'none',
                    margin: '0',
                    padding: '0',
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gap: '10px',
                    overflowX: 'auto',
                    overflow: 'visible'
                }}
                data-target="componentContainer"
            ></ul>

        </footer>
    );
};

export default Footer;