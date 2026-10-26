/**
 * Laure Joyas - Lógica de Negocio, Catálogo, Cotizador y Carrito de Compras
 * Cátedra: Taller de Desarrollo Web - UCC 2026
 * Autores: Pedro Gatti (Legajo: 2519717) & Joaquin Mármol (Legajo: 2514908)
 */

// Catálogo maestro de productos de alta joyería
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Solitario Imperial",
    categoria: "anillos",
    precio: 850000,
    imagen: "imagenes/joyas_hero.jpg",
    metal: "Oro Amarillo 18k",
    descripcion: "Anillo solitario clásico con diamante engarzado en oro amarillo de 18 quilates."
  },
  {
    id: 2,
    nombre: "Colgante Luminance",
    categoria: "collares",
    precio: 1250000,
    imagen: "imagenes/joyas_collar.jpg",
    metal: "Platino Noble",
    descripcion: "Gargantilla con colgante de platino pulido y pavé de gemas brillantes."
  },
  {
    id: 3,
    nombre: "Aros Royal Brilliance",
    categoria: "aros",
    precio: 620000,
    imagen: "imagenes/joyas_aros.jpg",
    metal: "Oro Blanco 18k",
    descripcion: "Par de aros colgantes en oro blanco 18k con corte baguette deslumbrante."
  },
  {
    id: 4,
    nombre: "Brazalete Étoile",
    categoria: "pulseras",
    precio: 980000,
    imagen: "imagenes/joyas_pulsera.jpg",
    metal: "Oro Amarillo 18k",
    descripcion: "Pulsera rígida de oro amarillo de 18 quilates con engarce artesanal."
  },
  {
    id: 5,
    nombre: "Anillo Sublime Emerald",
    categoria: "anillos",
    precio: 1450000,
    imagen: "imagenes/joyas_anillo_esmeralda.jpg",
    metal: "Platino Noble",
    descripcion: "Majestuoso anillo con esmeralda central colombiana y engarce en platino."
  },
  {
    id: 6,
    nombre: "Cronógrafo Prestige",
    categoria: "relojes",
    precio: 2100000,
    imagen: "imagenes/joyas_reloj.jpg",
    metal: "Oro Rosa 18k",
    descripcion: "Reloj suizo de alta precisión con caja maciza en oro rosa de 18 quilates."
  }
];

// Tarifas de referencia por gramo expresadas en pesos argentinos (ARS)
const PRECIOS_METALES = {
  oro18k: 95000,
  plata925: 12000,
  platino: 110000
};

// Costo fijo por engarce de gema y costo por grabado base
const COSTO_POR_GEMA = 25000;
const COSTO_GRABADO_BASE = 5000;

// Instancia de formateador monetario en pesos argentinos (ARS)
const formateador = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

// Porcentaje de descuento global aplicado por cupón promocional
let porcentajeDescuentoCupon = 0;

// Almacena en memoria la última cotización calculada para permitir su adición al carrito
let ultimaCotizacion = null;

/* ==========================================================================
   MÓDULO DE CARRITO DE COMPRAS Y PERSISTENCIA (localStorage)
   ========================================================================== */

/**
 * Recupera el listado de productos almacenados en el carrito de compras desde el almacenamiento local del navegador.
 * Realiza una validación estricta del esquema para garantizar que sea un Array y filtrar cualquier dato corrupto.
 * @method obtenerCarrito
 * @return {Array<Object>} Arreglo con los objetos de productos presentes en el carrito, o un arreglo vacío si no existen registros
 */
const obtenerCarrito = () => {
  try {
    const datos = localStorage.getItem("laure_carrito");
    if (!datos) {
      return [];
    }
    const parseado = JSON.parse(datos);
    if (!Array.isArray(parseado)) {
      console.warn("Estructura de carrito no válida en localStorage. Restableciendo carrito.");
      localStorage.removeItem("laure_carrito");
      return [];
    }
    // Filtrar elementos corruptos o incompletos por robustez
    return parseado.filter((item) => 
      item &&
      typeof item === "object" &&
      item.id !== undefined &&
      item.nombre &&
      !isNaN(Number(item.precio))
    );
  } catch (error) {
    console.error("Error al leer el carrito de localStorage:", error);
    return [];
  }
};

/**
 * Persiste el arreglo actualizado del carrito en localStorage y actualiza la cantidad visualizada en el contador de la barra de navegación.
 * @method guardarCarrito
 * @param {Array<Object>} carrito - Arreglo con los elementos actuales del carrito
 * @return {void} No retorna ningún valor
 */
const guardarCarrito = (carrito) => {
  try {
    const arregloValido = Array.isArray(carrito) ? carrito : [];
    localStorage.setItem("laure_carrito", JSON.stringify(arregloValido));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
  actualizarBadgeCarrito();
};

/**
 * Suma la cantidad total de artículos en el carrito y actualiza el contador numérico del distintivo en la barra de navegación.
 * @method actualizarBadgeCarrito
 * @return {void} No retorna ningún valor
 */
const actualizarBadgeCarrito = () => {
  const badge = document.getElementById("badge-carrito");
  if (!badge) {
    return;
  }

  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acumulado, item) => {
    const cant = parseInt(item.cantidad, 10);
    return acumulado + (isNaN(cant) || cant < 0 ? 0 : cant);
  }, 0);

  badge.textContent = totalItems.toString();
};

