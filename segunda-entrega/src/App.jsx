import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout.jsx';

/**
 * Componente principal: usa MainLayout como base de la aplicación
 * @method App
 * @return {JSX.Element} Rutas de la aplicación
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
