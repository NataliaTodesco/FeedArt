import React from "react";
import logo from "../../img/logoHorizontal.svg";
import { Accordion } from "react-bootstrap";
import "./footer.css";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

function Contact() {
  function alerta() {
    message.success("¡Mensaje enviado con éxito!");
    document.getElementById("form").submit();
  }

  const history = useNavigate();

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "99.9vh", background: "rgb(237, 237, 241)" }}
    >
      <div className="row pt-1 pr-4">
        <div className="col-9">
          <img src={logo} className="img-fluid" alt="" />
        </div>
        <div className="col-3 mt-4">
          <button
            className="btn btn-danger float-right"
            onClick={() => history(-1)}
          >
            <i
              className="bi bi-arrow-left-circle mr-2"
              style={{ fontSize: "medium" }}
            ></i>
            Volver
          </button>
        </div>
      </div>
      <div className="container">
        <div className="row my-3">
          <div className="col-lg-6 mb-2">
            <h1 className="text-center" style={{ fontWeight: "800" }}>
              PREGUNTAS FRECUENTES
            </h1>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  ¿Cómo puedo recibir el pago al vender un proyecto?
                </Accordion.Header>
                <Accordion.Body>
                  Cuando un proyecto sea vendido se le enviará al correo
                  electrónico del vendedor, en la dirección con la que se
                  registró a FeedArt, un email por parte de PayPal con los pasos
                  a seguir para obtener el pago correspondiente a dicha compra.
                  En este caso será necesario iniciar sesión a una cuenta PayPal
                  con dicho correo electrónico o crearse una nueva. <br />
                  El hecho de no tener una cuenta PayPal creada a la hora de
                  realizarse la compra, no será un impedimento para recibir el
                  pago.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  ¿Qué necesito para comprar un proyecto?
                </Accordion.Header>
                <Accordion.Body>
                  A la hora de comprar un proyecto por medio de PayPal no es
                  necesario que el usuario tenga una cuenta previamente
                  registrada en dicha plataforma pero se requerirá a la hora de
                  efectuar los pagos en caso de que el método elegido sea ese.
                  Al comprador se le dará la opción de ingresar a su cuenta
                  PayPal o crearse una nueva al realizar la comprá del proyecto.
                  <br /> En caso de que la compra sea por medio de una tarjeta
                  de crédito o débito no será requerida una cuenta en PayPal.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  ¿A qué dirección de email me puedo contactar para hacer una
                  sugerencia o reclamo?
                </Accordion.Header>
                <Accordion.Body>
                  Si el motivo de su duda, sugerencia o reclamo está asociado a
                  los pagos de la compra o venta de un proyecto por medio de
                  PayPal le recomendamos al usuario contactarse directamente con
                  PayPal o consultar su sección de “Preguntas Frecuentes” en el
                  siguiente Link:{" "}
                  <a
                    target="_blank"
                    href="https://www.paypal.com/ar/webapps/mpp/shop/faq?locale.x=es_AR."
                    rel="noreferrer"
                  >
                    PayPal Preguntas Frecuentes
                  </a>{" "}
                  <br />
                  En caso de que el motivo esté relacionado directamente con el
                  funcionamiento de FeedArt cualquier duda, sugerencia o reclamo
                  puede ser depositada en el formulario de la sección
                  “Contáctame” a la derecha el cual enviará su contenido
                  directamente con el Administrador de FeedArt.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  ¿Cómo funciona el stock de mis proyectos?
                </Accordion.Header>
                <Accordion.Body>
                  FeedArt trata cada uno de tus proyectos como únicos, por lo
                  cual, a la hora de venderlos no será necesario especificar el
                  stock del mismo, ya que, nos enfocamos individualmente en cada
                  uno de tus trabajos como un “Proyecto” en lugar de como un
                  “Producto”. Permitiendo así resaltar las características
                  únicas de tus obras similares y centrarnos en lo que las hace
                  especiales.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className="col-lg-6 mb-2">
            <h1 className="text-center" style={{ fontWeight: "800" }}>
              CONTÁCTAME
            </h1>
            <div className="contacto">
              <form
                id="form"
                action="https://formsubmit.co/nstodesco@gmail.com"
                method="POST"
                className="form-group row"
              >
                <input
                  type="hidden"
                  name="_next"
                  value="https://feedart-3bdc9.web.app/contact"
                />
                <input type="hidden" name="_captcha" value="false" />
                <div>
                  <label>Nombre</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    autoComplete="off"
                    required
                  />{" "}
                  <br />
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Nombre@ejemplo.com"
                    autoComplete="off"
                    required
                  />
                  <br />
                  <label>Mensaje</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="5"
                    placeholder="¡Hola!"
                    autocomplete="nope"
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    className="btn btn-info btn-lg btn-block mb-0 mt-4"
                    type="button"
                    onClick={(e) => alerta()}
                  >
                    <i
                      className="bi bi-send-fill mr-2"
                      style={{ fontSize: "large" }}
                    ></i>
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