/**
 * Añade una pieza de joyería al carrito de compras utilizando su identificador único.
 * Si ya existe, incrementa su cantidad hasta un tope seguro de 30 unidades; de lo contrario, agrega un nuevo ítem con cantidad unitaria.
 * @method agregarAlCarrito
 * @param {number|string} idProducto - Identificador numérico o clave del producto a incorporar
 * @return {void} No retorna ningún valor
 */
const agregarAlCarrito = (idProducto) => {
  const idNumerico = parseInt(idProducto, 10);
  const productoEncontrado = PRODUCTOS.find((p) => p.id === idNumerico);

  if (!productoEncontrado) {
    alert("El producto seleccionado no pudo ser encontrado en el catálogo.");
    return;
  }

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === idNumerico);

  if (itemExistente) {
    const cantidadActual = parseInt(itemExistente.cantidad, 10) || 1;
    if (cantidadActual >= 30) {
      alert("Alcanzaste el límite máximo de 30 unidades para este producto exclusivo.");
      return;
    }
    itemExistente.cantidad = cantidadActual + 1;
  } else {
    carrito.push({
      id: productoEncontrado.id,
      nombre: productoEncontrado.nombre,
      categoria: productoEncontrado.categoria,
      precio: productoEncontrado.precio,
      metal: productoEncontrado.metal,
      imagen: productoEncontrado.imagen,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  alert(`¡"${productoEncontrado.nombre}" fue añadido al carrito de compras con éxito!`);
};

/**
 * Añade la joya personalizada recién calculada en el cotizador directamente al carrito de compras.
 * @method agregarCotizacionAlCarrito
 * @return {void} No retorna ningún valor
 */
const agregarCotizacionAlCarrito = () => {
  if (!ultimaCotizacion) {
    alert("Por favor, calculá primero un presupuesto en el cotizador antes de agregarlo al carrito.");
    return;
  }

  const carrito = obtenerCarrito();
  carrito.push({
    id: ultimaCotizacion.id,
    nombre: ultimaCotizacion.nombre,
    categoria: ultimaCotizacion.categoria,
    precio: ultimaCotizacion.precio,
    metal: ultimaCotizacion.metal,
    imagen: ultimaCotizacion.imagen,
    cantidad: 1
  });

  guardarCarrito(carrito);
  alert(`¡Tu joya personalizada ("${ultimaCotizacion.nombre}") fue añadida al carrito de compras con éxito!`);
};

/**
 * Modifica la cantidad de unidades de un producto específico en el carrito y actualiza la vista de la tabla.
 * Protege contra errores humanos de entrada (valores negativos, cadenas no numéricas, exceso de unidades).
 * Si el usuario introduce 0 o un valor negativo, solicita confirmación previa antes de eliminar.
 * @method modificarCantidadCarrito
 * @param {number|string} indice - Posición índice del elemento en el arreglo del carrito
 * @param {number|string} nuevaCantidad - Nueva cantidad numérica deseada
 * @return {void} No retorna ningún valor
 */
const modificarCantidadCarrito = (indice, nuevaCantidad) => {
  const carrito = obtenerCarrito();
  const indiceNumerico = parseInt(indice, 10);

  if (isNaN(indiceNumerico) || indiceNumerico < 0 || indiceNumerico >= carrito.length) {
    console.error("Índice de producto inválido en el carrito.");
    return;
  }

  const cantidadEntera = parseInt(nuevaCantidad, 10);

  // Si el usuario dejó el campo vacío o escribió algo no numérico
  if (isNaN(cantidadEntera)) {
    alert("Por favor, ingresá un número entero válido de unidades.");
    renderizarTablaCarrito();
    return;
  }

  // Si ingresa 0 o negativo, confirmación preventiva para evitar borrado accidental
  if (cantidadEntera <= 0) {
    const confirmar = confirm(`¿Querés eliminar "${carrito[indiceNumerico].nombre}" del carrito de compras?`);
    if (confirmar) {
      eliminarDelCarrito(indiceNumerico, true);
    } else {
      renderizarTablaCarrito(); // Restablece la cantidad visual previa
    }
    return;
  }

  // Tope máximo por pedido
  if (cantidadEntera > 30) {
    alert("Por motivos de stock artesanal, el límite máximo por pieza es de 30 unidades.");
    carrito[indiceNumerico].cantidad = 30;
  } else {
    carrito[indiceNumerico].cantidad = cantidadEntera;
  }

  guardarCarrito(carrito);
  renderizarTablaCarrito();
};

/**
 * Elimina una joya del carrito de compras según su índice en la lista, solicita confirmación preventiva,
 * guarda el cambio y actualiza la tabla de compras.
 * @method eliminarDelCarrito
 * @param {number|string} indice - Posición del producto a remover dentro del arreglo
 * @param {boolean} [omitirConfirmacion=false] - Indica si se omite la confirmación interactiva
 * @return {void} No retorna ningún valor
 */
const eliminarDelCarrito = (indice, omitirConfirmacion = false) => {
  const carrito = obtenerCarrito();
  const indiceNumerico = parseInt(indice, 10);

  if (isNaN(indiceNumerico) || indiceNumerico < 0 || indiceNumerico >= carrito.length) {
    return;
  }

  const nombreProducto = carrito[indiceNumerico].nombre;

  if (!omitirConfirmacion) {
    const seguro = confirm(`¿Querés eliminar "${nombreProducto}" de tu carrito?`);
    if (!seguro) {
      return;
    }
  }

  carrito.splice(indiceNumerico, 1);
  guardarCarrito(carrito);
  renderizarTablaCarrito();
  alert(`"${nombreProducto}" ha sido removido del carrito.`);
};

/**
 * Remueve la totalidad de los artículos del carrito de compras tras comprobar su existencia y solicitar confirmación interactiva.
 * @method vaciarCarrito
 * @return {void} No retorna ningún valor
 */
const vaciarCarrito = () => {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("El carrito ya se encuentra vacío.");
    return;
  }

  const seguro = confirm("¿Querés vaciar todos los artículos de tu carrito?");
  if (!seguro) {
    return;
  }

  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  renderizarTablaCarrito();
  alert("El carrito de compras ha sido vaciado correctamente.");
};

/**
 * Valida el código de cupón promocional ingresado por el usuario y recalcula los totales con su descuento;
 * muestra el resultado debajo del campo; si es incorrecto, blanquea el campo y devuelve el foco.
 * @method validarCupon
 * @param {HTMLInputElement} [inputElement] - Elemento de entrada de texto que contiene el código de cupón
 * @return {void} No retorna ningún valor
 */
const validarCupon = (inputElement) => {
  const input = inputElement || document.getElementById("input-cupon");
  if (!input) {
    return;
  }

  const codigo = input.value.trim().toUpperCase();
  const mostrarMensaje = (texto, esError = false) => {
    const mensaje = document.getElementById("mensaje-cupon");
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.classList.toggle("error", esError);
    }
  };

  if (codigo === "") {
    mostrarMensaje("Por favor, ingresá un código de cupón antes de aplicar.", true);
    input.focus();
    return;
  }

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    mostrarMensaje("Tu carrito está vacío. Agregá productos desde el catálogo antes de aplicar un cupón de descuento.", true);
    input.value = "";
    return;
  }

  const descuento = codigo === "LAURE10" ? 0.10 : codigo === "PEDROYJOAQUIN" ? 0.80 : 0;
  const nombreCupon = codigo === "PEDROYJOAQUIN" ? "pedroyjoaquin" : codigo;

  if (descuento > 0) {
    if (porcentajeDescuentoCupon === descuento) {
      mostrarMensaje(`El cupón '${nombreCupon}' ya está aplicado: ${descuento * 100}% de descuento sobre tu pedido.`);
      return;
    }
    porcentajeDescuentoCupon = descuento;
    mostrarMensaje(`¡Cupón '${nombreCupon}' aplicado con éxito! Se aplicó un ${descuento * 100}% de descuento sobre el total.`);
    renderizarTablaCarrito();
  } else {
    porcentajeDescuentoCupon = 0;
    mostrarMensaje("El cupón ingresado no es válido o ha expirado. Podés probar ingresando el código 'LAURE10'.", true);
    input.value = "";
    input.focus();
    renderizarTablaCarrito();
  }
};

