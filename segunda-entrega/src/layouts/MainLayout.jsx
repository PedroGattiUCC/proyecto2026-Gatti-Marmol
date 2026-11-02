import { Outlet } from 'react-router-dom';
import Footer from '@components/Footer.jsx';
import Header from '@components/Header.jsx';
import '@styles/MainLayout.scss';

/**
 * Arma la estructura común de las páginas y renderiza la ruta hija en el main
 * @method MainLayout
 * @return {JSX.Element} Cabecera, contenido de la ruta actual y pie
 */
const MainLayout = () => {
  return (
    <div className="contenedor-sitio">
      <Header />
      <main className="contenido">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
