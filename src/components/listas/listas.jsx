import React from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./listas.css";
import Favoritos from "./favoritos";
import Likes from "./likes";
import MisProyectos from "./misProyectos";

function Listas() {
  return (
    <div className="listas">
      <Navbar></Navbar>
      <div className="container my-3" style={{ minHeight: "62.5vh" }}>
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>
              <span className="shine">[</span> MIS LISTAS{" "}
              <span className="shine">]</span>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h3>
              <i className="bi bi-hand-thumbs-up-fill mr-3"></i>
              ME GUSTA
            </h3>
            <div className="list">
              <Likes></Likes>
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="bi bi-heart-fill mr-3"></i>
              MIS FAVORITOS
            </h3>
            <div className="list">
              <Favoritos></Favoritos>
            </div>
          </div>
          <div className="col-lg-4">
            <h3>
              <i className="bi bi-images mr-3"></i>
              MIS PROYECTOS
            </h3>
            <div className="list">
              <MisProyectos></MisProyectos>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Listas;
