import { Link } from 'react-router-dom';
import Button from '@components/Button.jsx';
import '@styles/Carrito.scss';

/**
 * Muestra las piezas seleccionadas con cantidades y total
 * @method Carrito
 * @param {Object} props - Productos y acciones del carrito
 * @return {JSX.Element} Detalle del pedido o mensaje de carrito vacío
 */
const Carrito = ({ productos, onCantidad, onEliminar, pedido, onConfirmar }) => {
  const total = productos.reduce((importe, producto) => importe + producto.precio * producto.cantidad, 0);

  return (
    <section className="carrito">
      <h2>Carrito</h2>
      {pedido.mensaje && <p role="status">{pedido.mensaje}</p>}
      {pedido.error && <p className="carrito-error" role="alert">{pedido.error}</p>}
      {productos.length === 0 ? (
        <p>Tu carrito está vacío. <Link to="/catalogo">Explorá el catálogo</Link> o <Link to="/cotizador">cotizá una pieza</Link>.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {productos.map((producto) => (
              <li className="carrito-linea" key={producto.id}>
                <div>
                  <h3>{producto.nombre}</h3>
                  <p>$ {producto.precio.toLocaleString('es-AR')} ARS por unidad</p>
                </div>
                <div className="carrito-cantidad">
                  <label htmlFor={`cantidad-${producto.id}`}>Cantidad de {producto.nombre}</label>
                  <select id={`cantidad-${producto.id}`} value={producto.cantidad} disabled={pedido.enviando} onChange={(evento) => onCantidad(producto.id, Number(evento.target.value))}>
                    {Array.from({ length: 99 }, (_, indice) => <option key={indice + 1} value={indice + 1}>{indice + 1}</option>)}
                  </select>
                </div>
                <p>Subtotal: $ {(producto.precio * producto.cantidad).toLocaleString('es-AR')} ARS</p>
                <Button disabled={pedido.enviando} variante="secundario" onClick={() => onEliminar(producto.id)}>Eliminá {producto.nombre}</Button>
              </li>
            ))}
          </ul>
          <p className="carrito-total" aria-live="polite">Total: $ {total.toLocaleString('es-AR')} ARS</p>
          <Button onClick={onConfirmar} disabled={pedido.enviando || pedido.registrado}>
            {pedido.enviando ? 'Registrando pedido...' : 'Confirmá el pedido de prueba'}
          </Button>
        </>
      )}
    </section>
  );
};

export default Carrito;
