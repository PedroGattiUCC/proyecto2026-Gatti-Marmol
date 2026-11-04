const CLAVE_SESION = 'laure_usuario_react';

/**
 * Recupera la sesión guardada en este navegador
 * @method leerSesion
 * @return {Object|null} Nombre y correo del usuario, o null si no hay sesión
 */
export const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
};

/**
 * Guarda el nombre y el correo del usuario que ingresó
 * @method guardarSesion
 * @param {Object} usuario - Nombre y correo del usuario
 * @return {void} No retorna un valor
 */
export const guardarSesion = (usuario) => {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
};

/**
 * Elimina la sesión guardada en este navegador
 * @method borrarSesion
 * @return {void} No retorna un valor
 */
export const borrarSesion = () => {
  localStorage.removeItem(CLAVE_SESION);
};
