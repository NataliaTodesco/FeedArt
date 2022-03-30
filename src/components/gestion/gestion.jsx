import React from 'react';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import './gestion.css'

function Gestion() {
    return (  
        <div className='gestion'>
            <Navbar></Navbar>
            <div className="container my-3">
                <h1>Gestion</h1>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Gestion;