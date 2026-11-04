import { Link } from 'react-router-dom';
import Button from '@components/Button.jsx';
import '@styles/Header.scss';

/**
 * Muestra la cabecera del sitio con el logo y el menú de navegación
 * @method Header
 * @param {Object} props - Cantidad de unidades del carrito, usuario activo y acción de salir
 * @return {JSX.Element} Cabecera con los enlaces a las páginas
 */
const Header = ({ cantidad, usuario, onSalir }) => {
  return (
    <header className="cabecera">
      <nav className="cabecera-nav" aria-label="Navegación principal">
        <Link to="/" className="cabecera-marca">
          <img className="cabecera-logo" src="/favicon.svg" alt="Logotipo de Laure Joyas" />
          <h1>Laure Joyas</h1>
        </Link>
        <ul className="cabecera-enlaces">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/cotizador">Cotizador</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/carrito">Carrito ({cantidad})</Link></li>
          {usuario ? (
            <li className="cabecera-sesion">
              <span>Hola, <strong>{usuario.nombre}</strong></span>
              <Button variante="secundario" onClick={onSalir}>Salí</Button>
            </li>
          ) : (
            <li><Link to="/login">Acceso</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
