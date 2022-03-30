import React from 'react'
import Footer from '../../footer/footer';
import Navbar from '../../Navbar/navbar';
import './project.css'

function Proyecto() {
    return (  
        <div className='project'>
            <Navbar></Navbar>
            <div className="container my-3">
                <h1>Proyecto</h1>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Proyecto;