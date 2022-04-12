import React from 'react'
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import { Link } from 'react-router-dom'
import {  Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import "./listas.css"
import { borrarProyecto } from '../../firebaseConfig';

function Listas() {
    function eliminar(id) {
        Modal.confirm({
            title: 'Eliminar',
            icon: <ExclamationCircleOutlined />,
            content: '¿Estas seguro de que deseas eliminar este Proyecto?',
            okText: 'Eliminar',
            cancelText: 'Cancelar',
            onOk() {
                borrarProyecto(id)
            }
        });
      }

    return (  
        <div className='listas'>
            <Navbar></Navbar>
            <div className="container my-3">
            <div className="row">
                    <div className="col-lg-12 text-center">
                        <h1 style={{fontWeight: '800'}}>MIS LISTAS</h1>
                    </div>
                </div>
                <div className="row">
                    <Link to={"/project/edit/PGBE7PEBI1RWUQaHC6jQ"}>
                    {/* <Link to={"/usuario/" + user.id}> */}
                        <Button type="primary" shape="round" icon={<EditOutlined />} size={"large"} />                        
                    </Link>
                    <Button onClick={e => {eliminar("O9feBPKesCUzdTEEE7mw")}} type="primary" shape="round" icon={<DeleteOutlined />} danger size={"large"} />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Listas;