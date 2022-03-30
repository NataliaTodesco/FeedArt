import React from 'react'
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import "./listas.css"

function Listas() {
    return (  
        <div className='listas'>
            <Navbar></Navbar>
            <div className="container my-3">
                <h1>Mis listas</h1>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Listas;