import { Avatar, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { borrarUser, elminarDoc, restoreSessionAction } from '../../firebaseConfig';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import "./usuario.css"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'


function Usuario() {
    const [usuario, setUsuario] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setUsuario(restoreSessionAction())
    }, []);

    function eliminar() {
        // Modal.confirm({
        //     title: '¿Estas seguro de que deseas eliminar esta cuenta?',
        //     icon: <ExclamationCircleOutlined />,
        //     content: 'Al eliminar su cuenta tambien se borraran sus proyectos y listas.',
        //     okText: 'Eliminar',
        //     cancelText: 'Cancelar',
        //     onOk() {
        //         borrarUser()
        //         navigate('/')
        //     }
        // });
        elminarDoc()
      }
    
    return (  
        <div className='user'>
            <Navbar></Navbar>
            <div className="container">
            <div className="row">
                    <div className="col-lg-12 text-center mt-1">
                        <h1 style={{fontWeight: '800'}}>MI CUENTA</h1>
                    </div>
                </div>
                <div className="row text-center d-flex justify-content-center">
                    <div className="col-lg-6">
                        <div className="card mb-5 mt-3 p-5">
                            <div>
                                <Avatar alt="Profile Picture" size={145} src={usuario.photoURL} className="img-fluid"/>
                            </div>
                            <h1 className='mt-4'>{usuario.displayName}</h1>
                            <h4>{usuario.email}</h4>
                            <div className='float-left mt-4'>
                            <Button type="primary" shape="round" icon={<EditOutlined />} size={"large"} />
                            <Button onClick={eliminar} type="primary" shape="round" icon={<DeleteOutlined />} danger size={"large"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Usuario;