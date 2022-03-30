import React from 'react'
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import "./listas.css"

function Listas() {
    return (  
        <div className='listas'>
            <Navbar></Navbar>
            <div className="container my-3">
            <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>MIS LISTAS</h1>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Listas;