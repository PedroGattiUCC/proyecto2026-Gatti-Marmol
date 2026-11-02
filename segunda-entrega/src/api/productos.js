const URL_PRODUCTOS = 'http://localhost:4000/productos';

/**
 * Pide al mock la lista de productos
 * @method obtenerProductos
 * @return {Promise<Array>} Productos guardados en db.json
 */
export const obtenerProductos = async () => {
  const respuesta = await fetch(URL_PRODUCTOS);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los productos');
  }
  return await respuesta.json();
};
