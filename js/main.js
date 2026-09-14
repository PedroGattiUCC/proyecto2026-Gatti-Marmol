/**
 * Laure Joyas - Lógica de Negocio y Cotizador Online
 * Cátedra: Taller de Desarrollo Web - UCC 2026
 * Autores: Pedro Gatti & Joaquin Mármol
 */

// Tarifas de referencia por gramo expresadas en pesos argentinos (ARS)
const PRECIOS_METALES = {
  oro18k: 95000,
  plata925: 12000,
  platino: 110000
};

// Costo fijo por engarce de gema y costo por grabado
const COSTO_POR_GEMA = 25000;
const COSTO_GRABADO_BASE = 5000;

/**
 * Valida que el peso numérico ingresado por el usuario se encuentre en el rango permitido (1 a 500 gramos).
 * Si el valor no es válido, notifica al usuario con un alert y blanquea el campo de texto.
 * @method validarPeso
 * @param {HTMLInputElement} inputElement - Elemento input del DOM que contiene el valor del peso
 * @return {boolean} Retorna true si el valor es válido; de lo contrario false
 */
const validarPeso = (inputElement) => {
  const valor = parseFloat(inputElement.value);

  if (isNaN(valor) || valor <= 0 || valor > 500) {
    alert("Por favor, ingrese un peso válido en gramos (entre 1 y 500 gramos).");
    inputElement.value = "";
    inputElement.focus();
    return false;
  }

  return true;
};

/**
 * Valida que la cantidad de gemas ingresada sea un entero positivo no mayor a 30 piedras.
 * En caso de error, emite una advertencia al usuario y blanquea el campo.
 * @method validarGemas
 * @param {HTMLInputElement} inputElement - Elemento input del DOM con la cantidad de gemas
 * @return {boolean} Retorna true si la cantidad es admisible; false en caso contrario
 */
const validarGemas = (inputElement) => {
  const cantidad = parseInt(inputElement.value, 10);

  if (isNaN(cantidad) || cantidad < 0 || cantidad > 30) {
    alert("La cantidad de gemas debe ser un número entero entre 0 y 30.");
    inputElement.value = "0";
    inputElement.focus();
    return false;
  }

  return true;
};

/**
 * Calcula el presupuesto total estimativo de la joya seleccionada considerando tipo de metal, peso, cantidad de gemas y servicio de grabado.
 * Despliega el resumen desglosado y el monto final dentro del contenedor del resultado en la interfaz.
 * @method calcularPresupuesto
 * @return {void} No retorna ningún valor, actualiza directamente los elementos del DOM
 */
const calcularPresupuesto = () => {
  const inputPeso = document.getElementById("peso-joya");
  const selectMetal = document.getElementById("tipo-metal");
  const inputGemas = document.getElementById("cantidad-gemas");
  const inputGrabado = document.getElementById("texto-grabado");
  const contenedorResultado = document.getElementById("contenedor-resultado");
  const textoMontoFinal = document.getElementById("monto-final");
  const detalleMetal = document.getElementById("detalle-metal");
  const detalleGemas = document.getElementById("detalle-gemas");
  const detalleGrabado = document.getElementById("detalle-grabado");

  // Validación previa de campo obligatorio
  if (!inputPeso.value || !validarPeso(inputPeso)) {
    alert("Debe ingresar un peso válido antes de calcular el presupuesto.");
    inputPeso.focus();
    return;
  }

  if (inputGemas.value && !validarGemas(inputGemas)) {
    return;
  }

  const peso = parseFloat(inputPeso.value);
  const metalClave = selectMetal.value;
  const precioPorGramo = PRECIOS_METALES[metalClave] || 0;
  const cantidadGemas = parseInt(inputGemas.value, 10) || 0;
  const textoGrabado = inputGrabado.value.trim();

  // Cálculos desglosados
  const subtotalMetal = peso * precioPorGramo;
  const subtotalGemas = cantidadGemas * COSTO_POR_GEMA;
  const subtotalGrabado = textoGrabado.length > 0 ? COSTO_GRABADO_BASE : 0;
  const total = subtotalMetal + subtotalGemas + subtotalGrabado;

  // Formato de moneda para visualización
  const formateador = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });

  // Actualización de la interfaz
  const nombreMetal = selectMetal.options[selectMetal.selectedIndex].text;
  detalleMetal.textContent = `${peso}g de ${nombreMetal}: ${formateador.format(subtotalMetal)}`;
  detalleGemas.textContent = `${cantidadGemas} gema(s) engarzada(s): ${formateador.format(subtotalGemas)}`;
  detalleGrabado.textContent = textoGrabado.length > 0
    ? `Grabado ("${textoGrabado}"): ${formateador.format(subtotalGrabado)}`
    : "Sin grabado personalizado: $0";

  textoMontoFinal.textContent = formateador.format(total);
  contenedorResultado.style.display = "block";
};

/**
 * Restablece los campos del formulario de cotización a sus valores por defecto y oculta el panel de resultado.
 * @method limpiarCotizador
 * @return {void} No retorna valor
 */
const limpiarCotizador = () => {
  document.getElementById("peso-joya").value = "";
  document.getElementById("tipo-metal").selectedIndex = 0;
  document.getElementById("cantidad-gemas").value = "0";
  document.getElementById("texto-grabado").value = "";

  const contenedorResultado = document.getElementById("contenedor-resultado");
  contenedorResultado.style.display = "none";
};