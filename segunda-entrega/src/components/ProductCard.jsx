import '@styles/ProductCard.scss';

/**
 * Muestra los datos de un producto en una tarjeta
 * @method ProductCard
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.producto - Producto que se muestra en la tarjeta
 * @return {JSX.Element} Tarjeta del producto
 */
const ProductCard = ({ producto }) => {
  return (
    <article className="tarjeta-producto">
      <img className="tarjeta-imagen" src={`/imagenes/${producto.imagen}`} alt={producto.alt} />
      <div className="tarjeta-cuerpo">
        <span className="tarjeta-categoria">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p>{producto.description}</p>
        <p className="tarjeta-marca">Marca: {producto.marca}</p>
        <p className="tarjeta-precio">$ {producto.precio.toLocaleString('es-AR')} ARS</p>
        <a href={producto.web} target="_blank" rel="noreferrer">Ver en la web</a>
      </div>
    </article>
  );
};

export default ProductCard;
