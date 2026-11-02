import { useEffect, useState } from 'react';
import { obtenerProductos } from '@api/productos.js';
import ProductCard from '@components/ProductCard.jsx';
import '@styles/Catalogo.scss';

/**
 * Pide los productos al mock y los muestra en una grilla
 * @method Catalogo
 * @return {JSX.Element} Página del catálogo
 */
const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    /**
     * Carga los productos y guarda el resultado en el estado
     * @method cargarProductos
     * @return {Promise<void>} No retorna un valor
     */
    const cargarProductos = async () => {
      try {
        setProductos(await obtenerProductos());
      } catch {
        setError('No se pudieron cargar los productos. Verificá que el mock esté en ejecución.');
      }
      setCargando(false);
    };
    cargarProductos();
  }, []);

  return (
    <section>
      <h2 className="catalogo-titulo">Catálogo de Piezas Exclusivas</h2>
      <p className="catalogo-subtitulo">Explorá nuestra colección de piezas en metales nobles y piedras preciosas.</p>
      {cargando && <p className="catalogo-mensaje">Cargando productos...</p>}
      {error && <p className="catalogo-error" role="alert">{error}</p>}
      <div className="catalogo-grilla">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
};

export default Catalogo;