/**
 * Procesa la orden de compra si existen artículos en el carrito, solicita confirmación, emite mensaje de confirmación, limpia el almacenamiento y redirige a la página principal.
 * @method confirmarCompra
 * @return {void} No retorna ningún valor
 */
const confirmarCompra = () => {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agregá productos desde el catálogo antes de confirmar la compra.");
    return;
  }

  const confirmar = confirm("¿Querés confirmar tu pedido en Laure Joyas y enviar los detalles a nuestro taller de orfebrería?");
  if (!confirmar) {
    return;
  }

  const mensajeCupon = porcentajeDescuentoCupon === 0.80
    ? " Cupón 'pedroyjoaquin' aplicado: 80% de descuento sobre el total."
    : "";
  alert("¡Muchas gracias por tu compra en Laure Joyas! Tu pedido ha sido registrado con éxito. Uno de nuestros asesores se comunicará con vos a la brevedad para coordinar la entrega y detalles de facturación." + mensajeCupon);
  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  window.location.href = "index.html";
};

/**
 * Renderiza dinámicamente las filas de la tabla del carrito de compras en el DOM, calculando subtotales por ítem, descuentos de cupones y el total general.
 * Completa los datos variables mediante textContent para evitar interpretarlos como HTML.
 * @method renderizarTablaCarrito
 * @return {void} No retorna ningún valor
 */
