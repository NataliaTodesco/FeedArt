import React from "react";
import inicio from "../../img/inicio.svg";
import logo from "../../img/logoMancha.svg";
import { Button } from "react-bootstrap";
import "./inicio.css";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Inicio() {
 const _exportPdf = () => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
       document.body.appendChild(canvas); 
       const imgData = canvas.toDataURL('image/png');
       const pdf = new jsPDF();
       pdf.addImage(imgData, 'PNG', 0, 0);
       pdf.save("download.pdf"); 
   });

}
  return (
    <div className="start">
      {/* <button onClick={() => window.print()}>PRINT</button>
      <button onClick={() => _exportPdf()}>EXPORT</button> */}
      <img src={logo} className="logo" alt="" />
      <div className="container" id="capture">
        <div className="eclipse"></div>
        <div className="row">
          <div className="col-lg-6">
            <h1 className="head">
              Feed<span className="art">Art</span>
            </h1>
            <p className="texto">
              FeedArt es una página web para que estudiantes de artes visuales y
              otros creadores de contenido compartan sus obras de manera virtual
              al mundo y recibir feedback, ademas de poder vender las mismas.
            </p>
            <p className="texto">
              Para disfrutar de FeedArt primero deberá iniciar sesión:
            </p>
            <Link to='/login' className="boton">Iniciar Sesion</Link>
          </div>
          <div className="col-lg-6 text-center">
            <img className="undraw img-fluid" src={inicio} alt="" />
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <div className="tablero row py-4 px-5 g-2">
              <div className="col-lg-3 col-sm-5">
                <div className="card">
                  <i className="bi bi-eye"></i>
                  <br />
                  <p>Ve los proyectos de distintos artistas</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-5">
                <div className="card">
                  <i className="bi bi-image"></i>
                  <br />
                  <p>Comparte tus propias creaciones</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-5">
                <div className="card">
                  <i className="bi bi-chat-dots"></i>
                  <br />
                  <p>Expresa tus opiniones e interpretaciones</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-5">
                <div className="card">
                  <i className="bi bi-heart"></i>
                  <br />
                  <p>Ten un listado de tus obras favoritas </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
