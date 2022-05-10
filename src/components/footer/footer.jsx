import React from 'react'
import './footer.css'
import logo from '../../img/logoVerticalBlanco.svg'
import { Link } from 'react-router-dom';

function Footer() {
    return (  
        <div className='footer'>
            <div className="container-fluid">
            <div className='row'>
                <div className="col-lg-2 col-md-3 col-sm-12">
                    <img src={logo} className="img-fluid" alt="" />
                </div>
                <div className="col-lg-8 mt-5">
                    <div className="d-flex justify-content-center">
                        <div className="txt">Copyright © 2022. Todesco Natalia Sabrina 111957@tecnicatura.frc.utn.edu.ar</div>
                    </div>
                    <div className="d-flex justify-content-center">
                       <Link to='/t&c'><a className='terminos mr-3'>T&C</a></Link> | <Link to='/contact'><a className='terminos ml-3'>CONTÁCTO</a></Link>
                    </div>
                </div>
            </div>
            <div className="row"></div>
            </div>
        </div>
    );
}

export default Footer;