import { useState } from 'react';
import Button from '@components/Button.jsx';
import '@styles/ProductCard.scss';

/**
 * Muestra los datos de un producto en una tarjeta
 * @method ProductCard
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.producto - Producto que se muestra en la tarjeta
 * @param {Function} props.onAgregar - Agrega una unidad al carrito
 * @param {boolean} props.bloqueado - Impide agregar mientras se guarda otro pedido
 * @return {JSX.Element} Tarjeta del producto
 */
const ProductCard = ({ producto, onAgregar, bloqueado }) => {
  const [mensaje, setMensaje] = useState('');

  /**
   * Agrega la pieza e informa el resultado sin salir del catálogo
   * @method agregar
   * @return {void} No retorna un valor
   */
  const agregar = () => {
    setMensaje(onAgregar(producto) ? 'Pieza agregada al carrito.' : 'No se pudo agregar la pieza. Revisá el aviso del carrito.');
  };

  return (
    <article className="tarjeta-producto">
      <img className="tarjeta-imagen" src={`/imagenes/${producto.imagen}`} alt={producto.alt} />
      <div className="tarjeta-cuerpo">
        <span className="tarjeta-categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p>{producto.description}</p>
        <p className="tarjeta-marca">Marca: {producto.marca}</p>
        <p className="tarjeta-precio">$ {producto.precio.toLocaleString('es-AR')} ARS</p>
        <Button onClick={agregar} disabled={bloqueado}>Agregá al carrito</Button>
        <p role="status">{mensaje}</p>
        <a href={producto.web} target="_blank" rel="noreferrer">Ver en la web</a>
      </div>
    </article>
  );
};

export default ProductCard;
