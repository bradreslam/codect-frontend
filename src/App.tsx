import React from 'react';
import Sidebar from './components/Sidebar.tsx';
import Footer from './components/Footer.tsx';
import './App.css';
import './javascript/draggable_objects.js';
import './css/grid_style.css';
import './javascript/grid.jsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import MultiRezGrid from "./javascript/grid";

const App: React.FC = () => {
    return (
        <div style={{display: 'flex'}} id="page">
            <Sidebar/>
            <div style={{marginLeft: '250px', padding: '20px', width: '100%'}}>
                <Footer/>
                <MultiRezGrid/>
            </div>
        </div>
    );
};

export default App;