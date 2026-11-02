import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout.jsx';
import Carrito from '@pages/Carrito.jsx';
import Catalogo from '@pages/Catalogo.jsx';
import Contacto from '@pages/Contacto.jsx';
import Cotizador from '@pages/Cotizador.jsx';
import Home from '@pages/Home.jsx';
import Login from '@pages/Login.jsx';
import NotFound from '@pages/NotFound.jsx';
import Registro from '@pages/Registro.jsx';

/**
 * Componente principal: define las rutas de las páginas dentro de MainLayout
 * @method App
 * @return {JSX.Element} Rutas de la aplicación
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="cotizador" element={<Cotizador />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
