export const METALES = {
  oro18k: { nombre: 'Oro 18k', precio: 95000 },
  plata925: { nombre: 'Plata 925', precio: 12000 },
  platino: { nombre: 'Platino 950', precio: 110000 },
};

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
 * Aplica las mismas tarifas que el cotizador de la primera entrega
 * @method calcularCotizacion
 * @param {Object} valores - Configuración validada de la pieza
 * @return {Object} Importes por material y precio total
 */
export const calcularCotizacion = ({ metal, peso, gemas, grabado }) => {
  const importeMetal = Number(peso) * METALES[metal].precio;
  const importeGemas = Number(gemas) * 25000;
  const importeGrabado = grabado.trim() === '' ? 0 : 5000;
  return { importeMetal, importeGemas, importeGrabado, total: importeMetal + importeGemas + importeGrabado };
};
