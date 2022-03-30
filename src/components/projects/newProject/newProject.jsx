import React from 'react';
import Footer from '../../footer/footer';
import Navbar from '../../Navbar/navbar';
import './newProject.css'

function newProject() {
    return (  
        <div className='newProject'>
            <Navbar></Navbar>
            <div className="container my-3">
                <h1>Nuevo Proyecto</h1>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default newProject;