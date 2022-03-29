import React from 'react'
import './footer.css'
import logo from '../../img/logoVerticalBlanco.svg'

function Footer() {
    return (  
        <div className='footer'>
            <div className='row'>
                <div className="col-lg-2 col-md-3 col-sm-12">
                    <img src={logo} className="img-fluid" alt="" />
                </div>
                <div className="col-lg-8 d-flex justify-content-center mt-4">
                    <div className="txt">Copyright © 2022. Todesco Natalia Sabrina 111957@tecnicatura.frc.utn.edu.ar</div>
                </div>
            </div>
            <div className="row"></div>
        </div>
    );
}

export default Footer;