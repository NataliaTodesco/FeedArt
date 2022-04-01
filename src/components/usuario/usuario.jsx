import { Avatar, Button, Modal, Progress, Alert } from 'antd';
import React, { useState, useEffect } from 'react';
import { actualizarPerfil, borrarUser, restoreSessionAction, storage } from '../../firebaseConfig';
import Footer from '../footer/footer';
import Navbar from '../Navbar/navbar';
import "./usuario.css"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { ref,uploadBytes,getDownloadURL,uploadBytesResumable } from "firebase/storage";

function Usuario() {
    const [usuario, setUsuario] = useState({});
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [url, setUrl] = useState("");
    const [editar, setEditar] = useState(false);
    const [state, setState] = useState(0);

    useEffect(() => {
        setUsuario(restoreSessionAction())
        setNombre(restoreSessionAction().displayName)
        setUrl(restoreSessionAction().photoURL)
    }, []);

    function eliminar() {
        Modal.confirm({
            title: '¿Estas seguro de que deseas eliminar esta cuenta?',
            icon: <ExclamationCircleOutlined />,
            content: 'Al eliminar su cuenta tambien se borraran sus proyectos y listas.',
            okText: 'Eliminar',
            cancelText: 'Cancelar',
            onOk() {
                borrarUser()
                navigate('/')
            }
        });
      }

      const [alerta, setAlerta] = useState("");
      const [showAlert, setShowAlert] = useState(false);

    function actualizar(){
        if (nombre !== ""){
            setShowAlert(false)
            actualizarPerfil(nombre,url).then(res => {
                setUsuario({uid: restoreSessionAction().uid,email:restoreSessionAction().email,photoURL:url,displayName:nombre})
                setEditar(false)
            })
        } else {
            setAlerta("Complete el campo con su Nombre")
            setShowAlert(true)
        }
    }

      function onUpload(event) {
        const file = event.target.files[0]
        const storageRef = ref(storage, `fotos/${file.name}`);
    
        uploadBytes(storageRef, file);
    
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setState(Math.round(progress))
        },
        error => console.log(error),
        () => {
          getDownloadURL(ref(storage, `fotos/${file.name}`))
          .then((url) => {
            setUrl(url)
            setState(0)
          })
        })
      }

      const Demo = () => {   
        return (
            <div>
            {state === 0? 
                <div className="input-group my-4">
                <div className="custom-file">
                <input
                    type="file"
                    className="custom-file-input"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    onChange={e => onUpload(e)}
                />
                <label className="custom-file-label text-left" htmlFor="inputGroupFile04">Elegir imagen...</label>
                </div>
            </div> :
            <div style={{ width: "100%" }} className='my-3'>
                <Progress percent={state} size="medium" status="active exception" />
            </div>}
            </div>
        );
      };
    
    return (  
        <div className='user'>
            <Navbar></Navbar>
            <div className="container">
            <div className="row">
                    <div className="col-lg-12 text-center mt-3">
                        <h1 style={{fontWeight: '800'}}>MI CUENTA</h1>
                    </div>
                </div>
                <div className="row text-center d-flex justify-content-center">
                    <div className="col-lg-6">
                        <div className="card mb-5 mt-3 p-5">
                            <div>
                                {editar? <div>
                                    <Avatar alt="Profile Picture" size={145} src={url} className="img-fluid"/>
                                    <Demo></Demo>
                                </div> : <Avatar alt="Profile Picture" size={145} src={usuario.photoURL} className="img-fluid"/>}
                            </div>
                            {editar? <input className='text-center form-control form-control-lg mb-4' type='text' value={nombre} onChange={e => {setNombre(e.target.value)}}></input>
                             :  <h1 className='mt-4'>{usuario.displayName}</h1> 
                            }
                            <h4>{usuario.email}</h4>
                            {showAlert? <Alert
                                  message="Error"
                                  description={alerta}
                                  type="error"
                                  showIcon
                                  className='mb-4'
                                /> : <span></span>}
                            {editar? <div className='mt-4'>
                            <Button onClick={actualizar} type="primary" shape="round" size={"large"} >Editar</Button>
                            <Button onClick={() => {setEditar(false); setShowAlert(false)}} type="primary" shape="round" danger size={"large"} >Cancelar</Button>
                            </div> :
                            <div className='mt-4'>
                            <Button onClick={() => setEditar(true)} type="primary" shape="round" icon={<EditOutlined />} size={"large"} />
                            <Button onClick={eliminar} type="primary" shape="round" icon={<DeleteOutlined />} danger size={"large"} />
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Usuario;