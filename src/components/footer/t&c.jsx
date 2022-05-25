import React from "react";
import { useNavigate } from "react-router-dom";
import "./footer.css";
import logo from "../../img/logoHorizontal.svg";

function Terminos() {
  const history = useNavigate();

  return (
    <div
      className="container-fluid pb-5 tc"
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
      <div className="container mt-5">
        <div className="card p-4" style={{ borderRadius: "0" }}>
          <div className="clip text-center"></div>
          <div
            className="card text-dark"
            style={{ background: "white", borderRadius: "0" }}
          >
            <h2 className="text-center">TÉRMINOS Y CONDICIONES</h2>
            <h3>1- FeedArt</h3>
            <p>
              FeedArt es una aplicación web servicios vinculados principalmente
              a ofrecer oportunidades para conectar, descubrir, compartir,
              aprender y formar parte de una comunidad en línea. Además del
              comercio electrónico y de los pagos digitales. <br />
              <br />
              Los servicios que ofrece FeedArt en el sitio{" "}
              <a href="https://feedart.netlify.app/ ">
                {" "}
                https://feedart.netlify.app/{" "}
              </a>{" "}
              (de ahora en más: “Sitio”) están diseñados para formar un
              ecosistema que permita a las personas compartir,vender, comprar,
              pagar, enviar productos y realizar otras actividades comerciales
              con tecnología aplicada.
            </p>
            <h3>2- Términos y Condiciones</h3>
            <p>
              Estos términos y condiciones regulan la relación entre FeedArt y
              las personas que usan sus servicios (“Personas Usuarias”). <br />
              <br />
              Las Personas Usuarias aceptan estos Términos y Condiciones desde
              el momento en que se registran en el Sitio. <br />
              <br />
              Cuando debamos hacer cambios importantes en nuestros servicios,
              publicaremos las modificaciones con 10 días corridos de
              anticipación para que las Personas Usuarias puedan revisarlas y
              seguir usando FeedArt. En ningún caso afectarán las operaciones
              que ya hayan finalizado. <br />
              <br />
              Las Personas Usuarias que no tengan obligaciones pendientes con
              FeedArt o con otras Personas Usuarias, podrán finalizar la
              relación con FeedArt eliminando su cuenta.
            </p>
            <h3>3- Capacidad</h3>
            <p>
              Podrán usar nuestros servicios las personas mayores de edad que
              tengan capacidad legal para contratar.
              <br />
              <br /> Quien use FeedArt en representación de una empresa deberá
              tener capacidad para contratar a nombre de ella. Además, para
              poder usar la cuenta, la Persona Usuaria debe encontrarse activa.
            </p>
            <h3>4- Registro y Cuenta</h3>
            <p>
              Quien quiera usar nuestros servicios, deberá completar el
              formulario de registro con los datos que le sean requeridos. Al
              completarlo, se compromete a hacerlo de manera exacta, precisa y
              verdadera y a mantener sus datos siempre actualizados. La Persona
              Usuaria será la única responsable de la certeza de sus datos de
              registro. Sin perjuicio de la información brindada en el
              formulario, podremos solicitar y/o consultar información adicional
              para corroborar la identidad de la Persona Usuaria.
              <br />
              <br /> La cuenta es personal, única e intransferible, es decir que
              bajo ningún concepto se podrá vender o ceder a otra persona. Por
              eso, la Persona Usuaria será la única responsable por las
              operaciones que se realicen en su cuenta.
              <br />
              <br /> Podremos rechazar una solicitud de registro o bien cancelar
              un registro ya aceptado, sin que esto genere derecho a un
              resarcimiento. No podrán registrarse nuevamente en el Sitio las
              Personas Usuarias que hayan sido inhabilitadas previamente.
              <br />
              <br /> Además, en caso de detectar el uso de más de una cuenta,
              podremos aplicar retenciones, débitos y/o cualquier otra medida si
              consideramos que ese accionar puede perjudicar al resto de las
              personas que usan el Sitio, más allá de las sanciones que pudieran
              corresponder.
            </p>
            <h3>5- Privacidad de datos</h3>
            <p>
              En FeedArt hacemos un uso responsable de la información personal,
              protegiendo la privacidad de las Personas Usuarias que nos
              confiaron sus datos y tomando las medidas necesarias para
              garantizar la seguridad.
            </p>
            <h3>6- Sanciones</h3>
            <p>
              En caso que la Persona Usuaria incumpliera una ley o los Términos
              y Condiciones, podremos advertir, suspender, restringir o
              inhabilitar temporal o definitivamente su cuenta, sin perjuicio de
              otras sanciones que se establezcan en las reglas de uso
              particulares de los servicios de FeedArt.{" "}
            </p>
            <h3>7- Responsabilidad</h3>
            <p>
              FeedArt será responsable por cualquier defecto en la prestación de
              su servicio, en la medida en que le sea imputable y con el alcance
              previsto en las leyes vigentes.
            </p>
            <h3>8- Tarifas</h3>
            <p>
              FeedArt podrá cobrar por sus servicios y la Persona Usuaria se
              compromete a pagarlos a tiempo.
              <br />
              <br /> Podremos modificar o eliminar las tarifas en cualquier
              momento con el debido preaviso establecido en la cláusula 2 de
              estos Términos y Condiciones. De la misma manera, podremos
              modificar las tarifas temporalmente por promociones en favor de
              las Personas Usuarias.
            </p>
            <h3>9- Propiedad Intelectual</h3>
            <p>
              El contenido del Portal, incluyendo, pero sin limitarse a los
              textos, gráficas, imágenes, logotipos, íconos, software y
              cualquier otro material, al cual en adelante se hará referencia
              como el “Material”, está protegido bajo las leyes aplicables de
              propiedad industrial y propiedad intelectual. Todo el Material es
              de propiedad de FeedArt o de sus proveedores. Queda prohibido
              modificar, copiar, reutilizar, extraer, explotar, reproducir,
              comunicar al público, hacer segundas o posteriores publicaciones,
              cargar o descargar archivos, enviar por correo, transmitir, usar,
              tratar o distribuir de cualquier forma la totalidad o parte de los
              contenidos incluidos en el Portal. El uso no autorizado del
              Material puede constituir una violación de las leyes sobre
              derechos de autor, leyes de propiedad industrial u otras leyes.
              Ningún Usuario podrá vender o modificar el Material de manera
              alguna, ni ejecutar o anunciar públicamente el Material, ni
              distribuirlo para propósitos comerciales.
              <br />
              <br /> Aunque FeedArt otorga permiso para usar sus productos y
              servicios conforme a lo previsto en los Términos y Condiciones,
              esto no implica una autorización para usar su Propiedad
              Intelectual, excepto consentimiento previo y expreso de FeedArt.
              En cualquier caso, los usuarios vendedores que usen dichos
              productos y servicios no podrán utilizar la Propiedad Intelectual
              de FeedArt de una manera que cause confusión en el público y
              deberán llevar a cabo su actividad comercial bajo una marca o
              nombre comercial propio y distintivo, que no resulte confundible
              con FeedArt.
              <br />
              <br /> Está prohibido usar nuestros productos o servicios para
              fines ilegales, realizar cualquier tipo de ingeniería inversa u
              obras derivadas, utilizar herramientas de búsqueda o de extracción
              de datos y contenidos de nuestra plataforma para su reutilización
              y/o crear bases de datos propias que incluyan en todo o en parte
              nuestro contenido sin nuestra expresa autorización. Está también
              prohibido el uso indebido, sin autorización y/o contrario a la
              normativa vigente y/o que genere confusión o implique uso
              denigratorio y/o que le cause perjuicio, daños o pérdidas a
              FeedArt.
              <br />
              <br /> En caso que una Persona Usuaria o cualquier publicación
              infrinja la Propiedad Intelectual de FeedArt o de terceros,
              FeedArt podrá remover dicha publicación total o parcialmente),
              sancionar al usuario conforme a lo previsto en estos Términos y
              Condiciones y ejercer las acciones extrajudiciales y/o judiciales
              correspondientes.
            </p>
            <h3>10- Indemnidad</h3>
            <p>
              La Persona Usuaria mantendrá indemne a FeedArt, así como a quienes
              la administran y/o trabajan en ellas, por cualquier reclamo
              administrativo o judicial iniciado por otras Personas Usuarias,
              terceros o por cualquier Organismo, relacionado con sus
              actividades.
              <br />
              <br /> En virtud de esa responsabilidad, podrán realizar
              compensaciones, retenciones u otras medidas necesarias para la
              reparación de pérdidas, daños y perjuicios, cualquiera sea su
              naturaleza.
            </p>
            <h3>11- Anexos</h3>
            <p>
              Además de estos Términos y Condiciones, FeedArt utiliza los
              servicio proporcionados por PayPal quienes tienen sus propias
              reglas de uso:
              <li>
                <a target='_blank' rel="noreferrer" href="https://www.paypal.com/ar/webapps/mpp/ua/legalhub-full?locale.x=es_AR ">
                  https://www.paypal.com/ar/webapps/mpp/ua/legalhub-full?locale.x=es_AR{" "}
                </a>
              </li>
            </p>
            <h3>12- Jurisdicción y Ley Aplicable</h3>
            <p>
              Estos Términos y Condiciones se rigen por la ley local. Toda
              controversia derivada de su aplicación, interpretación, ejecución
              o validez será resuelta por los tribunales nacionales ordinarios
              competentes, con asiento en la capital, salvo disposición
              específica de normas de orden público, como por ejemplo,
              legislación relativa al Consumidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminos;