const renderizarTablaCarrito = () => {
  const cuerpoTabla = document.getElementById("cuerpo-tabla-carrito");
  if (!cuerpoTabla) {
    return;
  }

  const carrito = obtenerCarrito();
  const elementoSubtotal = document.getElementById("subtotal-carrito-texto");
  const elementoDescuento = document.getElementById("descuento-carrito-texto");
  const elementoTotal = document.getElementById("total-carrito-texto");

  if (carrito.length === 0) {
    cuerpoTabla.innerHTML = `
      <tr class="carrito-vacio-mensaje">
        <td colspan="6">Tu carrito se encuentra actualmente vacío. Te invitamos a explorar nuestro catálogo de piezas exclusivas.</td>
      </tr>
    `;
    if (elementoSubtotal) elementoSubtotal.textContent = formateador.format(0) + " ARS";
    if (elementoDescuento) elementoDescuento.textContent = formateador.format(0) + " ARS";
    if (elementoTotal) elementoTotal.textContent = formateador.format(0) + " ARS";
    const mensajeCupon = document.getElementById("mensaje-cupon");
    if (mensajeCupon) mensajeCupon.textContent = "";
    return;
  }

  let subtotalAcumulado = 0;
  const filas = document.createDocumentFragment();
  const plantilla = document.getElementById("plantilla-fila-carrito");
  cuerpoTabla.replaceChildren();

  carrito.forEach((item, indice) => {
    const cantidad = Math.max(1, Math.min(30, parseInt(item.cantidad, 10) || 1));
    const precioUnitario = Math.max(0, parseFloat(item.precio) || 0);
    const subtotalItem = cantidad * precioUnitario;
    subtotalAcumulado += subtotalItem;

    const fila = plantilla.content.cloneNode(true);
    fila.querySelector('[data-campo="nombre"]').textContent = item.nombre || "Joya Exclusiva";
    fila.querySelector('[data-campo="metal"]').textContent = item.metal || "Aleación Noble";
    fila.querySelector('[data-campo="precio"]').textContent = formateador.format(precioUnitario);
    fila.querySelector('[data-campo="subtotal"]').textContent = formateador.format(subtotalItem);
    const input = fila.querySelector("input");
    input.id = `cantidad-carrito-${indice}`;
    input.value = cantidad;
    input.dataset.indice = indice;
    const label = fila.querySelector("label");
    label.htmlFor = input.id;
    label.textContent = `Cantidad para ${item.nombre || "Joya Exclusiva"}`;
    fila.querySelector("button").dataset.indice = indice;
    filas.appendChild(fila);
  });

  cuerpoTabla.appendChild(filas);

  const montoDescuento = subtotalAcumulado * porcentajeDescuentoCupon;
  const montoTotal = Math.max(0, subtotalAcumulado - montoDescuento);

  if (elementoSubtotal) {
    elementoSubtotal.textContent = `${formateador.format(subtotalAcumulado)} ARS`;
  }
  if (elementoDescuento) {
    elementoDescuento.textContent = porcentajeDescuentoCupon > 0
      ? `- ${formateador.format(montoDescuento)} (10%) ARS`
      : `${formateador.format(0)} ARS`;
  }
  if (elementoTotal) {
    elementoTotal.textContent = `${formateador.format(montoTotal)} ARS`;
  }
};

/* ==========================================================================
   MÓDULO DE CATÁLOGO (FILTROS Y BÚSQUEDA INTEGRADA EN TIEMPO REAL)
   ========================================================================== */

/**
 * Filtra las tarjetas de productos combinando armónicamente la categoría seleccionada y el texto de búsqueda en tiempo real,
 * ordenándolas en el DOM según el criterio seleccionado. Si no hay coincidencias, muestra un mensaje descriptivo de estado vacío.
 * @method filtrarYOrdenar
 * @return {void} No retorna ningún valor
 */
const filtrarYOrdenar = () => {
  const selectCategoria = document.getElementById("select-categoria");
  const selectOrden = document.getElementById("select-orden");
  const inputBusqueda = document.getElementById("input-busqueda");
  const contenedorGrid = document.getElementById("catalogo-grid");

  if (!contenedorGrid) {
    return;
  }

  const categoriaSeleccionada = selectCategoria ? selectCategoria.value.toLowerCase().trim() : "todas";
  const ordenSeleccionado = selectOrden ? selectOrden.value : "defecto";
  const textoBusqueda = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : "";

  const tarjetas = Array.from(contenedorGrid.querySelectorAll(".card-producto"));
  if (tarjetas.length === 0) {
    return;
  }

  let elementosVisibles = 0;

  // Filtrado simultáneo por categoría Y texto de búsqueda
  tarjetas.forEach((tarjeta) => {
    const catTarjeta = (tarjeta.getAttribute("data-categoria") || "").toLowerCase();
    const nombre = (tarjeta.getAttribute("data-nombre") || "").toLowerCase();
    const badgeMetal = tarjeta.querySelector(".badge-metal");
    const metal = badgeMetal ? badgeMetal.textContent.toLowerCase() : "";

    const coincideCategoria = (categoriaSeleccionada === "todas" || categoriaSeleccionada === "" || catTarjeta === categoriaSeleccionada);
    const coincideTexto = (textoBusqueda === "" || nombre.includes(textoBusqueda) || catTarjeta.includes(textoBusqueda) || metal.includes(textoBusqueda));

    if (coincideCategoria && coincideTexto) {
      tarjeta.hidden = false;
      elementosVisibles++;
    } else {
      tarjeta.hidden = true;
    }
  });

  // Ordenamiento en el DOM
  tarjetas.sort((a, b) => {
    const precioA = parseFloat(a.getAttribute("data-precio") || "0");
    const precioB = parseFloat(b.getAttribute("data-precio") || "0");
    const nombreA = (a.getAttribute("data-nombre") || "").toLowerCase();
    const nombreB = (b.getAttribute("data-nombre") || "").toLowerCase();
    const idA = parseInt(a.getAttribute("data-id") || "0", 10);
    const idB = parseInt(b.getAttribute("data-id") || "0", 10);

    if (ordenSeleccionado === "precio-menor") {
      return precioA - precioB;
    } else if (ordenSeleccionado === "precio-mayor") {
      return precioB - precioA;
    } else if (ordenSeleccionado === "nombre-az") {
      return nombreA.localeCompare(nombreB);
    } else {
      return idA - idB;
    }
  });

  // Re-anexar tarjetas respetando el orden
  tarjetas.forEach((tarjeta) => {
    contenedorGrid.appendChild(tarjeta);
  });

  const mensajeSinResultados = document.getElementById("sin-resultados-catalogo");
  if (mensajeSinResultados) {
    mensajeSinResultados.hidden = elementosVisibles !== 0;
  }
};

