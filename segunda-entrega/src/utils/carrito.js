import { validarCarrito } from '@utils/validaciones.js';

const CLAVE_CARRITO = 'laure_carrito_react';
const ERROR_CARRITO = 'No se pudo recuperar el carrito guardado. Podés empezar uno nuevo.';

/**
 * Recupera las líneas válidas del carrito guardado en este navegador
 * @method leerCarrito
 * @return {Object} Productos y mensaje de recuperación
 */
export const leerCarrito = () => {
  try {
    const productos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
    return validarCarrito(productos) ? { productos, error: '' } : { productos: [], error: ERROR_CARRITO };
  } catch {
    return { productos: [], error: ERROR_CARRITO };
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
