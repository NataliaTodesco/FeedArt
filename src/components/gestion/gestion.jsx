import React from 'react';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import './gestion.css'

function Gestion() {
    return (  
        <div className='gestion'>
            <Navbar></Navbar>
            <div className="container my-3">
            <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>GESTIÓN</h1>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Gestion;