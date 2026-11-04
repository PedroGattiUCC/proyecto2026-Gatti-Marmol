import { Link } from 'react-router-dom';
import '@styles/Footer.scss';

/**
 * Muestra el pie del sitio con los datos de la cátedra y los autores
 * @method Footer
 * @return {JSX.Element} Pie de página con la navegación secundaria
 */
const Footer = () => {
  return (
    <footer className="pie">
      <p>Obispo Trejo 323, Córdoba, Argentina</p>
      <p>Cátedra: Taller de Desarrollo Web, Universidad Católica de Córdoba (UCC 2026)</p>
      <p>Autores: Pedro Gatti (Legajo: 2519717) y Joaquín Mármol (Legajo: 2514908)</p>
      <nav aria-label="Navegación secundaria">
        <ul className="pie-enlaces">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/cotizador">Cotizador</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/carrito">Carrito</Link></li>
          <li><Link to="/login">Acceso</Link></li>
          <li><Link to="/registro">Crear cuenta</Link></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