/**
 * Ejecuta el filtrado en tiempo real al ingresar texto en el campo de búsqueda del catálogo.
 * @method buscarProductos
 * @return {void} No retorna ningún valor
 */
const buscarProductos = () => {
  filtrarYOrdenar();
};

/**
 * Restablece los filtros del catálogo a sus valores por defecto (todas las categorías, sin texto y orden por defecto).
 * @method restablecerFiltrosCatalogo
 * @return {void} No retorna ningún valor
 */
const restablecerFiltrosCatalogo = () => {
  const selectCategoria = document.getElementById("select-categoria");
  const selectOrden = document.getElementById("select-orden");
  const inputBusqueda = document.getElementById("input-busqueda");

  if (selectCategoria) selectCategoria.value = "todas";
  if (selectOrden) selectOrden.value = "defecto";
  if (inputBusqueda) inputBusqueda.value = "";

  filtrarYOrdenar();
};

/* ==========================================================================
   MÓDULO DE COTIZADOR PERSONALIZADO
   ========================================================================== */

/**
 * Valida que el peso numérico ingresado por el usuario se encuentre en el rango permitido (1 a 500 gramos).
 * Aplica el patrón pedagógico de la cátedra: notifica con alert, blanquea el campo y devuelve el foco.
 * @method validarPeso
 * @param {HTMLInputElement} inputElement - Elemento input del DOM que contiene el valor del peso
 * @return {boolean} Retorna true si el valor es válido; de lo contrario false
 */
const validarPeso = (inputElement) => {
  if (!inputElement) {
    return false;
  }

  const valorTexto = (inputElement.value || "").trim();

  if (valorTexto === "") {
    alert("Por favor, ingresá un peso válido en gramos (entre 1 y 500 gramos).");
    inputElement.value = "";
    inputElement.focus();
    return false;
  }

  const valor = parseFloat(valorTexto);

  if (isNaN(valor) || valor < 1 || valor > 500) {
    alert("Por favor, ingresá un peso válido en gramos (entre 1 y 500 gramos).");
    inputElement.value = "";
    inputElement.focus();
    return false;
  }

  return true;
};

/**
 * Valida que la cantidad de gemas ingresada sea un entero positivo no mayor a 30 piedras.
 * En caso de error, emite una advertencia con alert, restablece el campo a '0' y devuelve el foco.
 * @method validarGemas
 * @param {HTMLInputElement} inputElement - Elemento input del DOM con la cantidad de gemas
 * @return {boolean} Retorna true si la cantidad es admisible; false en caso contrario
 */
