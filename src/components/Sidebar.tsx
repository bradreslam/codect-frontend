import React from 'react';
import ComponentList from '../ComponentList';

const Sidebar: React.FC = () => {
    return (
        <aside style={{
            width: '250px',
            height: '100vh',
            backgroundColor: '#343a40',
            color: '#fff',
            padding: '20px',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <ComponentList />
            </ul>
        </aside>
    );
};

export default Sidebar;