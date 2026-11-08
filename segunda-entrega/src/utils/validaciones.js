/**
 * Comprueba el peso, las gemas y el grabado antes de presupuestar
 * @method validarCotizacion
 * @param {Object} valores - Valores actuales del formulario
 * @return {Object} Mensajes por campo; vacíos cuando el valor es válido
 */
export const validarCotizacion = ({ peso, gemas, grabado }) => ({
  peso: peso.trim() === '' || !Number.isFinite(Number(peso)) || Number(peso) < 1 || Number(peso) > 500
    ? 'Ingresá un peso entre 1 y 500 gramos.' : '',
  gemas: gemas.trim() === '' || !Number.isInteger(Number(gemas)) || Number(gemas) < 0 || Number(gemas) > 30
    ? 'Ingresá una cantidad entera entre 0 y 30 gemas.' : '',
  grabado: grabado.length > 25 ? 'El grabado puede tener hasta 25 caracteres.' : '',
});

/**
 * Normaliza un correo para compararlo sin espacios ni mayúsculas
 * @method normalizarCorreo
 * @param {string} email - Correo ingresado
 * @return {string} Correo normalizado
 */
export const normalizarCorreo = (email) => email.trim().toLowerCase();

/**
 * Valida el formato de un correo electrónico
 * @method validarCorreo
 * @param {string} email - Correo ingresado
 * @return {string} Mensaje de error o texto vacío
 */
export const validarCorreo = (email) => {
  const correo = normalizarCorreo(email);
  if (!correo.includes('@') || !correo.includes('.') || correo.length > 80) {
    return 'Ingresá un correo electrónico válido de hasta 80 caracteres.';
  }
  return '';
};

/**
 * Valida la longitud de una contraseña de demostración
 * @method validarPassword
 * @param {string} password - Contraseña ingresada
 * @return {string} Mensaje de error o texto vacío
 */
export const validarPassword = (password) => {
  if (password.trim().length < 8 || password.length > 128) {
    return 'Usá una contraseña de prueba de 8 a 128 caracteres.';
  }
  return '';
};

/**
 * Valida todos los campos del formulario de registro
 * @method validarRegistro
 * @param {Object} valores - Nombre, correo, contraseña y confirmación
 * @return {Object} Mensaje de error de cada campo
 */
export const validarRegistro = ({ nombre, email, password, confirmacion }) => {
  return {
    nombre: nombre.trim().length < 2 || nombre.trim().length > 60 ? 'Ingresá un nombre de 2 a 60 caracteres.' : '',
    email: validarCorreo(email),
    password: validarPassword(password),
    confirmacion: password !== confirmacion ? 'Las contraseñas no coinciden.' : '',
  };
};

/**
 * Comprueba que cada línea del carrito guardado tenga valores usables
 * @method validarCarrito
 * @param {Array} productos - Líneas recuperadas del almacenamiento
 * @return {boolean} true cuando todas las líneas son válidas
 */
export const validarCarrito = (productos) => Array.isArray(productos) && productos.every((producto) =>
  producto && typeof producto.id === 'string' && typeof producto.nombre === 'string'
  && Number.isFinite(producto.precio) && producto.precio > 0
  && Number.isInteger(producto.cantidad) && producto.cantidad >= 1 && producto.cantidad <= 99);