const validarGemas = (inputElement) => {
  if (!inputElement) {
    return false;
  }

  const valorTexto = (inputElement.value || "").trim();
  if (valorTexto === "") {
    inputElement.value = "0";
    return true;
  }

  const cantidad = parseInt(valorTexto, 10);

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
 * Evita la duplicación de alertas ante datos inválidos.
 * @method calcularPresupuesto
 * @return {void} No retorna ningún valor
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

  if (!inputPeso || !selectMetal || !inputGemas || !inputGrabado || !contenedorResultado) {
    return;
  }

  // Validación de peso (notificación única mediante validarPeso)
  if (!validarPeso(inputPeso)) {
    return;
  }

  // Validación de cantidad de gemas
  if (!validarGemas(inputGemas)) {
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

  // Actualización de la interfaz
  const nombreMetal = selectMetal.options[selectMetal.selectedIndex]
    ? selectMetal.options[selectMetal.selectedIndex].text
    : metalClave;

  if (detalleMetal) {
    detalleMetal.textContent = `${peso}g de ${nombreMetal}: ${formateador.format(subtotalMetal)}`;
  }
  if (detalleGemas) {
    detalleGemas.textContent = `${cantidadGemas} gema(s) engarzada(s): ${formateador.format(subtotalGemas)}`;
  }
  if (detalleGrabado) {
    detalleGrabado.textContent = textoGrabado.length > 0
      ? `Grabado ("${textoGrabado}"): ${formateador.format(subtotalGrabado)}`
      : "Sin grabado personalizado: $0";
  }
  if (textoMontoFinal) {
    textoMontoFinal.textContent = formateador.format(total);
  }

  // Guardar en memoria para permitir incorporar al carrito
  ultimaCotizacion = {
    id: "cotizacion-" + Date.now(),
    nombre: `Joya a Medida (${nombreMetal.split("(")[0].trim()})`,
    categoria: "personalizada",
    precio: total,
    metal: nombreMetal.split("(")[0].trim(),
    peso: peso,
    gemas: cantidadGemas,
    grabado: textoGrabado,
    imagen: "imagenes/joyas_hero.jpg"
  };

  contenedorResultado.hidden = false;
};

/**
 * Restablece los campos del formulario de cotización a sus valores por defecto y oculta el panel de resultado.
 * @method limpiarCotizador
 * @return {void} No retorna ningún valor
 */
const limpiarCotizador = () => {
  const inputPeso = document.getElementById("peso-joya");
  const selectMetal = document.getElementById("tipo-metal");
  const inputGemas = document.getElementById("cantidad-gemas");
  const inputGrabado = document.getElementById("texto-grabado");
  const contenedorResultado = document.getElementById("contenedor-resultado");

  if (inputPeso) inputPeso.value = "";
  if (selectMetal) selectMetal.selectedIndex = 0;
  if (inputGemas) inputGemas.value = "0";
  if (inputGrabado) inputGrabado.value = "";
  if (contenedorResultado) contenedorResultado.hidden = true;
  ultimaCotizacion = null;
};

/* ==========================================================================
   CUENTAS DE DEMOSTRACIÓN LOCAL Y SESIÓN
   ========================================================================== */

const CLAVE_CUENTAS = "laure_cuentas_demo";
const ITERACIONES_HASH = 100000;

/**
 * Recupera cuentas de demostración y rechaza datos dañados sin sobrescribirlos.
 * @method obtenerCuentasDemo
 * @return {Array<Object>} Cuentas con nombre, correo, sal y hash
 */
const obtenerCuentasDemo = () => {
  const datos = localStorage.getItem(CLAVE_CUENTAS);
  if (datos === null) return [];
  let cuentas;
  try {
    cuentas = JSON.parse(datos);
  } catch (error) {
    throw new Error("Las cuentas guardadas están dañadas. Podés restablecer las cuentas de demostración desde Crear cuenta.");
  }
  /**
   * Comprueba el esquema de una cuenta persistida antes de usarla.
   * @method valida
   * @param {Object} cuenta - Registro leído del almacenamiento
   * @return {boolean} Indica si posee los campos esperados
   */
  const valida = (cuenta) => cuenta && typeof cuenta.nombre === "string"
    && cuenta.nombre.length >= 2 && cuenta.nombre.length <= 60
    && typeof cuenta.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cuenta.email)
    && cuenta.email.length <= 80 && /^[a-f0-9]{32}$/.test(cuenta.sal)
    && /^[a-f0-9]{64}$/.test(cuenta.hash);
  if (!Array.isArray(cuentas) || !cuentas.every(valida)
      || new Set(cuentas.map((cuenta) => cuenta.email.toLowerCase())).size !== cuentas.length) {
    throw new Error("Las cuentas guardadas no son válidas. Podés restablecer las cuentas de demostración desde Crear cuenta.");
  }
  return cuentas;
};

/**
 * Convierte bytes en una cadena hexadecimal para persistencia local.
 * @method bytesAHex
 * @param {Uint8Array} bytes - Bytes a representar
 * @return {string} Representación hexadecimal
 */
const bytesAHex = (bytes) => Array.from(bytes, (valor) => valor.toString(16).padStart(2, "0")).join("");

/**
 * Deriva un hash PBKDF2 con SHA-256 y sal aleatoria; requiere HTTPS o localhost.
 * @method derivarContrasena
 * @param {string} contrasena - Contraseña de prueba ingresada
 * @param {string} sal - Sal de 16 bytes en hexadecimal
 * @return {Promise<string>} Hash de 256 bits en hexadecimal
 */
const derivarContrasena = async (contrasena, sal) => {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Para crear cuentas o ingresar, abrí esta demostración mediante HTTPS o localhost.");
  }
  const clave = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(contrasena), "PBKDF2", false, ["deriveBits"]);
  const salBytes = Uint8Array.from(sal.match(/.{2}/g), (par) => parseInt(par, 16));
  const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt: salBytes, iterations: ITERACIONES_HASH, hash: "SHA-256" }, clave, 256);
  return bytesAHex(new Uint8Array(bits));
};

/**
 * Comunica el error, marca el campo y borra su valor para permitir corregirlo.
 * @method informarErrorCuenta
 * @param {string} destino - ID del panel de mensajes accesible
 * @param {string} mensaje - Explicación del error
 * @param {HTMLInputElement|null} campo - Campo inválido, cuando corresponde
 * @return {void} No retorna ningún valor
 */
