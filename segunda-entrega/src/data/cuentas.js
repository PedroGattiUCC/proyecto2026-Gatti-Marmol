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
