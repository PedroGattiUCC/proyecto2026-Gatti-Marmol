import { metales, tarifas } from '@data/cotizacion.json';

/**
 * Aplica las mismas tarifas que el cotizador de la primera entrega
 * @method calcularCotizacion
 * @param {Object} valores - Configuración validada de la pieza
 * @return {Object} Importes por material y precio total
 */
export const calcularCotizacion = ({ metal, peso, gemas, grabado }) => {
  const importeMetal = Number(peso) * metales[metal].precio;
  const importeGemas = Number(gemas) * tarifas.gema;
  const importeGrabado = grabado.trim() === '' ? 0 : tarifas.grabado;
  return { importeMetal, importeGemas, importeGrabado, total: importeMetal + importeGemas + importeGrabado };
};