const informarErrorCuenta = (destino, mensaje, campo = null) => {
  const panel = document.getElementById(destino);
  panel.textContent = mensaje;
  panel.classList.add("error");
  if (campo) {
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", destino);
    campo.value = "";
  }
  alert(mensaje);
  if (campo) campo.focus();
};

/**
 * Limpia marcas de errores antes de reintentar un formulario de cuenta.
 * @method limpiarErroresCuenta
 * @param {HTMLFormElement} formulario - Formulario a restablecer visualmente
 * @param {string} destino - ID del mensaje accesible
 * @return {void} No retorna ningún valor
 */
const limpiarErroresCuenta = (formulario, destino) => {
  formulario.querySelectorAll("input").forEach((campo) => {
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
  });
  const panel = document.getElementById(destino);
  panel.textContent = "";
  panel.classList.remove("error");
};

/**
 * Valida nombre, correo, claves y duplicados, y persiste una cuenta local con sal y hash.
 * @method registrarCuenta
 * @param {Event} event - Evento submit declarado en el HTML
 * @return {Promise<void>} Finalización del registro de demostración
 */
const registrarCuenta = async (event) => {
  event.preventDefault();
  const formulario = document.getElementById("form-registro");
  const boton = document.getElementById("btn-registro-submit");
  if (boton.disabled) return;
  limpiarErroresCuenta(formulario, "mensaje-registro");
  const nombre = document.getElementById("registro-nombre");
  const email = document.getElementById("registro-email");
  const password = document.getElementById("registro-password");
  const confirmacion = document.getElementById("registro-confirmacion");
  const nombreLimpio = nombre.value.trim();
  const correo = email.value.trim().toLowerCase();
  if (nombreLimpio.length < 2 || nombreLimpio.length > 60 || !/^[\p{L}\p{M}][\p{L}\p{M} '\u2019-]*$/u.test(nombreLimpio)) {
    informarErrorCuenta("mensaje-registro", "Ingresá un nombre de 2 a 60 caracteres con letras, espacios, guion o apóstrofo.", nombre);
    return;
  }
  if (correo.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    informarErrorCuenta("mensaje-registro", "Ingresá un correo electrónico válido de hasta 80 caracteres.", email);
    return;
  }
  if (password.value.trim().length < 8 || password.value.length > 128) {
    informarErrorCuenta("mensaje-registro", "Usá una contraseña de prueba de 8 a 128 caracteres.", password);
    confirmacion.value = "";
    return;
  }
  if (password.value !== confirmacion.value) {
    informarErrorCuenta("mensaje-registro", "Las contraseñas no coinciden. Repetí la contraseña de prueba.", confirmacion);
    return;
  }
  boton.disabled = true;
  try {
    const cuentas = obtenerCuentasDemo();
    if (cuentas.some((cuenta) => cuenta.email.toLowerCase() === correo)) {
      informarErrorCuenta("mensaje-registro", "Ya existe una cuenta de demostración con ese correo en este navegador. Iniciá sesión o usá otro correo de prueba.", email);
      return;
    }
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Para crear cuentas, abrí esta demostración mediante HTTPS o localhost.");
    }
    const sal = bytesAHex(window.crypto.getRandomValues(new Uint8Array(16)));
    const hash = await derivarContrasena(password.value, sal);
    // Se vuelve a leer para conservar altas de otras pestañas durante la derivación.
    const cuentasActuales = obtenerCuentasDemo();
    if (cuentasActuales.some((cuenta) => cuenta.email.toLowerCase() === correo)) {
      informarErrorCuenta("mensaje-registro", "Ese correo ya se registró en este navegador. Iniciá sesión.", email);
      return;
    }
    cuentasActuales.push({ nombre: nombreLimpio, email: correo, sal, hash });
    localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentasActuales));
    formulario.reset();
    document.getElementById("mensaje-registro").textContent = "Cuenta de demostración creada. Ya podés iniciar sesión desde el enlace Acceso.";
    alert("Cuenta de demostración creada. Iniciá sesión con tu correo y contraseña de prueba.");
  } catch (error) {
    informarErrorCuenta("mensaje-registro", error.name === "QuotaExceededError" || error.name === "SecurityError"
      ? "El navegador no permite guardar la cuenta. Habilitá el almacenamiento local e intentá nuevamente."
      : error.message);
  } finally {
    password.value = "";
    confirmacion.value = "";
    boton.disabled = false;
  }
};

/**
 * Verifica correo y contraseña contra una cuenta creada antes de guardar la sesión.
 * @method validarLogin
 * @param {Event} event - Evento submit declarado en HTML
 * @return {Promise<void>} Finalización de la validación local
 */
