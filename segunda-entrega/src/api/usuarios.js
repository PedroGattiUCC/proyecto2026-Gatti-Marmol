const URL_USUARIOS = 'http://localhost:4000/usuarios';

/**
 * Pide al mock la lista de usuarios registrados
 * @method obtenerUsuarios
 * @return {Promise<Array>} Usuarios guardados en db.json
 */
export const obtenerUsuarios = async () => {
  const respuesta = await fetch(URL_USUARIOS);
  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los usuarios');
  }
  return await respuesta.json();
};

/**
 * Registra un usuario nuevo en el mock
 * @method crearUsuario
 * @param {Object} usuario - Nombre, correo y contraseña de demostración
 * @return {Promise<Object>} Usuario creado con su identificador
 */
export const crearUsuario = async (usuario) => {
  const respuesta = await fetch(URL_USUARIOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  if (!respuesta.ok) {
    throw new Error('No se pudo crear la cuenta');
  }
  return await respuesta.json();
};
