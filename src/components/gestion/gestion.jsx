import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Navbar from "../Navbar/navbar";
import "./gestion.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { obtenerUsers } from "../../firebaseConfig";
import { Avatar, MenuItem, FormControl, InputLabel, Select, Menu, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import JsPDF from 'jspdf';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Plugin, Template, TemplatePlaceholder } from '@devexpress/dx-react-core';
import domtoimage from 'dom-to-image';
import MoreVertIcon from '@mui/icons-material/MoreVert';


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
    { argument: 1, value: 1 }
  ]);

  useEffect(() => {
    obtenerUsers().then((array) => {
      setUsuarios(array);
      cantidadUsers(array);
    });
  }, []);

  const [año, setAño] = React.useState(2022);
  let year = 2022;

  const handleChange = (event) => {
    year = event.target.value
    setAño(event.target.value);
    cantidadUsers(usuarios)
  };

  function cantidadUsers(array) {
    let element = [];
    
    for (let index = 0; index < array.length; index++) {
      if (year == array[index].Fecha.getFullYear()) {
        element.push({
          argument: array[index].Fecha.getMonth() + 1,
          value: index + 1,
        });
      }
    }

    if (element.length !== 0)
    setData(element);
    else setData([{ argument: 0, value: 0 }]) 
  }

  const exportToImage = async (chart, format, exportFunc) => {
    try {
      const dataUrl = await exportFunc(chart, { filter });
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.download = `chart.${format}`;
      link.href = dataUrl;
      link.click();
      link.remove();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('oops, something went wrong!', err);
    }
  };

  const rootContainerId = 'widget-container';
  const iconButton = 'exportIconButton';
  const filter = node => (node.id !== iconButton);

  const exportToPng = chart => exportToImage(chart, 'png', domtoimage.toPng);

  const exportToPdf = async (chart) => {
    const width = chart.offsetWidth;
    const height = chart.offsetHeight;
    try {
      const dataUrl = await domtoimage.toJpeg(chart, { filter });
      // @ts-ignore
      const doc = new JsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [width, height],
      });
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      doc.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      doc.save('chart');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('oops, something went wrong!', err);
    }
  };

  const options = [
    { key: 'PNG', action: exportToPng, text: 'Save as PNG' },
    { key: 'PDF', action: exportToPdf, text: 'Save as PDF' },
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

    const handleExport = ({ action }) => () => {
      const chart = document.querySelector(`#${rootContainerId}`);
      handleClose();
      action(chart);
    };

    const open = Boolean(anchorEl);
    return (
      <Plugin name="Export" style={{width: '100%'}}>
        <Template name="top" className='row'>
          <TemplatePlaceholder />
          <IconButton
            id={iconButton}
            onClick={handleClick}
            sx={{
              width: 50,
              height: 50,
            }}
            size="large"
            style={{marginLeft: '-7%'}}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={paperProps}
          >
            {options.map(option => (
              <MenuItem key={option.key} onClick={handleExport(option)}>
                {option.text}
              </MenuItem>
            ))}
          </Menu>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}  className='mb-3 ml-3'>
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
                <MenuItem selected value={2022}>2022</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
              </Select>
            </FormControl>
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
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField="value" argumentField="argument" />
                <Export />
              </Chart>
            </Paper>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Gestion;
