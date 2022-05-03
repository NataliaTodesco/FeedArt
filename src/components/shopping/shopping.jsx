import React from 'react'
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import Compra from './listas/compras';
import "./shopping.css"
import Ventas from './listas/ventas';

function Shopping() {
    return (  
        <div className='shopping'>
            <Navbar></Navbar>
            <div className="container my-3" style={{ minHeight: "62.5vh" }}>
            <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>COMPRA / VENTA</h1>
                    </div>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-5">
                        <h3>
                            <i className="bi bi-bag-check-fill mr-3"></i>
                            MIS COMPRAS
                        </h3> 
                        <div className="list">
                            <Compra></Compra>
                        </div>
                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-5">
                        <h3>
                            <i className="bi bi-bag-dash-fill mr-3"></i>
                            MIS VENTAS
                        </h3>
                        <div className="list">
                            <Ventas></Ventas>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Shopping;