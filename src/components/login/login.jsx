import React, { useState } from "react";
import "./login.css";
import Footer from "../footer/footer";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import "antd/dist/antd.css";
import { useNavigate } from "react-router-dom";
import { Alert, message } from "antd";
import { useUsuario } from '../../context/UserContext'

function Login() {
  const { logInConMail, logUpConMail, logInConGoogle, reset } = useUsuario()
  const [alerta, setAlerta] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = useState(0);
  const [alerta2, setAlerta2] = useState("");
  const [showAlert2, setShowAlert2] = useState(false);
  const [values, setValues] = React.useState({
    mail: "",
    password: "",
    nombre: "",
    img_url: "",
    showPassword: false,
    registrar: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const navigate = useNavigate();

  const Registrar = () => {
    setValues({
      ...values,
      registrar: !values.registrar,
    });
  };

  const Restaurar = () => {
    if (values.mail !== ""){
      reset(values.mail).then(res => {
        message.success('Consulte su correo')
      }).catch(e => {
        message.error(e)
      })
    }
    else message.error('Complete el campo "Email"')
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function doLoginGoogle() {
    logInConGoogle().then((res) => {
      if (res === "") {
        setShowAlert(false);
        navigate("/home");
      } else {
        setShowAlert(true);
        if (res === "Firebase: Error (auth/popup-closed-by-user).")
          setAlerta("La ventana PopUp fue cerrada por el usuario");
        else setAlerta(res);
      }
    });
  }

  function logInConMailyContraseña() {
    logInConMail(values.mail, values.password)
      .then((res) => {
        if (res === "") {
          setShowAlert(false);
          navigate("/home");
        } else {
          setShowAlert(true);
          if (res === "Firebase: Error (auth/invalid-email).")
            setAlerta("Email invalido");
          else if (res === "Firebase: Error (auth/internal-error).")
            setAlerta("Email o contraseña incorrecta");
          else if (res === "Firebase: Error (auth/wrong-password).")
            setAlerta("Contraseña incorrecta");
          else if (res === "Firebase: Error (auth/network-request-failed).")
            setAlerta("Compruebe su conexión ");
          else if (res === "Firebase: Error (auth/user-not-found).")
            setAlerta("Usuario no encontrado");
          else setAlerta(res);
        }
      })
      .catch((e) => {
        setAlerta(e.message);
      });
  }

  function logUp() {
    if (
      values.nombre !== "" &&
      values.mail !== "" &&
      values.img_url !== "" &&
      values.password !== ""
    ) {
      logUpConMail(
        values.mail,
        values.password,
        values.img_url,
        values.nombre
      ).then((res) => {
        if (res === "") {
          setShowAlert2(false);
          navigate("/home");
        } else {
          setShowAlert2(true);
          setAlerta2(res);
        }
      });
    } else {
      setAlerta2("Complete todos los campos");
      setShowAlert2(true);
    }
  }

  function onUpload(event) {
    const file = event.target.files[0];
    const storageRef = ref(storage, `fotos/${file.name}`);

    uploadBytes(storageRef, file);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setState(progress);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(ref(storage, `fotos/${file.name}`)).then((url) => {
          setValues({ ...values, img_url: url });
          setState(0);
        });
      }
    );
  }

  const Demo = () => {
    return (
      <div>
        <div className="input-group">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile04"
              aria-describedby="inputGroupFileAddon04"
              onChange={(e) => onUpload(e)}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile04">
              *Elegir Imagen...
            </label>
          </div>
        </div>
        <progress style={{width: '100%'}} value={"" + state} max="100"></progress>
        <img src={values.img_url} className="img-fluid mt-4" alt="" /> <br />
      </div>
    );
  };

  return (
    <div className="start login">
      <div className="container-fluid contenedor">
        <div className="row">
          <div className="col-lg-4">
            <div id="logo" style={{maxWidth: '85%'}}>
              <svg
                className="pt-3 pl-3 img-fluid logoRojo"
                width="470"
                height="183"
                viewBox="0 0 470 183"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44.3529 0.937747C44.3529 1.35578 44.8647 1.77381 45.5471 1.77381C46.9118 1.77381 48.9588 4.61644 49.8118 7.62627C50.1529 8.79678 51.3471 11.9738 52.4559 14.7328C63.8853 43.4099 64.2265 44.5804 61.1559 46.4197C59.8765 47.1722 59.1941 46.8378 57.3176 44.5804C56.0382 43.0755 53.8206 39.6476 52.5412 37.0558C51.1765 34.464 48.7882 30.2001 47.1676 27.6083C45.6324 25.0164 44.3529 22.1738 44.3529 21.2542C44.3529 19.164 42.05 15.9869 40.4294 15.9869C38.5529 15.9869 38.9794 17.3246 42.4765 21.8394C44.2676 24.1804 47.7647 30.1165 50.2382 35.0492C52.7118 39.982 55.1 44.664 55.5265 45.5001C57.1471 48.4263 55.6118 47.841 52.0294 44.246C50.0676 42.2394 48.8735 41.4033 49.3 42.323C49.8118 43.2427 51.0059 44.7476 51.9441 45.5837C52.9676 46.5033 53.7353 47.9246 53.7353 48.7607C53.7353 51.0181 51.5176 54.9476 49.8118 55.6165C47.6794 56.3689 39.7471 50.0148 35.5676 44.246C32.2412 39.6476 30.7059 38.3935 30.7059 40.2328C30.7059 40.7345 34.3735 44.7476 38.8088 49.1787C43.5 53.7771 46.9118 57.7902 46.7412 58.5427C46.3147 60.5492 42.3059 60.6328 38.2118 58.5427C33.7765 56.3689 28.5735 52.3558 21.8353 45.9181C19.1059 43.2427 16.3765 41.3197 15.95 41.6542C15.3529 41.9886 16.2059 43.0755 17.8265 44.3296C19.3618 45.5001 23.6265 48.9279 27.2941 51.9378C36.7618 59.7968 38.6382 61.1345 39.8324 61.1345C41.3676 61.1345 42.2206 65.064 40.9412 66.5689C40.3441 67.2378 39.5765 67.5722 39.15 67.3214C38.7235 67.0705 38.3824 67.2378 38.3824 67.7394C38.3824 68.1574 38.8088 68.8263 39.3206 69.1607C40.9412 70.0804 38.2971 71.1673 34.2882 71.1673C27.1235 71.1673 8.7 65.2312 4.09412 61.3017C2.55882 60.0476 0 60.4656 0 61.8869C0 62.305 1.45 63.141 3.24118 63.6427C4.94706 64.2279 9.12647 65.7328 12.3676 66.9869C15.6941 68.241 19.7029 69.5788 21.3235 70.0804C31.9853 73.0902 34.9706 74.1771 35.3971 75.1804C35.5676 75.7656 35.3118 76.4345 34.6294 76.6853C32.9235 77.3542 16.8882 72.923 15.0118 71.2509C13.6471 70.164 13.4765 70.164 13.8176 71.1673C13.9882 71.8361 16.9735 73.2574 20.5559 74.3443C24.0529 75.4312 28.5735 77.0197 30.7059 77.9394C32.8382 78.7755 35.4824 79.6115 36.6765 79.6951C38.5529 79.946 38.8088 80.2804 38.6382 82.8722C38.2971 87.8053 38.9794 89.3938 42.2206 90.3971C43.8412 90.8988 45.4618 91.902 45.8029 92.4873C46.2294 93.0725 48.3618 95.4971 50.5794 97.8381C54.6735 102.018 54.6735 102.018 59.5353 101.768L64.3971 101.517L64.9941 98.2561C65.9324 92.9889 65.7618 92.0692 63.4588 89.8119C62.1794 88.6414 61.2412 86.802 61.2412 85.8824C61.4118 83.2902 62.1794 77.605 62.4353 77.5214C62.6059 77.5214 64.0559 76.1837 65.7618 74.6787C67.3823 73.1738 69.6853 71.8361 70.7088 71.5853C73.0971 71.1673 75.2294 69.5787 74.6324 68.6591C74.3765 68.3246 75.0588 66.9869 75.9971 65.8165C77.5323 63.8935 78.0441 63.7263 79.0676 64.646C79.8353 65.2312 81.7971 65.7328 83.5029 65.8165C85.2088 65.9001 88.1088 66.5689 89.9853 67.405C91.8618 68.1574 94.4206 68.9099 95.7 68.9935C96.8941 68.9935 97.7471 69.3279 97.4912 69.6624C96.7235 71.0001 98.6853 70.2476 99.9647 68.8263C102.438 65.9837 102.438 64.4787 99.9647 63.4755C98.6853 62.8902 97.5765 62.3886 97.4059 62.305C96.8941 62.0542 100.05 54.864 101.329 53.4427C102.012 52.6902 105.082 51.1853 108.238 50.2656C111.309 49.2624 114.379 48.2591 115.062 48.0919C115.744 47.9246 116 47.5066 115.744 47.2558C115.488 47.005 112.076 47.9246 108.238 49.2624C97.6618 52.8574 95.6147 53.1083 90.7529 51.1017C88.5353 50.0984 84.6971 48.9279 82.3088 48.4263C80.0059 48.0083 77.1912 47.0886 76.0824 46.4197C75.0588 45.7509 73.7794 45.4165 73.4382 45.6673C72.4147 46.2525 69.0882 42.0722 69.0882 40.3164C69.0882 38.1427 64.9088 30.9525 60.9 26.2705C58.2559 23.2607 57.1471 21.2542 57.1471 19.4984C57.1471 16.1542 55.7824 12.7263 53.4794 10.1345C52.4559 8.96399 50.8353 6.7066 49.9823 5.11807C47.7647 1.10496 44.3529 -1.48684 44.3529 0.937747Z"
                  fill="#C1121F"
                />
                <path
                  d="M45.1206 35.8017C45.5471 36.6377 46.4853 38.0591 47.253 38.9787C48.4471 40.4836 48.4471 40.4 47.5941 37.4738C47.0824 35.8017 46.0588 34.3804 45.4618 34.3804C44.6088 34.3804 44.5236 34.7984 45.1206 35.8017Z"
                  fill="#C1121F"
                />
                <path
                  d="M100.234 107.373C105.174 111.2 105.409 113.387 105.409 147.007V182.267H111.289C116.935 182.267 117.17 181.72 117.17 163.133V144H128.931C135.517 144 140.692 142.633 140.692 141.267C140.692 139.627 135.517 138.533 128.931 138.533H117.17V123.5V108.467H127.284C138.34 108.467 140.927 110.107 144.926 118.033C147.513 123.227 147.513 123.227 147.748 116.393C147.748 104.913 143.985 103 118.581 103C96.4704 103 95.2943 103.273 100.234 107.373Z"
                  fill="white"
                />
                <path
                  d="M291.938 107.92C294.291 110.653 295.937 116.12 295.937 120.22C295.937 126.78 295.231 127.053 287.94 125.686C278.06 123.773 271.239 128.146 266.299 139.08C258.302 157.393 267.711 182.266 283 182.266C286.999 182.266 291.468 180.9 293.115 178.986C295.231 176.526 296.643 176.526 298.76 178.986C306.522 188.006 307.698 183.086 307.698 144.273C307.698 103.273 307.698 103 294.291 103C288.41 103 288.41 103.273 291.938 107.92ZM295.467 148.1C296.408 170.24 294.761 176.8 288.175 176.8C279.942 176.8 277.12 171.606 277.12 155.48C277.12 136.62 280.177 129.786 288.41 130.88C294.526 131.7 294.761 132.52 295.467 148.1Z"
                  fill="white"
                />
                <path
                  d="M349.097 105.187C348.156 107.1 334.278 143.453 323.928 170.513C321.576 177.073 320.635 182.267 321.811 182.267C323.223 182.267 325.81 177.347 327.927 171.333L331.691 160.4H346.509C360.387 160.4 361.328 160.673 363.916 168.327C366.974 176.527 374.971 182.267 383.439 182.267C388.143 182.267 388.143 181.993 382.733 175.98C379.676 172.7 371.913 154.933 365.327 136.347C354.272 104.64 351.92 100.267 349.097 105.187ZM352.39 137.44C354.977 144.547 357.094 151.107 357.094 152.473C357.094 153.84 352.39 154.933 346.509 154.933C340.629 154.933 335.925 153.84 335.925 152.2C335.925 149.467 345.804 124.867 346.98 124.867C347.215 124.867 349.567 130.607 352.39 137.44Z"
                  fill="#C1121F"
                />
                <path
                  d="M444.596 111.747C442.95 113.66 441.774 117.76 441.774 121.04C441.774 124.32 440.362 127.873 438.951 128.42C436.599 129.513 436.599 130.06 438.951 130.06C440.833 130.333 441.774 136.347 441.774 150.287C441.774 174.34 445.537 182.267 456.592 182.267C460.826 182.267 465.766 180.9 467.648 179.533C470.235 177.62 469.294 176.8 463.649 176.8H455.887V156.3C455.887 145.093 455.652 134.98 455.416 133.613C454.946 132.52 457.063 131.427 460.121 130.88C466.942 129.787 466.942 125.687 460.121 125.96C455.416 126.233 454.711 125.14 455.416 117.213C456.122 110.107 455.416 108.467 451.888 108.467C449.301 108.467 446.243 109.833 444.596 111.747Z"
                  fill="#C1121F"
                />
                <path
                  d="M164.919 127.6C158.804 130.606 152.453 143.726 152.453 153.566C152.453 162.86 158.333 175.98 163.979 179.533C171.27 183.906 184.443 182.813 190.323 177.073C193.381 174.066 195.263 171.06 194.322 169.966C193.381 168.873 191.029 169.966 188.912 172.426C179.974 182.54 166.566 175.433 166.566 160.673C166.566 155.48 167.977 154.933 181.855 154.933C196.674 154.933 197.145 154.66 197.145 147.826C197.145 137.986 185.384 124.866 176.68 125.14C173.152 125.14 167.742 126.233 164.919 127.6ZM181.62 134.706C182.326 137.166 183.031 142.086 183.031 145.64C183.031 151.38 181.855 152.2 174.799 152.2C167.272 152.2 166.566 151.38 166.566 144.546C166.566 140.446 167.742 135.526 169.389 133.613C173.387 128.966 179.974 129.513 181.62 134.706Z"
                  fill="white"
                />
                <path
                  d="M215.727 132.793C200.908 150.013 210.552 182.267 230.546 182.267C238.779 182.267 248.893 175.98 248.893 170.787C248.893 169.147 247.011 169.693 244.894 172.153C236.897 180.08 227.018 179.26 223.489 169.967C218.079 156.3 219.491 154.933 235.956 154.933C250.54 154.933 251.245 154.66 251.245 148.373C251.245 137.987 248.893 133.067 241.601 128.967C231.487 122.68 223.489 124.047 215.727 132.793ZM237.603 136.893C241.366 146.733 238.543 152.2 230.075 152.2C221.608 152.2 219.491 147.827 222.784 137.713C225.842 128.147 233.839 127.873 237.603 136.893Z"
                  fill="white"
                />
                <path
                  d="M390.025 126.78C390.025 127.327 391.672 129.787 393.553 131.973C396.141 134.98 397.082 142.36 397.082 159.307C397.082 181.993 397.082 182.267 402.962 182.267C408.608 182.267 408.608 181.72 409.313 158.213L410.019 134.433H418.722C428.601 134.433 430.953 131.153 424.838 126.507C421.78 124.32 418.722 124.593 413.782 126.78C409.313 128.693 403.433 128.967 398.258 127.6C393.789 126.507 390.025 125.96 390.025 126.78Z"
                  fill="#C1121F"
                />
              </svg>
            </div>

            <div id="hombreLogin">
              <svg
                className="img-fluid imgLogin"
                width="325"
                height="561"
                viewBox="0 0 325 561"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M125.605 546.854L140.143 546.853L147.061 496.181L125.601 496.182L125.605 546.854Z"
                  fill="#FFB6B6"
                />
                <path
                  d="M125.092 560.559L169.804 560.557V560.046C169.804 555.876 167.97 551.877 164.706 548.928C161.443 545.979 157.016 544.323 152.401 544.322H152.4L144.233 538.724L128.995 544.323L125.092 544.323L125.092 560.559Z"
                  fill="#2F2E41"
                />
                <path
                  d="M149.084 485.547L160.53 493.647L200.56 457.611L183.666 445.655L149.084 485.547Z"
                  fill="#FFB6B6"
                />
                <path
                  d="M139.327 496.05L174.526 520.961L174.874 520.559C177.72 517.276 179.006 513.106 178.45 508.966C177.893 504.827 175.539 501.056 171.906 498.484L171.905 498.484L169.297 489.526L153.48 485.443L150.407 483.269L139.327 496.05Z"
                  fill="#2F2E41"
                />
                <path
                  d="M217.537 254.665C217.537 254.665 236.834 272.746 228.258 314.721L235.458 386.591L237.316 389.918C238.423 391.901 238.81 394.149 238.421 396.342C238.032 398.534 236.887 400.56 235.149 402.13V402.13L233.618 406.419L232.188 414.814L178.943 487.14L158.573 467.767L191.45 399.962L182.516 382.526L161.79 321.824L147.495 432.896L150.354 528.469H122.995L106.042 421.918L88.1744 272.101L97.4685 254.665H217.537Z"
                  fill="#2F2E41"
                />
                <path
                  d="M92.6304 285.734L92.4354 285.486C82.0218 272.314 97.6839 240.66 100.046 236.071C97.2411 235.248 94.8383 233.573 93.247 231.329C91.6557 229.086 90.9743 226.414 91.3188 223.767L92.3371 215.946L93.3986 208.275L85.7943 201.404L85.7729 201.233L81.3968 166.635L75.034 143.656C72.6366 134.969 72.8409 125.862 75.626 117.27C78.4111 108.678 83.6766 100.911 90.882 94.7648L105.589 92.6547L123.464 77.094H152.288L162.171 85.6257C180.621 88.5493 183.79 87.5947 199.638 104.778L192.437 158.2L190.64 165.549L190.646 175.517L195.213 180.103C196.858 181.755 198.054 183.731 198.704 185.875C199.355 188.018 199.442 190.269 198.96 192.448L198.359 195.161C203.069 196.985 207.564 229.398 208.638 233.926L210.242 240.689C211.614 242.325 220.673 253.238 220.673 256.222C220.673 256.67 220.307 257.102 219.522 257.583C213.348 261.36 188.737 288.152 173.636 282.692C157.55 276.881 93.6069 285.598 92.9627 285.687L92.6304 285.734Z"
                  fill="#C1121F"
                />
                <path
                  d="M88.7578 223.612C88.7578 223.612 96.1599 185.815 88.7028 171.6L59.12 173.509L63.6221 227.432L89.4829 287.302C89.0882 289.147 89.2407 291.053 89.9249 292.827C90.6091 294.601 91.8006 296.18 93.3786 297.404C94.9565 298.627 96.8647 299.452 98.9093 299.794C100.954 300.136 103.062 299.982 105.02 299.35C106.978 298.718 108.716 297.628 110.058 296.193C111.399 294.757 112.296 293.026 112.658 291.176C113.02 289.326 112.833 287.423 112.118 285.659C111.402 283.895 110.182 282.333 108.583 281.133L88.7578 223.612Z"
                  fill="#FFB6B6"
                />
                <path
                  d="M59.12 151.553L60.9509 133.539C61.6399 126.759 63.8058 120.169 67.3239 114.148C70.842 108.127 75.6429 102.794 81.4504 98.4553V98.4553C85.0588 95.7796 89.4236 94.0691 94.0515 93.5171C98.6793 92.9652 103.386 93.5937 107.639 95.3317V95.3317C113.387 97.7228 117.916 101.997 120.309 107.289C122.703 112.582 122.783 118.498 120.534 123.842C113.696 140.044 116.165 157.178 102.833 159.267L104.282 165.494L91.1729 204.146L53.8373 200.238L59.12 151.553Z"
                  fill="#C1121F"
                />
                <path
                  d="M256.032 205.698C256.032 205.698 234.363 172.682 218.451 166.299L197.402 185.177L239.733 223.404L302.55 253.554C303.583 255.185 305.074 256.541 306.873 257.482C308.672 258.424 310.715 258.919 312.795 258.917C314.874 258.915 316.916 258.416 318.712 257.47C320.509 256.524 321.997 255.166 323.025 253.533C324.053 251.9 324.584 250.05 324.565 248.171C324.546 246.293 323.977 244.452 322.916 242.836C321.855 241.22 320.34 239.887 318.524 238.971C316.708 238.056 314.657 237.591 312.578 237.623L256.032 205.698Z"
                  fill="#FFB6B6"
                />
                <path
                  d="M181.555 168.532L169.941 153.797C165.57 148.251 162.455 141.978 160.777 135.341C159.098 128.703 158.888 121.832 160.16 115.121V115.121C160.964 110.966 163.039 107.098 166.149 103.952C169.259 100.807 173.28 98.5103 177.759 97.3218V97.3218C183.843 95.7477 190.361 96.3194 195.995 98.9213C201.63 101.523 205.961 105.961 208.113 111.338C214.623 127.65 238.37 154.458 229.77 163.897L235.362 167.764L243.813 189.517L212.689 208.554L181.555 168.532Z"
                  fill="#C1121F"
                />
                <path
                  d="M135.931 69.5769C153.61 69.5769 167.942 56.6275 167.942 40.6536C167.942 24.6797 153.61 11.7303 135.931 11.7303C118.252 11.7303 103.92 24.6797 103.92 40.6536C103.92 56.6275 118.252 69.5769 135.931 69.5769Z"
                  fill="#FFB6B6"
                />
                <path
                  d="M112.7 61.0402C112.42 60.8188 112.156 60.5824 111.883 60.3548C111.874 60.3781 111.872 60.4021 111.862 60.4253L112.7 61.0402Z"
                  fill="#2F2E41"
                />
                <path
                  d="M162.164 10.1105C160.574 7.79714 158.371 5.87801 155.754 4.52632C153.965 3.74254 152.086 3.14088 150.15 2.73242L145.084 1.48353C142.489 0.757817 139.818 0.271966 137.114 0.0334744C133.358 -0.133908 129.624 0.634348 126.32 2.25432C123.015 3.87429 120.266 6.28367 118.374 9.21931C116.843 11.6722 115.616 14.7289 112.662 15.6263C110.28 16.3499 107.681 15.3292 105.177 15.5272C103.711 15.7193 102.319 16.2353 101.125 17.0296C99.9319 17.8239 98.9737 18.8718 98.3357 20.0807C97.0881 22.5133 96.4741 25.1719 96.5408 27.8524C96.4424 33.9379 97.7569 39.9745 100.4 45.5728C103.042 51.171 106.954 56.2067 111.883 60.3548C112.709 58.3871 111.349 56.2627 110.273 54.3803C109.184 52.4757 108.512 49.8203 110.335 48.4486C112.363 46.9222 115.613 48.4023 118.012 47.4069C118.78 47.0086 119.426 46.4447 119.894 45.7657C120.361 45.0866 120.636 44.3135 120.692 43.5154C120.924 41.9339 120.682 40.3263 120.791 38.734C120.9 37.1556 121.354 35.6124 122.127 34.1934C122.9 32.7744 123.976 31.5077 125.293 30.4666C126.611 29.4255 128.143 28.6305 129.803 28.1275C131.462 27.6246 133.215 27.4237 134.961 27.5363C140.422 27.8888 145.721 31.2602 150.976 29.8732C153.443 29.2222 155.547 27.5645 158.098 27.2857C160.923 26.9769 163.581 28.4176 165.98 29.8009C166.852 26.4563 166.963 22.9867 166.307 19.6021C165.651 16.2175 164.242 12.9885 162.164 10.1105Z"
                  fill="#2F2E41"
                />
                <path
                  d="M39.921 545.476L31.7849 533.425L30.1597 540.311C29.8748 541.518 29.5899 542.743 29.3261 543.959C27.015 542.14 24.5562 540.457 22.1504 538.843C14.7635 533.902 7.38004 528.954 0 524L2.31099 536.353C3.73571 543.959 5.2238 551.721 8.74825 558.675C9.13882 559.463 9.56082 560.241 10.0148 561H44.3534C44.6296 560.295 44.8207 559.565 44.9232 558.821C44.9318 558.773 44.9352 558.724 44.9335 558.675C45.472 553.958 42.6437 549.513 39.921 545.476Z"
                  fill="#F0F0F0"
                />
              </svg>
            </div>
          </div>
          <div className="col-lg-8 col-sm-12 d-flex justify-content-center">
            <div className="rectangulo container text-center">
              {!values.registrar ? (
                <div>
                  <h1 className="texto">Iniciar Sesion</h1>
                  <br />
                  <button className="btn googleButton" onClick={doLoginGoogle}>
                    <img
                      alt=""
                      src="https://img.icons8.com/cute-clipart/25/000000/google-logo.png"
                    />{" "}
                    Sign in with Google
                  </button>
                  <br />
                  <br />
                  <h3 className="sub">- O -</h3>
                  <div className="row container px-5">
                    <TextField
                      className="mb-5"
                      type="email"
                      id="standard-basic"
                      value={values.mail}
                      onChange={handleChange("mail")}
                      label="Email"
                      variant="standard"
                    />

                    <FormControl className="mb-5" variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">
                        Contraseña
                      </InputLabel>
                      <Input
                        id="standard-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {showAlert ? (
                      <Alert
                        message="Error"
                        description={alerta}
                        type="error"
                        showIcon
                        className="mb-4"
                      />
                    ) : (
                      <span></span>
                    )}

                    <button
                      type="button"
                      onClick={logInConMailyContraseña}
                      className="btn btn-info btn-block btn-lg mb-4"
                    >
                      Iniciar Sesion
                    </button>
                    <p className="subtitulo">
                      ¿Todavía no tienes una cuenta?{" "}
                      <span onClick={Registrar}> Registrate </span>
                    </p>
                    {/* <p className="subtitulo">
                      ¿Olvidaste tu contraseña?{" "}
                      <span className="span" onClick={Restaurar}> Restaurar </span>
                    </p> */}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="texto">Registrarse</h1>
                  <br />
                  <button className="btn googleButton" onClick={doLoginGoogle}>
                    <img
                      alt=""
                      src="https://img.icons8.com/cute-clipart/25/000000/google-logo.png"
                    />{" "}
                    Sign up with Google
                  </button>
                  <br />
                  <br />
                  <h3 className="sub">- O -</h3>
                  <div className="row container px-5">
                    <Demo></Demo>
                    <TextField
                      className="mb-5"
                      type="text"
                      id="standard-basic"
                      value={values.nombre}
                      onChange={handleChange("nombre")}
                      label="*Nombre"
                      variant="standard"
                      autoComplete="off"
                    />
                    <TextField
                      className="mb-5"
                      type="email"
                      id="standard-basic"
                      value={values.mail}
                      onChange={handleChange("mail")}
                      label="*Email"
                      variant="standard"
                      autoComplete="off"
                    />

                    <FormControl className="mb-5" variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">
                        *Contraseña
                      </InputLabel>
                      <Input
                        id="standard-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        autoComplete="off"
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {showAlert2 ? (
                      <Alert
                        message="Error"
                        description={alerta2}
                        type="error"
                        showIcon
                        className="mb-4"
                      />
                    ) : (
                      <span></span>
                    )}
                    <button
                      type="button"
                      onClick={logUp}
                      className="btn btn-info btn-block btn-lg mb-4"
                    >
                      Registrarse
                    </button>
                    <p className="subtitulo">
                      ¿Ya tienes una cuenta?{" "}
                      <span onClick={Registrar}> Inicia Sesion </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Login;
