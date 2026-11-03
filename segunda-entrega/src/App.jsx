import { useState } from 'react';
import { leerCarrito, guardarCarrito } from '@/data/carrito.js';
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
  const [estadoCarrito, setEstadoCarrito] = useState(leerCarrito);
  const carrito = estadoCarrito.productos;

  /**
   * Guarda un cambio e informa si el navegador impide persistirlo
   * @method actualizarCarrito
   * @param {Array} productos - Nuevo contenido del carrito
   * @return {boolean} Indica si el cambio se guardó
   */
  const actualizarCarrito = (productos) => {
    try {
      guardarCarrito(productos);
      setEstadoCarrito({ productos, error: '' });
      return true;
    } catch {
      setEstadoCarrito({ productos: carrito, error: 'No se pudo guardar el carrito. Revisá el almacenamiento del navegador e intentá de nuevo.' });
      return false;
    }
  };

  /**
   * Agrega una unidad o incrementa la línea existente
   * @method agregarProducto
   * @param {Object} producto - Pieza del catálogo o del cotizador
   * @return {boolean} Indica si se agregó la unidad
   */
  const agregarProducto = (producto) => {
    const id = String(producto.id);
    const existente = carrito.find((linea) => linea.id === id);
    if (existente && existente.cantidad >= 99) {
      setEstadoCarrito({ productos: carrito, error: 'Podés agregar hasta 99 unidades de cada pieza.' });
      return false;
    }
    const productos = existente
      ? carrito.map((linea) => linea.id === id ? { ...linea, cantidad: linea.cantidad + 1 } : linea)
      : [...carrito, { id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    return actualizarCarrito(productos);
  };

  /**
   * Cambia una cantidad entera dentro del rango permitido
   * @method cambiarCantidad
   * @param {string} id - Identificador de la línea
   * @param {number} cantidad - Unidades entre 1 y 99
   * @return {void} No retorna un valor
   */
  const cambiarCantidad = (id, cantidad) => {
    if (Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 99) {
      actualizarCarrito(carrito.map((linea) => linea.id === id ? { ...linea, cantidad } : linea));
    }
  };

  /**
   * Quita una pieza del carrito
   * @method eliminarProducto
   * @param {string} id - Identificador de la línea
   * @return {void} No retorna un valor
   */
  const eliminarProducto = (id) => {
    actualizarCarrito(carrito.filter((linea) => linea.id !== id));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout cantidad={carrito.reduce((total, producto) => total + producto.cantidad, 0)} errorCarrito={estadoCarrito.error} />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo onAgregar={agregarProducto} />} />
          <Route path="cotizador" element={<Cotizador />} />
          <Route path="carrito" element={<Carrito productos={carrito} onCantidad={cambiarCantidad} onEliminar={eliminarProducto} />} />
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
