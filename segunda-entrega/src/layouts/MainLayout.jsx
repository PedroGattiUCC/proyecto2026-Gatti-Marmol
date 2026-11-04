import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer.jsx';
import Header from '@components/Header.jsx';
import '@styles/MainLayout.scss';

/**
 * Arma la estructura común de las páginas y renderiza la ruta hija en el main
 * @method MainLayout
 * @param {Object} props - Cantidad y error del carrito, usuario activo y acción de salir
 * @return {JSX.Element} Cabecera, contenido de la ruta actual y pie
 */
const MainLayout = ({ cantidad, errorCarrito, usuario, onSalir }) => {
  return (
    <div className="contenedor-sitio">
      <Header cantidad={cantidad} usuario={usuario} onSalir={onSalir} />
      <main className="contenido">
        {errorCarrito && <p className="carrito-error" role="alert">{errorCarrito}</p>}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
