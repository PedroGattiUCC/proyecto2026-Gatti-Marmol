import { Link } from 'react-router-dom';
import '@styles/Contacto.scss';

/**
 * Muestra la página de contacto
 * @method Contacto
 * @return {JSX.Element} Contenido de la página
 */
const Contacto = () => {
  return (
    <section className="contacto">
      <h2>Contacto</h2>
      <p className="contacto-descripcion">
        Laure Joyas es un proyecto académico de Taller de Desarrollo Web de la Universidad Católica de Córdoba.
      </p>

      <div className="contacto-columnas">
        <div className="contacto-columna">
          <h3>Dirección de referencia</h3>
          <address>
            Obispo Trejo 323
            <br />
            Córdoba, Argentina
          </address>
          <p className="contacto-aclaracion">
            Referencia institucional del proyecto; las compras y cotizaciones del sitio son demostraciones.
          </p>
        </div>

        <div className="contacto-columna">
          <h3>Equipo del proyecto</h3>
          <p>Consultas académicas sobre el sitio:</p>
          <ul className="contacto-equipo">
            <li>
              Pedro Gatti — <a href="mailto:2519717@ucc.edu.ar">2519717@ucc.edu.ar</a>
            </li>
            <li>
              Joaquin Mármol — <a href="mailto:2514908@ucc.edu.ar">2514908@ucc.edu.ar</a>
            </li>
          </ul>
          <p className="contacto-aclaracion">
            Los enlaces abren tu aplicación de correo. Este sitio no envía formularios ni confirma la recepción de mensajes.
          </p>
        </div>
      </div>

      <div className="contacto-acciones">
        <Link to="/catalogo" className="contacto-accion-principal">
          Explorá el catálogo
        </Link>
        <Link to="/cotizador" className="contacto-accion-secundaria">
          Cotizá una pieza
        </Link>
      </div>
    </section>
  );
};

export default Contacto;
