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
            <Footer></Footer>
        </div>
    );
}

export default Inicio;