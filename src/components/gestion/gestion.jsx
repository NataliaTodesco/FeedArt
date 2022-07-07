import React, { useState, useEffect, useRef } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./gestion.css";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  obtenerProyectos,
  obtenerProyectosChar,
  usuariosMasProyectos,
  proyectosxUID,
} from "../../firebaseConfig";
import {
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Menu,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import JsPDF from "jspdf";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  BarSeries,
  Title,
  PieSeries,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Plugin,
  Template,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import domtoimage from "dom-to-image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Animation } from "@devexpress/dx-react-chart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useUsuario } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Overlay } from "react-bootstrap";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function Gestion() {
  const [usuarios, setUsuarios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [eliminados, setEliminados] = useState([]);
  const [deleteU, setDeleteU] = useState([]);
  const {
    obtenerUsers,
    borrarUsuario,
    asignarPermiso,
    quitarPermiso,
    usuario,
    obtenerAdmins,
    obtenerEliminadosData,
    obtenerDeleteData
  } = useUsuario();

  useEffect(() => {
    obtenerUsers().then((array) => {
      setUsuarios(array);
    });
    obtenerAdmins().then((res) => {
      setAdmins(res);
    });
    obtenerEliminadosData().then(res => {
      setEliminados(res)
    })
    obtenerDeleteData().then(res => {
      setDeleteU(res)
    })
  }, [obtenerUsers, obtenerAdmins,obtenerEliminadosData, obtenerDeleteData]);

  function ListadoUsuarios() {
    let navigate = useNavigate();

    function verUsuario(uid) {
      navigate("/user/" + uid);
    }

    async function eliminarUser(id, email, nombre) {
      Modal.confirm({
        title: "Eliminar",
        icon: <ExclamationCircleOutlined />,
        content:
          "¿Estas seguro de que deseas eliminar este Usuario?",
        okText: "Eliminar",
        cancelText: "Cancelar",
        async onOk() {
          await borrarUsuario(id, email, nombre);
          await obtenerUsers().then((array) => {
            setUsuarios(array);
          });
          message.success("Usuario Eliminado");
        },
      });
    }

    async function permiso(id) {
      asignarPermiso(id);
      message.success("Permiso Asignado");
      await obtenerAdmins().then((res) => {
        setAdmins(res);
      });
    }

    async function quitar(id) {
      quitarPermiso(id);
      message.success("Permiso Removido");
      await obtenerAdmins().then((res) => {
        setAdmins(res);
      });
    }

    function habilitar(id) {
      let res = false;

      admins.forEach((element) => {
        if (element === id) {
          res = true;
        }
      });

      return res;
    }

    const columns = [
      {
        field: "Imagen",
        width: 80,
        renderCell: (usuarios) => (
          <strong>
            <Avatar
              style={{ cursor: "pointer" }}
              onClick={(e) => verUsuario(usuarios.row.id)}
              alt="Profile Picture"
              src={usuarios.row.Imagen}
            />
          </strong>
        ),
      },
      { field: "Nombre", width: 180 },
      { field: "Email", width: 270 },
      {
        field: "Fecha",
        width: 100,
      },
      {
        field: "Acciones",
        width: 80,
        renderCell: (usuarios) => (
          <strong>
            <div>
              {usuarios.row.id !== "qA2c3TwTAKUc9160fsJlMtDSVgl1" &&
              usuario.uid !== usuarios.row.id ? (
                <i
                  class="bi bi-trash-fill ml-1 mr-3"
                  style={{ fontSize: "large", cursor: "pointer" }}
                  onClick={(e) => {
                    eliminarUser(usuarios.row.id, usuarios.row.Email, usuarios.row.Nombre);
                  }}
                ></i>
              ) : (
                <span />
              )}
              {usuarios.row.id !== "qA2c3TwTAKUc9160fsJlMtDSVgl1" &&
              usuario.uid !== usuarios.row.id &&
              habilitar(usuarios.row.id) === false ? (
                <i
                  class="bi bi-plus-circle-fill"
                  style={{ fontSize: "large", cursor: "pointer" }}
                  onClick={(e) => {
                    permiso(usuarios.row.id);
                  }}
                ></i>
              ) : (
                <span />
              )}
              {usuarios.row.id !== "qA2c3TwTAKUc9160fsJlMtDSVgl1" &&
              usuario.uid !== usuarios.row.id &&
              habilitar(usuarios.row.id) ? (
                <i
                  class="bi bi-dash-circle-fill"
                  style={{ fontSize: "large", cursor: "pointer" }}
                  onClick={(e) => {
                    quitar(usuarios.row.id);
                  }}
                ></i>
              ) : (
                <span />
              )}
            </div>
          </strong>
        ),
      },
    ];

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport />
          <GridToolbarFilterButton />
        </GridToolbarContainer>
      );
    }

    return (
      <div className="col-lg-7 mb-5" style={{ height: 418, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Listado de Usuarios</h3>
        <DataGrid
          rows={usuarios}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          title={"Listado de Usuarios"}
        />
      </div>
    );
  }

  function CantidadxAño() {
    const [año, setAño] = React.useState(2022);
    let year = 2022;

    useEffect(() => {
      obtenerUsers().then((array) => {
        cantidadUsers(array);
      });
    }, []);

    const [data, setData] = useState([
      { argument: "Mes", value: 0 },
      { argument: 1, value: 0 },
      { argument: 2, value: 0 },
      { argument: 3, value: 0 },
      { argument: 4, value: 0 },
      { argument: 5, value: 0 },
      { argument: 6, value: 0 },
      { argument: 7, value: 0 },
      { argument: 8, value: 0 },
      { argument: 9, value: 0 },
      { argument: 10, value: 0 },
      { argument: 11, value: 0 },
      { argument: 12, value: 0 },
    ]);

    const handleChange = (event) => {
      year = event.target.value;
      setAño(event.target.value);
      cantidadUsers(usuarios);
    };

    function cantidadUsers(array) {
      let element = [
        { argument: "Mes", value: 0 },
        { argument: 1, value: 0 },
        { argument: 2, value: 0 },
        { argument: 3, value: 0 },
        { argument: 4, value: 0 },
        { argument: 5, value: 0 },
        { argument: 6, value: 0 },
        { argument: 7, value: 0 },
        { argument: 8, value: 0 },
        { argument: 9, value: 0 },
        { argument: 10, value: 0 },
        { argument: 11, value: 0 },
        { argument: 12, value: 0 },
      ];

      for (let index = 0; index < array.length; index++) {
        if (year == array[index].fecha.getFullYear()) {
          switch (array[index].fecha.getMonth() + 1) {
            case 1:
              element[1].value = element[1].value + 1;
              break;
            case 2:
              element[2].value = element[2].value + 1;
              break;
            case 3:
              element[3].value = element[3].value + 1;
              break;
            case 4:
              element[4].value = element[4].value + 1;
              break;
            case 5:
              element[5].value = element[5].value + 1;
              break;
            case 6:
              element[6].value = element[6].value + 1;
              break;
            case 7:
              element[7].value = element[7].value + 1;
              break;
            case 8:
              element[8].value = element[8].value + 1;
              break;
            case 9:
              element[9].value = element[9].value + 1;
              break;
            case 10:
              element[10].value = element[10].value + 1;
              break;
            case 11:
              element[11].value = element[11].value + 1;
              break;
            default:
              element[12].value = element[12].value + 1;
              break;
          }
        }
      }

      setData(element);
    }

    const Export = () => {
      const exportToImage = async (chart, format, exportFunc) => {
        try {
          const dataUrl = await exportFunc(chart, { filter });
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.download = `Cant. de Usuarios por Mes y Año.${format}`;
          link.href = dataUrl;
          link.click();
          link.remove();
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const iconButton = "exportIconButton";
      const filter = (node) => node.id !== iconButton;

      const exportToPng = (chart) =>
        exportToImage(chart, "png", domtoimage.toPng);

      const exportToPdf = async (chart) => {
        const width = chart.offsetWidth;
        const height = chart.offsetHeight;
        try {
          const dataUrl = await domtoimage.toJpeg(chart, { filter });
          const doc = new JsPDF({
            orientation: "landscape",
            unit: "px",
            format: [width, height],
          });
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
          doc.save("Cant. de Usuarios por Mes y Año");
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const options = [
        { key: "PNG", action: exportToPng, text: "Save as PNG" },
        { key: "PDF", action: exportToPdf, text: "Save as PDF" },
      ];

      const ITEM_HEIGHT = 48;
      const paperProps = {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: 150,
        },
      };

      const [anchorEl, setAnchorEl] = useState(null);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleExport =
        ({ action }) =>
        () => {
          const chart = document.querySelector(`#rootContainerId`);
          handleClose();
          action(chart);
        };

      const open = Boolean(anchorEl);
      return (
        <Plugin name="Export" style={{ width: "100%" }}>
          <Template name="top" className="row">
            <ValueAxis.Label
              text="Cant."
              style={{
                marginTop: "50px",
                color: "#747477",
                marginLeft: "-25.53px",
                marginBottom: "2%",
              }}
            />
            <TemplatePlaceholder />
            <IconButton
              id={iconButton}
              onClick={handleClick}
              sx={{
                width: 50,
                height: 50,
              }}
              size="large"
              style={{ marginLeft: "-7%" }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={paperProps}
            >
              {options.map((option) => (
                <MenuItem key={option.key} onClick={handleExport(option)}>
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              className="mb-3 ml-3"
            >
              <InputLabel id="demo-simple-select-standard-label">
                Año
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={año}
                onChange={handleChange}
                label="Año"
              >
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem selected value={2022}>
                  2022
                </MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
              </Select>
            </FormControl>
          </Template>
        </Plugin>
      );
    };

    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Cant. de Usuarios por Mes y Año</h3>

        <Paper id="rootContainerId">
          <Chart data={data} style={{ maxHeight: "415px" }}>
            <Export />
            <ArgumentAxis />
            <ValueAxis />

            <LineSeries valueField="value" argumentField="argument" />
          </Chart>
        </Paper>
      </div>
    );
  }

  function ListadoProyectos() {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
      obtenerProyectosChar().then((res) => {
        setProyectos(res);
      });
    }, []);

    function verUser(uid) {
      let nombre = " - ";
      for (let i = 0; i < usuarios.length; i++) {
        if (uid === usuarios[i].UID) return usuarios[i].Nombre;
      }
      for (let index = 0; index < eliminados.length; index++) {
        if (eliminados[index].uid === uid){
          return eliminados[index].nombre
        }
      }
      for (let index = 0; index < deleteU.length; index++) {
        if (deleteU[index].uid === uid){
          return deleteU[index].nombre
        }
      }
      return nombre;
    }

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport />
          <GridToolbarFilterButton />
        </GridToolbarContainer>
      );
    }

    let navigate = useNavigate();

    function verProyecto(id) {
      navigate("/project/" + id);
    }

    return (
      <div className="col-lg-12 my-5" style={{ height: 550, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Listado de Proyectos</h3>
        <DataGrid
          rows={proyectos}
          columns={[
            {
              field: "Titulo",
              width: 170,
            },
            {
              field: "Categoria",
              width: 135,
            },
            {
              field: "Descripcion",
              width: 360,
            },
            {
              field: "Imagen",
              width: 110,
              renderCell: (proyectos) => (
                <img
                  style={{ cursor: "pointer" }}
                  onClick={(e) => verProyecto(proyectos.row.id)}
                  className="img-fluid my-5 mr-3"
                  alt=""
                  src={proyectos.row.Imagen}
                />
              ),
            },
            {
              field: "Precio",
              width: 80,
            },
            {
              field: "Likes",
              width: 50,
            },
            {
              field: "Favs",
              width: 50,
            },
            {
              field: "Fecha",
              width: 100,
            },
            {
              field: "Creador",
              width: 140,
            },
            {
              field: "Estado",
              width: 90,
            },
            {
              field: "Comprador",
              width: 140,
              renderCell: (proyectos) => (
                <p>{verUser(proyectos.row.Comprador)}</p>
              ),
            },
            // {
            //   field: "Comentarios",
            //   width: 150,
            // },
          ]}
          components={{ Toolbar: CustomToolbar }}
        />
      </div>
    );
  }

  function ProyectosxCategoria() {
    const [proyectosXcategoria, setProyectosXcategoria] = useState([
      { categoria: "A", cantidad: 0 },
      { categoria: "B", cantidad: 0 },
      { categoria: "C", cantidad: 0 },
      { categoria: "D", cantidad: 0 },
      { categoria: "E", cantidad: 0 },
      { categoria: "F", cantidad: 0 },
      { categoria: "G", cantidad: 0 },
    ]);

    function ProyectosXCategoria(array) {
      let element = [
        { categoria: "A", cantidad: 0 },
        { categoria: "B", cantidad: 0 },
        { categoria: "C", cantidad: 0 },
        { categoria: "D", cantidad: 0 },
        { categoria: "E", cantidad: 0 },
        { categoria: "F", cantidad: 0 },
        { categoria: "G", cantidad: 0 },
      ];

      for (let index = 0; index < array.length; index++) {
        switch (array[index].datos.categoria) {
          case 1:
            element[0].cantidad = element[0].cantidad + 1;
            break;
          case 2:
            element[1].cantidad = element[1].cantidad + 1;
            break;
          case 3:
            element[2].cantidad = element[2].cantidad + 1;
            break;
          case 4:
            element[3].cantidad = element[3].cantidad + 1;
            break;
          case 5:
            element[4].cantidad = element[4].cantidad + 1;
            break;
          case 6:
            element[5].cantidad = element[5].cantidad + 1;
            break;
          default:
            element[6].cantidad = element[6].cantidad + 1;
            break;
        }
      }

      setProyectosXcategoria(element);
    }

    useEffect(() => {
      obtenerProyectos().then((res) => {
        ProyectosXCategoria(res);
      });
    }, []);

    const Exports = () => {
      const exportToImage = async (chart, format, exportFunc) => {
        try {
          const dataUrl = await exportFunc(chart, { filter });
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.download = `ProyectosxCategoría.${format}`;
          link.href = dataUrl;
          link.click();
          link.remove();
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const iconButton = "exportIconButton";
      const filter = (node) => node.id !== iconButton;

      const exportToPng = (chart) =>
        exportToImage(chart, "png", domtoimage.toPng);

      const exportToPdf = async (chart) => {
        const width = chart.offsetWidth;
        const height = chart.offsetHeight;
        try {
          const dataUrl = await domtoimage.toJpeg(chart, { filter });
          const doc = new JsPDF({
            orientation: "landscape",
            unit: "px",
            format: [width, height],
          });
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
          doc.save("ProyectosxCategoría");
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const options = [
        { key: "PNG", action: exportToPng, text: "Save as PNG" },
        { key: "PDF", action: exportToPdf, text: "Save as PDF" },
      ];

      const ITEM_HEIGHT = 48;
      const paperProps = {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: 150,
        },
      };

      const [anchorEl, setAnchorEl] = useState(null);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleExport =
        ({ action }) =>
        () => {
          const chart = document.querySelector(`#rootContainerId2`);
          handleClose();
          action(chart);
        };

      const open = Boolean(anchorEl);
      return (
        <Plugin name="Export" style={{ width: "100%" }}>
          <Template name="top" className="row">
            <ValueAxis.Label
              text="Cant."
              style={{
                marginTop: "50px",
                color: "#747477",
                marginLeft: "-25.53px",
                marginBottom: "2%",
              }}
            />
            <TemplatePlaceholder />
            <IconButton
              id={iconButton}
              onClick={handleClick}
              sx={{
                width: 50,
                height: 50,
              }}
              size="large"
              style={{ marginLeft: "-7%" }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={paperProps}
            >
              {options.map((option) => (
                <MenuItem key={option.key} onClick={handleExport(option)}>
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
          </Template>
        </Plugin>
      );
    };

    return (
      <div className="row">
        <div className="col-lg-8">
          <div className="row char" id="rootContainerId2">
            <div className="col-lg-9 mb-3">
              <Paper>
                <Chart data={proyectosXcategoria} className="bar">
                  <ArgumentAxis />
                  <ValueAxis max={7} />
                  <Title text="Cantidad de Proyectos por Categoría" />
                  <Animation />
                  <Exports></Exports>
                  <BarSeries valueField="cantidad" argumentField="categoria" />
                </Chart>
              </Paper>
            </div>
            <div
              className="col-lg-3 mb-3 py-4"
              style={{ background: "rgb(237, 237, 241)", borderRadius: "8px" }}
            >
              <h6>
                {" "}
                <span className="text-info">A -</span> Arte Tradicional{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">B -</span> Dibujos y Pinturas{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">C -</span> Fotografia{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">D -</span> Arte digital{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">E -</span> 3D{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">F -</span> Esculturas{" "}
              </h6>
              <h6>
                {" "}
                <span className="text-info">G -</span> Arte callejero{" "}
              </h6>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <Top5Usuarios></Top5Usuarios>
        </div>
      </div>
    );
  }

  function Top5Usuarios() {
    const [proyectosXUser, setProyectosXUser] = useState([]);

    function SortArray(x, y) {
      if (x.cantidad < y.cantidad) {
        return 1;
      }
      if (x.cantidad > y.cantidad) {
        return -1;
      }
      return 0;
    }

    const _exportPdf = () => {
      html2canvas(document.querySelector("#capture")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save("Top5UsuariosConMasProyectos.pdf");
      });
    };

    let navigate = useNavigate();

    function verUsuario(uid) {
      navigate("/user/" + uid);
    }

    useEffect(() => {
      usuariosMasProyectos().then((res) => {
        setProyectosXUser(res.sort(SortArray));
      });
    }, []);

    return (
      <div>
        <div className="row">
          <a className="float-right" onClick={() => _exportPdf()}>
            <i
              className="bi bi-download mr-2"
              style={{ fontSize: "large" }}
            ></i>
            Guardar como PDF
          </a>{" "}
          <br />
        </div>
        <ul id="capture" className="list-group">
          <h4 style={{ textAlign: "center", fontWeight: "400" }}>
            Top 5 Usuarios con más Proyectos Registrados
          </h4>
          {proyectosXUser.map((user, index) => {
            return (
              <div key={index}>
                {index < 5 ? (
                  <li
                    key={index + 1}
                    className="list-group-item list-group-item-dark"
                  >
                    <div className="d-flex justify-content-left">
                      <Avatar
                        style={{ cursor: "pointer" }}
                        onClick={(e) => verUsuario(user.id)}
                        alt=""
                        src={user.img_url}
                      ></Avatar>
                      <p className="ml-2">
                        {user.nombre} - {user.email}. <br />
                        Cant. de proyectos: <strong>{user.cantidad}</strong>
                      </p>
                    </div>
                  </li>
                ) : (
                  <div></div>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    );
  }

  function Top10ProyectosMasRecaudacion() {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
      obtenerProyectosChar().then((res) => {
        let project = res.sort(SortArray);
        let vendidos = [];
        for (let index = 0; index < project.length; index++) {
          if (project[index].vendido) {
            vendidos.push(project[index]);
          }
        }
        let top10 = [];

        let indice = 10;
        if (vendidos.length < 10) indice = vendidos.length;

        for (let index = 0; index < indice; index++) {
          top10.push(vendidos[index]);
        }
        setProyectos(top10);
      });
    }, []);

    function verUser(uid) {
      let nombre = " - ";
      for (let i = 0; i < usuarios.length; i++) {
        if (uid === usuarios[i].UID) return usuarios[i].Nombre;
      }
      for (let index = 0; index < eliminados.length; index++) {
        if (eliminados[index].uid === uid){
          return eliminados[index].nombre
        }
      }
      for (let index = 0; index < deleteU.length; index++) {
        if (deleteU[index].uid === uid){
          return deleteU[index].nombre
        }
      }
      return nombre;
    }

    function SortArray(x, y) {
      if (x.Precio < y.Precio) {
        return 1;
      }
      if (x.Precio > y.Precio) {
        return -1;
      }
      return 0;
    }

    let navigate = useNavigate();

    function verProyecto(id) {
      navigate("/project/" + id);
    }

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport />
          {/* <GridToolbarFilterButton /> */}
        </GridToolbarContainer>
      );
    }

    return (
      <div className="col-lg-12 my-5" style={{ height: 600, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>
          Top 10 Proyectos Vendidos que Más Dinero Recaudaron
        </h3>
        <DataGrid
          rows={proyectos}
          columns={[
            {
              field: "Titulo",
              width: 170,
            },
            {
              field: "Categoria",
              width: 135,
            },
            {
              field: "Descripcion",
              width: 360,
            },
            {
              field: "Imagen",
              width: 110,
              renderCell: (proyectos) => (
                <img
                  style={{ cursor: "pointer" }}
                  onClick={(e) => verProyecto(proyectos.row.id)}
                  className="img-fluid my-5 mr-3"
                  alt=""
                  src={proyectos.row.Imagen}
                />
              ),
            },
            {
              field: "Precio",
              width: 80,
            },
            {
              field: "Likes",
              width: 50,
            },
            {
              field: "Favs",
              width: 50,
            },
            {
              field: "Fecha",
              width: 100,
            },
            {
              field: "Creador",
              width: 140,
            },
            {
              field: "Estado",
              width: 90,
            },
            {
              field: "Comprador",
              width: 140,
              renderCell: (proyectos) => (
                <p>{verUser(proyectos.row.Comprador)}</p>
              ),
            },
            // {
            //   field: "Comentarios",
            //   width: 150,
            // },
          ]}
          components={{ Toolbar: CustomToolbar }}
        />
      </div>
    );
  }

  function ProyectosxTipoxUsuario() {
    const [masCant, setMasCant] = useState(usuarios[7]);
    const [data, setData] = useState([
      { country: "Muestra: " + 0, area: 0 },
      { country: "En Venta: " + 0, area: 0 },
      { country: "Vendido: " + 0, area: 0 },
    ]);
    const [user, setUser] = useState(masCant);

    function SortArray(x, y) {
      if (x.cantidad < y.cantidad) {
        return 1;
      }
      if (x.cantidad > y.cantidad) {
        return -1;
      }
      return 0;
    }

    useEffect(() => {
      usuariosMasProyectos().then((res) => {
        let orden = res.sort(SortArray);
        usuarios.forEach((element) => {
          if (element.id === orden[0].id) {
            setMasCant(element);
            setUser(element);
            filtro(element);
          }
        });
      });
    }, [masCant]);

    async function filtro(usuario) {
      await proyectosxUID(usuario.id).then((res) => {
        let muestra = 0;
        let venta = 0;
        let vendido = 0;

        res.forEach((element) => {
          if (element.datos.precio === 0) muestra++;
          else if (element.datos.precio > 0 && element.datos.vendido) vendido++;
          else venta++;
        });

        setData([
          { country: "Muestra: " + muestra, area: muestra },
          { country: "En Venta: " + venta, area: venta },
          { country: "Vendido: " + vendido, area: vendido },
        ]);
      });
    }

    const Exports = () => {
      const exportToImage = async (chart, format, exportFunc) => {
        try {
          const dataUrl = await exportFunc(chart, { filter });
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.download = `ProyectosxTipoxUsuario.${format}`;
          link.href = dataUrl;
          link.click();
          link.remove();
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const iconButton = "exportIconButton";
      const filter = (node) => node.id !== iconButton;

      const exportToPng = (chart) =>
        exportToImage(chart, "png", domtoimage.toPng);

      const exportToPdf = async (chart) => {
        const width = chart.offsetWidth;
        const height = chart.offsetHeight;
        try {
          const dataUrl = await domtoimage.toJpeg(chart, { filter });
          const doc = new JsPDF({
            orientation: "landscape",
            unit: "px",
            format: [width, height],
          });
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = doc.internal.pageSize.getHeight();
          doc.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
          doc.save("ProyectosxCategoría");
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };

      const options = [
        { key: "PNG", action: exportToPng, text: "Save as PNG" },
        { key: "PDF", action: exportToPdf, text: "Save as PDF" },
      ];

      const ITEM_HEIGHT = 48;
      const paperProps = {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: 150,
        },
      };

      const [anchorEl, setAnchorEl] = useState(null);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleExport =
        ({ action }) =>
        () => {
          const chart = document.querySelector(`#rootContainerId3`);
          handleClose();
          action(chart);
        };

      const open = Boolean(anchorEl);
      return (
        <Plugin name="Export">
          <Template name="top" className="row">
            <TemplatePlaceholder />
            <IconButton
              id={iconButton}
              onClick={handleClick}
              sx={{
                width: 50,
                height: 50,
              }}
              size="large"
              style={{ marginBottom: "10px" }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={paperProps}
            >
              {options.map((option) => (
                <MenuItem key={option.key} onClick={handleExport(option)}>
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
            <FormControl sx={{ m: 1, minWidth: "70%" }} className="mb-3 ml-3">
              <Autocomplete
                fullWidth
                aria-labelledby="user"
                disablePortal
                defaultValue={user}
                onChange={(event, newValue) => {
                  setUser(newValue);
                  filtro(newValue);
                }}
                className="my-2 "
                id="size-small-standard"
                size="small"
                options={usuarios}
                getOptionLabel={(option) =>
                  option.Nombre + " - " + option.Email
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Usuario"
                    placeholder="Buscar por usuario..."
                  />
                )}
              />
            </FormControl>
          </Template>
        </Plugin>
      );
    };

    return (
      <div className="col-lg-6 mt-5 mb-4">
        <h3 className="text-center">Proyectos por Estado por Usuario</h3>
        <Paper className="pt-2">
          <Chart
            data={data}
            id="rootContainerId3"
            style={{ background: "white" }}
          >
            <Exports />
            <PieSeries valueField="area" argumentField="country" />
            <Legend />
          </Chart>
        </Paper>
      </div>
    );
  }

  function VentasxCategoria() {
    const _exportPdf = () => {
      html2canvas(document.querySelector("#ventasxcategoria")).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          pdf.addImage(imgData, "PNG", 0, 0);
          pdf.save("VentasPorCategoria.pdf");
        }
      );
    };

    const [proyectosXcategoria, setProyectosXcategoria] = useState([
      { categoria: "A", cantidad: 0 },
      { categoria: "B", cantidad: 0 },
      { categoria: "C", cantidad: 0 },
      { categoria: "D", cantidad: 0 },
      { categoria: "E", cantidad: 0 },
      { categoria: "F", cantidad: 0 },
      { categoria: "G", cantidad: 0 },
    ]);

    function ProyectosXCategoria(array) {
      let element = [
        { categoria: "A", cantidad: 0, total: 0 },
        { categoria: "B", cantidad: 0, total: 0 },
        { categoria: "C", cantidad: 0, total: 0 },
        { categoria: "D", cantidad: 0, total: 0 },
        { categoria: "E", cantidad: 0, total: 0 },
        { categoria: "F", cantidad: 0, total: 0 },
        { categoria: "G", cantidad: 0, total: 0 },
      ];

      for (let index = 0; index < array.length; index++) {
        switch (array[index].datos.categoria) {
          case 1:
            element[0].cantidad = element[0].cantidad + 1;
            break;
          case 2:
            element[1].cantidad = element[1].cantidad + 1;
            break;
          case 3:
            element[2].cantidad = element[2].cantidad + 1;
            break;
          case 4:
            element[3].cantidad = element[3].cantidad + 1;
            break;
          case 5:
            element[4].cantidad = element[4].cantidad + 1;
            break;
          case 6:
            element[5].cantidad = element[5].cantidad + 1;
            break;
          default:
            element[6].cantidad = element[6].cantidad + 1;
            break;
        }
        if (array[index].datos.vendido) {
          switch (array[index].datos.categoria) {
            case 1:
              element[0].total = element[0].total + 1;
              break;
            case 2:
              element[1].total = element[1].total + 1;
              break;
            case 3:
              element[2].total = element[2].total + 1;
              break;
            case 4:
              element[3].total = element[3].total + 1;
              break;
            case 5:
              element[4].total = element[4].total + 1;
              break;
            case 6:
              element[5].total = element[5].total + 1;
              break;
            default:
              element[6].total = element[6].total + 1;
              break;
          }
        }
      }

      setProyectosXcategoria(element);
    }

    useEffect(() => {
      obtenerProyectos().then((res) => {
        ProyectosXCategoria(res);
      });
    }, []);

    return (
      <div className="col-lg-6 mb-4">
        <a className="float-right" onClick={() => _exportPdf()}>
          <i className="bi bi-download mr-2" style={{ fontSize: "large" }}></i>
          Guardar como PDF
        </a>
        <br /> <br />
        <div id="ventasxcategoria">
          <h3 style={{ textAlign: "center" }}>Cant. de Ventas por Categoría</h3>
          <div
            className="px-4 py-5"
            style={{ background: "white", borderRadius: "5px" }}
          >
            <h6>Arte Tradicional</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[0].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[0].total * 100) /
                        proyectosXcategoria[0].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[0].total * 100) /
                    proyectosXcategoria[0].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[0].cantidad}
              >
                {proyectosXcategoria[0].total}
              </div>
            </div>
            <h6>Dibujos y Pinturas</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[1].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-secondary progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[1].total * 100) /
                        proyectosXcategoria[1].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[1].total * 100) /
                    proyectosXcategoria[1].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[1].cantidad}
              >
                {proyectosXcategoria[1].total}
              </div>
            </div>
            <h6>Fotografía</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[2].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-dark progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[2].total * 100) /
                        proyectosXcategoria[2].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[2].total * 100) /
                    proyectosXcategoria[2].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[2].cantidad}
              >
                {proyectosXcategoria[2].total}
              </div>
            </div>
            <h6>Arte Digital</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[3].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-danger progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[3].total * 100) /
                        proyectosXcategoria[3].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[3].total * 100) /
                    proyectosXcategoria[3].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[3].cantidad}
              >
                {proyectosXcategoria[3].total}
              </div>
            </div>
            <h6>3D</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[4].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-warning progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[4].total * 100) /
                        proyectosXcategoria[4].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[4].total * 100) /
                    proyectosXcategoria[4].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[4].cantidad}
              >
                {proyectosXcategoria[4].total}
              </div>
            </div>
            <h6>Esculturas</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[5].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-info progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[5].total * 100) /
                        proyectosXcategoria[5].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[5].total * 100) /
                    proyectosXcategoria[5].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[5].cantidad}
              >
                {proyectosXcategoria[5].total}
              </div>
            </div>
            <h6>Arte Callejero</h6>
            <p className="float-right mb-2 ml-1">
              {proyectosXcategoria[6].cantidad}
            </p>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-success progress-bar-striped"
                role="progressbar"
                style={{
                  width:
                    Math.round(
                      (proyectosXcategoria[6].total * 100) /
                        proyectosXcategoria[6].cantidad
                    ) + "%",
                }}
                aria-valuenow={Math.round(
                  (proyectosXcategoria[6].total * 100) /
                    proyectosXcategoria[6].cantidad
                )}
                aria-valuemin="0"
                aria-valuemax={proyectosXcategoria[6].cantidad}
              >
                {proyectosXcategoria[6].total}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ContextMenu() {
    const [open, setOpen] = useState(false);
    const handleMenuClicked = (event) => {
      event.preventDefault();
      setOpen(!open);
    };
    return (
      <>
        <nav className={open ? "menus" : "hideMenu"}>
          <a href="#users">Usuarios</a>
          <a href="#projects">Proyectos</a>
          <a href="#shopping">Ventas</a>
        </nav>

        <div className="floating ml-5">
          <div
            onClick={(e) => {
              handleMenuClicked(e);
            }}
            className="contextMenu d-flex justify-content-center align-items-center"
          >
            <i
              className="bi bi-list text-light"
              style={{ fontSize: "larger" }}
            ></i>
          </div>
        </div>
      </>
    );
  }

  function InfoButton() {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
      <>
        <Overlay target={target.current} show={show} placement="top-start">
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              style={{
                position: "absolute",
                backgroundColor: "rgb(0,0,0,.9)",
                padding: "2px 10px",
                color: "white",
                borderRadius: 3,
                zIndex: 10,
                ...props.style,
              }}
            >
              <div className="p-3 text-left" style={{ width: "315px" }}>
                <h6 className="text-light">Listados: </h6>
                <p>
                  Los datos pueden filtrarse y ordenarse por todos los campos
                  del listado un filtro por vez.
                  <br />
                  <br />
                  Al seleccionar las imagenes en el listado será redirigido al
                  proyecto o usuario seleccionado.
                  <br />
                  <br />
                  Al filtrar por fecha podra:
                  <li> Ingresar la fecha entera.</li>
                  <li> Ingresar "/(nro)" para filtrar por año.</li>
                  <li> Ingresar "/(nro)/" para filtrar por mes.</li>
                  <li>
                    {" "}
                    Ingresar "(nro)/" y seleccionar el operador "Starts with"
                    para filtrar por día.
                  </li>
                  <br />
                  Al filtrar por imagen usted estaría filtrando por la URL de la
                  misma.
                </p>
              </div>
            </div>
          )}
        </Overlay>

        <div className="floating">
          <div
            className="contextMenu d-flex justify-content-center align-items-center"
            ref={target}
            onClick={() => setShow(!show)}
          >
            <i class="bi bi-info text-light"></i>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="gestion">
      <Navbar></Navbar>
      <div className="container-fluid px-4 mt-3 mb-5">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>
              {" "}
              <span className="shine">[</span> GESTIÓN{" "}
              <span className="shine">]</span>
            </h1>
          </div>
        </div>{" "}
        <div className="row" id="users">
          <ListadoUsuarios></ListadoUsuarios>
          <div className="col-lg-5">
            <CantidadxAño></CantidadxAño>
          </div>
        </div>
        <div className="row" id="projects">
          <ListadoProyectos></ListadoProyectos>
        </div>
        <div className="row mt-5">
          <ProyectosxCategoria></ProyectosxCategoria>
        </div>
        <div className="row mb-5" id="shopping">
          <Top10ProyectosMasRecaudacion></Top10ProyectosMasRecaudacion>
        </div>
        <div className="row">
          <ProyectosxTipoxUsuario />
          <VentasxCategoria />
        </div>
      </div>
      <ContextMenu />
      <InfoButton />
      <Footer></Footer>
      {/* <button className='btn btn-info' onClick={() => window.print()}>Imprimir</button> */}
    </div>
  );
}

export default Gestion;
