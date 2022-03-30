import React, { useEffect } from 'react';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar'
import "./inicio.css"

function Inicio() {
    // const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        
    }, []);
    return (  
        <div className='inicio'>
            <Navbar></Navbar>
            <div className="container my-3">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>INICIO</h1>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Inicio;