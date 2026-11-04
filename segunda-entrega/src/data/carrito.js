const CLAVE_CARRITO = 'laure_carrito_react';

/**
 * Recupera las líneas válidas del carrito guardado en este navegador
 * @method leerCarrito
 * @return {Object} Productos y mensaje de recuperación
 */
export const leerCarrito = () => {
  try {
    const productos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
    if (!Array.isArray(productos) || !productos.every((producto) =>
      producto && typeof producto.id === 'string' && typeof producto.nombre === 'string'
      && Number.isFinite(producto.precio) && producto.precio > 0
      && Number.isInteger(producto.cantidad) && producto.cantidad >= 1 && producto.cantidad <= 99)) {
      throw new Error('Carrito inválido');
    }
    return { productos, error: '' };
  } catch {
    return { productos: [], error: 'No se pudo recuperar el carrito guardado. Podés empezar uno nuevo.' };
  }
};

/**
 * Persiste el carrito antes de actualizar lo que se ve en pantalla
 * @method guardarCarrito
 * @param {Array} productos - Líneas del carrito
 * @return {void} No retorna un valor; propaga los errores de almacenamiento
 */
export const guardarCarrito = (productos) => {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(productos));
};
