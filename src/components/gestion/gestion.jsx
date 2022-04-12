import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./gestion.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { obtenerProyectos, obtenerProyectosChar, obtenerUsers, usuariosMasProyectos } from "../../firebaseConfig";
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
} from "@devexpress/dx-react-chart-material-ui";
import {
  Plugin,
  Template,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import domtoimage from "dom-to-image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Animation } from "@devexpress/dx-react-chart";

function Gestion() {
  const [usuarios, setUsuarios] = useState([]);
  const columns = [
    {
      field: "Imagen",
      width: 70,
      renderCell: (usuarios) => (
        <strong>
          <Avatar alt="Profile Picture" src={usuarios.row.Imagen} />
        </strong>
      ),
    },
    { field: "Nombre", width: 150 },
    { field: "Email", width: 250 },
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

  const [proyectosXcategoria, setProyectosXcategoria] = useState([
    { categoria: "Arte Tradicional", cantidad: 0 },
    { categoria: "Dibujos y Pinturas", cantidad: 0 },
    { categoria: "Fotografia", cantidad: 0 },
    { categoria: "Arte digital", cantidad: 0 },
    { categoria: "3D", cantidad: 0 },
    { categoria: "Esculturas", cantidad: 0 },
    { categoria: "Arte callejero", cantidad: 0 },
  ]);

  const [proyectos, setProyectos] = useState([]);
  const [proyectosXUser, setProyectosXUser] = useState([]);

  useEffect(() => {
    obtenerUsers().then((array) => {
      setUsuarios(array);
      cantidadUsers(array);
    });
    obtenerProyectos().then(res => {
      ProyectosXCategoria(res);
    })
    obtenerProyectosChar().then(res => {
      setProyectos(res)
    })
    usuariosMasProyectos().then(res => {
      setProyectosXUser(res)
    });
  }, []);

  const [año, setAño] = React.useState(2022);
  let year = 2022;

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

  function ProyectosXCategoria(array) {
    let element = [
      { categoria: "Arte Tradicional", cantidad: 0 },
      { categoria: "Dibujos y Pinturas", cantidad: 0 },
      { categoria: "Fotografia", cantidad: 0 },
      { categoria: "Arte Digital", cantidad: 0 },
      { categoria: "3D", cantidad: 0 },
      { categoria: "Esculturas", cantidad: 0 },
      { categoria: "Arte Callejero", cantidad: 0 },
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

  const rootContainerId = "widget-container";
  const rootContainerId2 = "widget-container";
  const iconButton = "exportIconButton";
  const filter = (node) => node.id !== iconButton;

  const exportToPng = (chart) => exportToImage(chart, "png", domtoimage.toPng);

  const exportToPdf = async (chart) => {
    const width = chart.offsetWidth;
    const height = chart.offsetHeight;
    try {
      const dataUrl = await domtoimage.toJpeg(chart, { filter });
      // @ts-ignore
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
      // eslint-disable-next-line no-console
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

  const Export = () => {
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
        const chart = document.querySelector(`#${rootContainerId}`);
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
            <InputLabel id="demo-simple-select-standard-label">Año</InputLabel>
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
  const Exports = () => {
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
    <div className="gestion">
      <Navbar></Navbar>
      <div className="container my-3">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h1 style={{ fontWeight: "800" }}>GESTIÓN</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-7 mb-5" style={{ height: 418, width: "100%" }}>
            <h4>Listado de Usuarios</h4>
            <DataGrid
              rows={usuarios}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
          <div className="col-lg-5">
            <h4>Cantidad de Usuarios por Mes y Año:</h4>

            <Paper id={rootContainerId}>
              <Chart data={data} style={{ maxHeight: "415px" }}>
                <Export />
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField="value" argumentField="argument" />
              </Chart>
            </Paper>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 my-5" style={{ height: 450, width: "100%" }}>
              <h4>Listado de Proyectos</h4>
              <DataGrid
                rows={proyectos}
                columns={[
                  {
                    field: "Titulo",
                    width: 200,
                  },
                  {
                    field: "Categoria",
                    width: 150,
                  },
                  {
                    field: "Descripcion",
                    width: 330,
                  },
                  {
                    field: "Imagen",
                    width: 110,
                    renderCell: (proyectos) => (
                        <img className="img-fluid my-5" alt="" src={proyectos.row.Imagen} />
                    ),
                  },
                  {
                    field: "Precio",
                    width: 100,
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
                components={{ Toolbar: GridToolbar }}
              />
            </div>
        </div>
        <div className="row my-5">
          <div className="col-lg-8">
            <Paper id='rootContainerId2'>
              <Chart data={proyectosXcategoria}>
                <ArgumentAxis />
                <ValueAxis max={7} />

                <BarSeries valueField="cantidad" argumentField="categoria" />
                <Title text="Cantidad de Proyectos por Categoría" />
                <Animation />
                <Exports></Exports>
              </Chart>
            </Paper>
          </div>
          {/* Limit 10, orderBy el array mas grande obtengo el uid y lo justo con ubtener userxuid */}
          {/* <div className="col-lg-4">
            <h4>Top 10 Usuarios con más Proyectos Registrados</h4>
            <ul class="list-group">
              {proyectosXUser.map((user,index) => {
                return <li key={index+1} class="list-group-item list-group-item-dark">
                  <Avatar alt="" src={user.img_url}></Avatar> {user.nombre} - {user.email}. Cant. de proyectos: {user.cantidad}
                </li>
              })}
            </ul>
          </div> */}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Gestion;
