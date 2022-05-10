import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./gestion.css";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import {
  obtenerProyectos,
  obtenerProyectosChar,
  usuariosMasProyectos,
} from "../../firebaseConfig";
import {
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Menu,
  IconButton,
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
import { useUsuario } from '../../context/UserContext'

function Gestion() {
  const [usuarios, setUsuarios] = useState([]); 
  const { obtenerUsers } = useUsuario();
  
  useEffect(() => {
    obtenerUsers().then((array) => {
      setUsuarios(array);
    });
  }, []);

  function ListadoUsuarios() {
    const columns = [
      {
        field: "Imagen",
        width: 80,
        renderCell: (usuarios) => (
          <strong>
            <Avatar alt="Profile Picture" src={usuarios.row.Imagen} />
          </strong>
        ),
      },
      { field: "Nombre", width: 180 },
      { field: "Email", width: 270 },
      {
        field: "Fecha de Creación",
        width: 150,
        renderCell: (usuarios) => (
          <div>
            {usuarios.row.Fecha.getDate()}/{usuarios.row.Fecha.getMonth() + 1}/
            {usuarios.row.Fecha.getFullYear()}
          </div>
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
        if (year == array[index].Fecha.getFullYear()) {
          switch (array[index].Fecha.getMonth() + 1) {
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
          link.download = `chart.${format}`;
          link.href = dataUrl;
          link.click();
          link.remove();
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };
    
      const iconButton = "exportIconButton";
      const filter = (node) => node.id !== iconButton;
    
      const exportToPng = (chart) => exportToImage(chart, "png", domtoimage.toPng);
    
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
          doc.save("chart");
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

        <Paper id='rootContainerId'>
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

    function CustomToolbar() {
      return (
        <GridToolbarContainer>
          <GridToolbarExport />
          <GridToolbarFilterButton />
        </GridToolbarContainer>
      );
    }

    return (
      <div className="col-lg-12 my-5" style={{ height: 450, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Listado de Proyectos</h3>
        <DataGrid
          rows={proyectos}
          columns={[
            {
              field: "Titulo",
              width: 200,
            },
            {
              field: "Categoria",
              width: 170,
            },
            {
              field: "Descripcion",
              width: 390,
            },
            {
              field: "Imagen",
              width: 150,
              renderCell: (proyectos) => (
                <img
                  className="img-fluid my-5 mr-3"
                  alt=""
                  src={proyectos.row.Imagen}
                />
              ),
            },
            {
              field: "Precio",
              width: 130,
            },
            {
              field: "Likes",
              width: 80,
            },
            {
              field: "Favoritos",
              width: 80,
            },
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

    const Exports = () => {
      const exportToImage = async (chart, format, exportFunc) => {
        try {
          const dataUrl = await exportFunc(chart, { filter });
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.download = `chart.${format}`;
          link.href = dataUrl;
          link.click();
          link.remove();
        } catch (err) {
          console.error("oops, something went wrong!", err);
        }
      };
  
      const iconButton = "exportIconButton";
      const filter = (node) => node.id !== iconButton;
    
      const exportToPng = (chart) => exportToImage(chart, "png", domtoimage.toPng);
    
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
          doc.save("chart");
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

    useEffect(() => {
      obtenerProyectos().then((res) => {
        ProyectosXCategoria(res);
      });
    }, []);

    return (
        <div className="col-lg-6 mb-3 char">
          <Paper id="rootContainerId2">
            <Chart  data={proyectosXcategoria} className="bar">
              <ArgumentAxis />
              <ValueAxis max={7} />
              <Title text="Cantidad de Proyectos por Categoría" />
              <Animation />
              <Exports></Exports>
              <BarSeries valueField="cantidad" argumentField="categoria" />
            </Chart>
          </Paper>
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
        document.body.appendChild(canvas);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save("Top5UsuariosConMasProyectos.pdf");
      });
    };

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
                      <Avatar alt="" src={user.img_url}></Avatar>
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

  function Top10ProyectosMasRecaudacion(){
    const [proyectos, setProyectos] = useState([]);
  
    useEffect(() => {
      obtenerProyectosChar().then((res) => {
        let project = res.sort(SortArray)
        let vendidos = []
        for (let index = 0; index < project.length; index++) {
          if (project[index].vendido){
            vendidos.push(project[index])
          }
        }
        let top10 = []
        
        let indice = 10;
        if (vendidos.length < 10) indice = vendidos.length

        for (let index = 0; index < indice; index++) {
          top10.push(vendidos[index])
        }
        setProyectos(top10)
      });
    }, []);

    function SortArray(x, y) {
      if (x.Precio < y.Precio) {
        return 1;
      }
      if (x.Precio > y.Precio) {
        return -1;
      }
      return 0;
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
      <div className="col-lg-12 my-5" style={{ height: 560, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Top 10 Proyectos Vendidos que Más Dinero Recaudaron</h3>
        <DataGrid
          rows={proyectos}
          columns={[
            {
              field: "Titulo",
              width: 200,
            },
            {
              field: "Categoria",
              width: 170,
            },
            {
              field: "Descripcion",
              width: 390,
            },
            {
              field: "Imagen",
              width: 150,
              renderCell: (proyectos) => (
                <img
                  className="img-fluid my-5 mr-3"
                  alt=""
                  src={proyectos.row.Imagen}
                />
              ),
            },
            {
              field: "Precio",
              width: 130,
            },
            {
              field: "Likes",
              width: 80,
            },
            {
              field: "Favoritos",
              width: 80,
            },
          ]}
          components={{ Toolbar: CustomToolbar }}
        />
      </div>
    );
  }

  return (
    <div className="gestion">
      <Navbar></Navbar>
      <div className="container-fluid px-5 mt-3 mb-5">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}> ✧・°・ GESTIÓN  ・°・✦</h1>
          </div>
        </div>
        <div className="row">
            <ListadoUsuarios></ListadoUsuarios>
          <div className="col-lg-5">
            <CantidadxAño></CantidadxAño>
          </div>
        </div>
        <div className="row">
          <ListadoProyectos></ListadoProyectos>
        </div>
        <div className="row mt-5">
          <ProyectosxCategoria></ProyectosxCategoria>
          <div className="col-lg-2 mb-3">
            <h6> <span className="text-info">A -</span> Arte Tradicional </h6>
            <h6> <span className="text-info">B -</span> Dibujos y Pinturas </h6>
            <h6> <span className="text-info">C -</span> Fotografia </h6>
            <h6> <span className="text-info">D -</span> Arte digital </h6>
            <h6> <span className="text-info">E -</span> 3D </h6>
            <h6> <span className="text-info">F -</span> Esculturas </h6>
            <h6> <span className="text-info">G -</span> Arte callejero </h6>
          </div>
          <div className="col-lg-4">
            <Top5Usuarios></Top5Usuarios>
          </div>
        </div>
        <div className="row mb-5">
          <Top10ProyectosMasRecaudacion></Top10ProyectosMasRecaudacion>
        </div>
      </div>
      <Footer></Footer>
      {/* <button className='btn btn-info' onClick={() => window.print()}>Imprimir</button> */}
    </div>
  );
}

export default Gestion;
