import React, { useEffect } from 'react';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar'
import "./inicio.css"
import { Link } from 'react-router-dom'

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
                <div className="row">
                    <Link to={"/project/PGBE7PEBI1RWUQaHC6jQ"}>
                    {/* <Link to={"/usuario/" + user.id}> */}
                    <button className="btn btn-block btn-dark">Ver mas</button>
                    </Link>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Inicio;