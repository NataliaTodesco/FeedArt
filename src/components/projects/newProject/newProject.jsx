import React from 'react';
import Footer from '../../footer/footer';
import Navbar from '../../Navbar/navbar';
import './newProject.css'

function newProject() {
    return (  
        <div className='newProject'>
            <Navbar></Navbar>
            <div className="container my-3">
            <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>NUEVO PROYECTO</h1>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default newProject;