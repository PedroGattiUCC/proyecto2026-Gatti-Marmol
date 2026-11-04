import { useEffect, useState } from 'react';
import { obtenerProductos } from '@api/productos.js';
import ProductCard from '@components/ProductCard.jsx';
import Button from '@components/Button.jsx';
import Input from '@components/Input.jsx';
import '@styles/Catalogo.scss';

/**
 * Filtra los productos por texto y categoría, y los ordena
 * @method filtrarYOrdenar
 * @param {Array} productos - Productos recibidos del mock
 * @param {string} busqueda - Texto ingresado en el buscador
 * @param {string} categoria - Categoría elegida o "todas"
 * @param {string} orden - Criterio de orden elegido
 * @return {Array} Productos filtrados y ordenados
 */
const filtrarYOrdenar = (productos, busqueda, categoria, orden) => {
  const texto = busqueda.trim().toLowerCase();
  const filtrados = productos.filter((producto) => {
    const coincideTexto = `${producto.nombre} ${producto.description}`.toLowerCase().includes(texto);
    const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  if (orden === 'precio-menor') {
    return filtrados.sort((a, b) => a.precio - b.precio);
  }
  if (orden === 'precio-mayor') {
    return filtrados.sort((a, b) => b.precio - a.precio);
  }
  if (orden === 'nombre-az') {
    return filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  return filtrados;
};

/**
 * Pide los productos al mock y los muestra con buscador, filtro y orden
 * @method Catalogo
 * @param {Object} props - Acción para agregar piezas al carrito
 * @return {JSX.Element} Página del catálogo
 */
const Catalogo = ({ onAgregar, bloqueado }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [orden, setOrden] = useState('defecto');

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

  const productosVisibles = filtrarYOrdenar(productos, busqueda, categoria, orden);

  /**
   * Vuelve los filtros a sus valores iniciales
   * @method restablecerFiltros
   * @return {void} No retorna un valor
   */
  const restablecerFiltros = () => {
    setBusqueda('');
    setCategoria('todas');
    setOrden('defecto');
  };

  return (
    <section>
      <h2 className="catalogo-titulo">Catálogo de piezas exclusivas</h2>
      <p className="catalogo-subtitulo">Explorá nuestra colección de piezas en metales nobles y piedras preciosas.</p>
      <div className="catalogo-filtros">
          <Input
            id="busqueda"
            label="Buscá una joya o un metal:"
            type="text"
            placeholder="Ej.: anillo, platino, diamante"
            size="25"
            maxLength="30"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        <div className="catalogo-campo">
          <label htmlFor="categoria">Filtrá por categoría:</label>
          <select id="categoria" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
            <option value="todas">Todas</option>
            <option value="anillos">Anillos</option>
            <option value="collares">Collares</option>
            <option value="aros">Aros</option>
            <option value="pulseras">Pulseras</option>
            <option value="relojes">Relojes</option>
          </select>
        </div>
        <div className="catalogo-campo">
          <label htmlFor="orden">Ordená por:</label>
          <select id="orden" value={orden} onChange={(evento) => setOrden(evento.target.value)}>
            <option value="defecto">Defecto</option>
            <option value="precio-menor">Menor precio</option>
            <option value="precio-mayor">Mayor precio</option>
            <option value="nombre-az">Nombre A-Z</option>
          </select>
        </div>
      </div>
      {cargando && <p className="catalogo-mensaje">Cargando productos...</p>}
      {error && <p className="catalogo-error" role="alert">{error}</p>}
      <div className="catalogo-grilla">
        {productosVisibles.map((producto) => (
          <ProductCard key={producto.id} producto={producto} onAgregar={onAgregar} bloqueado={bloqueado} />
        ))}
      </div>
      {!cargando && !error && productosVisibles.length === 0 && (
        <div className="catalogo-mensaje" aria-live="polite">
          <p>No se encontraron piezas con esos criterios.</p>
          <Button variante="secundario" onClick={restablecerFiltros}>Restablecé los filtros</Button>
        </div>
      )}
    </section>
  );
};

export default Catalogo;