const validarLogin = async (event) => {
  event.preventDefault();
  const formulario = document.getElementById("form-login");
  const boton = document.getElementById("btn-login-submit");
  if (boton.disabled) return;
  limpiarErroresCuenta(formulario, "mensaje-login");
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  const correo = email.value.trim().toLowerCase();
  if (correo.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) {
    informarErrorCuenta("mensaje-login", "Ingresá un correo electrónico válido.", email);
    return;
  }
  if (password.value.trim().length < 8 || password.value.length > 128) {
    informarErrorCuenta("mensaje-login", "Ingresá tu contraseña de demostración de 8 a 128 caracteres.", password);
    return;
  }
  boton.disabled = true;
  try {
    const cuenta = obtenerCuentasDemo().find((usuario) => usuario.email.toLowerCase() === correo);
    if (!cuenta || await derivarContrasena(password.value, cuenta.sal) !== cuenta.hash) {
      informarErrorCuenta("mensaje-login", "El correo o la contraseña no coinciden con una cuenta de este navegador. Si aún no tenés cuenta, creala desde el enlace Crear cuenta.", password);
      return;
    }
    localStorage.setItem("laure_usuario", JSON.stringify({ email: cuenta.email, nombre: cuenta.nombre, autenticado: true }));
    alert(`¡Bienvenido/a, ${cuenta.nombre}! Iniciaste la sesión de demostración.`);
    window.location.href = "index.html";
  } catch (error) {
    informarErrorCuenta("mensaje-login", error.name === "QuotaExceededError" || error.name === "SecurityError"
      ? "El navegador no permite guardar la sesión. Habilitá el almacenamiento local e intentá nuevamente."
      : error.message);
  } finally {
    password.value = "";
    boton.disabled = false;
  }
};

/**
 * Recupera una sesión coherente con una cuenta local y descarta sesiones antiguas o dañadas.
 * @method obtenerSesionDemo
 * @return {Object|null} Cuenta activa de demostración o null
 */
const obtenerSesionDemo = () => {
  try {
    const datos = localStorage.getItem("laure_usuario");
    if (!datos) return null;
    const sesion = JSON.parse(datos);
    const cuenta = sesion && sesion.autenticado === true
      ? obtenerCuentasDemo().find((usuario) => usuario.email === sesion.email) : null;
    if (cuenta) return { nombre: cuenta.nombre, email: cuenta.email };
    localStorage.removeItem("laure_usuario");
  } catch (error) {
    // Una sesión inválida o un navegador sin almacenamiento se muestran como sin acceso.
  }
  return null;
};

/**
 * Cierra la sesión de demostración y vuelve a la portada.
 * @method cerrarSesion
 * @return {void} No retorna ningún valor
 */
const cerrarSesion = () => {
  try {
    localStorage.removeItem("laure_usuario");
    alert("Cerraste la sesión de demostración.");
    window.location.href = "index.html";
  } catch (error) {
    alert("El navegador no permite acceder al almacenamiento. Revisá sus permisos para cerrar la sesión guardada.");
  }
};

/**
 * Restablece únicamente cuentas y sesión de demostración tras confirmación explícita.
 * @method restablecerCuentasDemo
 * @return {void} No retorna ningún valor
 */
const restablecerCuentasDemo = () => {
  if (!confirm("¿Querés eliminar todas las cuentas de demostración y su sesión en este navegador? El carrito se conserva.")) return;
  try {
    localStorage.removeItem(CLAVE_CUENTAS);
    localStorage.removeItem("laure_usuario");
    verificarSesionEnNav();
    document.getElementById("mensaje-registro").textContent = "Las cuentas de demostración se restablecieron. Podés crear una nueva.";
    document.getElementById("mensaje-registro").classList.remove("error");
  } catch (error) {
    informarErrorCuenta("mensaje-registro", "El navegador no permite restablecer los datos locales. Revisá sus permisos de almacenamiento.");
  }
};

/**
 * Clona la navegación declarada en HTML y completa el nombre mediante textContent.
 * @method verificarSesionEnNav
 * @return {void} No retorna ningún valor
 */
const verificarSesionEnNav = () => {
  const contenedor = document.getElementById("nav-usuario");
  if (!contenedor) return;
  const usuario = obtenerSesionDemo();
  const plantilla = document.getElementById(usuario ? "plantilla-nav-sesion" : "plantilla-nav-acceso");
  if (!plantilla) return;
  const contenido = plantilla.content.cloneNode(true);
  if (usuario) contenido.querySelector("[data-nombre-usuario]").textContent = usuario.nombre;
  contenedor.replaceChildren(contenido);
};

/**
 * Alterna el formulario de acceso y el panel de sesión ya definidos en HTML.
 * @method verificarEstadoLoginCard
 * @return {void} No retorna ningún valor
 */
const verificarEstadoLoginCard = () => {
  const panel = document.getElementById("sesion-activa");
  if (!panel) return;
  const usuario = obtenerSesionDemo();
  panel.hidden = !usuario;
  document.getElementById("acceso-contenido").hidden = Boolean(usuario);
  if (usuario) {
    document.getElementById("sesion-nombre").textContent = usuario.nombre;
    document.getElementById("sesion-email").textContent = usuario.email;
  }
};

/**
 * Inicializa módulos desde el evento onload declarado en el body de cada HTML.
 * @method inicializarApp
 * @return {void} No retorna ningún valor
 */
const inicializarApp = () => {
  actualizarBadgeCarrito();
  verificarSesionEnNav();
  verificarEstadoLoginCard();
  if (document.getElementById("cuerpo-tabla-carrito")) renderizarTablaCarrito();
};
