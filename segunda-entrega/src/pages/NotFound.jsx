import { Link } from 'react-router-dom';
import '@styles/NotFound.scss';

/**
 * Muestra la página de error 404
 * @method NotFound
 * @return {JSX.Element} Contenido de la página
 */
const NotFound = () => {
  return (
    <section className="notfound">
      <h2>404</h2>
      <h3>Pieza no encontrada</h3>
      <p>
        La página o pieza que buscás no se encuentra disponible o cambió de ubicación. Te invitamos a explorar nuestro catálogo de piezas exclusivas.
      </p>
      <div className="notfound-acciones">
        <Link to="/" className="notfound-accion-principal">
          Volvé al inicio
        </Link>
        <Link to="/catalogo" className="notfound-accion-secundaria">
          Explorá el catálogo
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
