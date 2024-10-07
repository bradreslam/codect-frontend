import React from 'react';
import Sidebar from './components/Sidebar.tsx';
import Footer from './components/Footer.tsx';
import './App.css';

const App: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                <Footer />
            </div>
        </div>
    );
};

export default App;