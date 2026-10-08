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
   UTILIDADES DE SEGURIDAD Y PREVENCIÓN DE VULNERABILIDADES
   ========================================================================== */

/**
 * Sanitiza una cadena de texto para evitar ataques de inyección de código (DOM XSS)
 * antes de insertarla dinámicamente en el DOM.
 * @method escaparHTML
 * @param {string} cadena - Texto a sanitizar
 * @return {string} Cadena segura con caracteres especiales codificados en entidades HTML
 */
const escaparHTML = (cadena) => {
  if (typeof cadena !== "string") {
    return "";
  }
  return cadena
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

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
      alert("Ha alcanzado el límite máximo de 30 unidades para este producto exclusivo.");
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
    alert("Por favor, calcule primero un presupuesto en el cotizador antes de agregarlo al carrito.");
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
  alert(`¡Su joya personalizada ("${ultimaCotizacion.nombre}") fue añadida al carrito de compras con éxito!`);
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
    alert("Por favor, ingrese un número entero válido de unidades.");
    renderizarTablaCarrito();
    return;
  }

  // Si ingresa 0 o negativo, confirmación preventiva para evitar borrado accidental
  if (cantidadEntera <= 0) {
    const confirmar = confirm(`¿Desea eliminar "${carrito[indiceNumerico].nombre}" del carrito de compras?`);
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
    const seguro = confirm(`¿Está seguro de que desea eliminar "${nombreProducto}" de su carrito?`);
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

  const seguro = confirm("¿Está seguro de que desea vaciar la totalidad de los artículos de su carrito de compras?");
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
 * Valida el código de cupón promocional ingresado por el usuario. Si coincide con 'LAURE10', aplica un 10% de descuento y recalcula los totales;
 * si es incorrecto, notifica mediante alert, blanquea el campo y devuelve el foco.
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

  if (codigo === "") {
    alert("Por favor, ingrese un código de cupón antes de aplicar.");
    input.focus();
    return;
  }

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("Su carrito está vacío. Agregue productos desde el catálogo antes de aplicar un cupón de descuento.");
    input.value = "";
    return;
  }

  if (codigo === "LAURE10") {
    if (porcentajeDescuentoCupon > 0) {
      alert("El cupón 'LAURE10' ya se encuentra aplicado sobre su pedido.");
      return;
    }
    porcentajeDescuentoCupon = 0.10;
    alert("¡Cupón 'LAURE10' aplicado con éxito! Se aplicó un 10% de descuento sobre el total.");
    renderizarTablaCarrito();
  } else {
    porcentajeDescuentoCupon = 0;
    alert("El cupón ingresado no es válido o ha expirado. Puede probar ingresando el código 'LAURE10'.");
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
    alert("Su carrito está vacío. Agregue productos desde el catálogo antes de confirmar la compra.");
    return;
  }

  const confirmar = confirm("¿Desea confirmar su pedido en Laure Joyas y enviar los detalles a nuestro taller de orfebrería?");
  if (!confirmar) {
    return;
  }

  alert("¡Muchas gracias por su compra en Laure Joyas! Su pedido ha sido registrado con éxito. Uno de nuestros asesores se comunicará a la brevedad para coordinar la entrega y detalles de facturación.");
  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  window.location.href = "index.html";
};

/**
 * Renderiza dinámicamente las filas de la tabla del carrito de compras en el DOM, calculando subtotales por ítem, descuentos de cupones y el total general.
 * Incluye sanitización HTML completa para prevenir cualquier vulnerabilidad XSS.
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
        <td colspan="6">Su carrito se encuentra actualmente vacío. Lo invitamos a explorar nuestro catálogo de piezas exclusivas.</td>
      </tr>
    `;
    if (elementoSubtotal) elementoSubtotal.textContent = formateador.format(0) + " ARS";
    if (elementoDescuento) elementoDescuento.textContent = formateador.format(0) + " ARS";
    if (elementoTotal) elementoTotal.textContent = formateador.format(0) + " ARS";
    return;
  }

  let subtotalAcumulado = 0;
  let htmlFilas = "";

  carrito.forEach((item, indice) => {
    const cantidad = Math.max(1, Math.min(30, parseInt(item.cantidad, 10) || 1));
    const precioUnitario = Math.max(0, parseFloat(item.precio) || 0);
    const subtotalItem = cantidad * precioUnitario;
    subtotalAcumulado += subtotalItem;

    const nombreSeguro = escaparHTML(item.nombre || "Joya Exclusiva");
    const metalSeguro = escaparHTML(item.metal || "Aleación Noble");

    htmlFilas += `
      <tr>
        <td><strong>${nombreSeguro}</strong></td>
        <td><span class="badge-metal">${metalSeguro}</span></td>
        <td>${formateador.format(precioUnitario)}</td>
        <td>
          <input
            type="number"
            min="1"
            max="30"
            value="${cantidad}"
            onchange="modificarCantidadCarrito(${indice}, this.value)"
            aria-label="Cantidad para ${nombreSeguro}"
          />
        </td>
        <td>${formateador.format(subtotalItem)}</td>
        <td>
          <button type="button" class="btn-peligro" onclick="eliminarDelCarrito(${indice})">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });

  cuerpoTabla.innerHTML = htmlFilas;

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
      tarjeta.style.display = "flex";
      elementosVisibles++;
    } else {
      tarjeta.style.display = "none";
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

  // Gestión de estado vacío (Empty State) para una experiencia de usuario amigable
  let mensajeSinResultados = document.getElementById("sin-resultados-catalogo");
  if (elementosVisibles === 0) {
    if (!mensajeSinResultados) {
      mensajeSinResultados = document.createElement("div");
      mensajeSinResultados.id = "sin-resultados-catalogo";
      mensajeSinResultados.className = "sin-resultados";
      contenedorGrid.appendChild(mensajeSinResultados);
    }
    mensajeSinResultados.innerHTML = `
      <p>No se encontraron piezas exclusivas que coincidan con los criterios seleccionados.</p>
      <button type="button" class="btn-secundario" onclick="restablecerFiltrosCatalogo()">Restablecer Filtros</button>
    `;
    mensajeSinResultados.style.display = "block";
  } else if (mensajeSinResultados) {
    mensajeSinResultados.style.display = "none";
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
    alert("Por favor, ingrese un peso válido en gramos (entre 1 y 500 gramos).");
    inputElement.value = "";
    inputElement.focus();
    return false;
  }

  const valor = parseFloat(valorTexto);

  if (isNaN(valor) || valor < 1 || valor > 500) {
    alert("Por favor, ingrese un peso válido en gramos (entre 1 y 500 gramos).");
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

  contenedorResultado.style.display = "block";
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
  if (contenedorResultado) contenedorResultado.style.display = "none";
  ultimaCotizacion = null;
};

/* ==========================================================================
   MÓDULO DE AUTENTICACIÓN SIMPLE (LOGIN Y SESIÓN)
   ========================================================================== */

/**
 * Valida las credenciales ingresadas en el formulario de inicio de sesión con chequeo de formato estricto de correo electrónico y longitud de contraseña.
 * Almacena los datos de sesión en localStorage y redirige al inicio. Si hay errores, muestra un alert, blanquea el campo respectivo y devuelve el foco.
 * @method validarLogin
 * @param {Event} event - Objeto de evento del formulario al ejecutarse submit
 * @return {boolean} Retorna true si las credenciales son válidas; de lo contrario false
 */
const validarLogin = (event) => {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  if (!emailInput || !passwordInput) {
    return false;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validación estricta de correo electrónico
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !regexEmail.test(email)) {
    alert("Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).");
    emailInput.value = "";
    emailInput.focus();
    return false;
  }

  // Validación de longitud de contraseña
  if (!password || password.trim().length < 6) {
    alert("La contraseña debe contener al menos 6 caracteres por razones de seguridad.");
    passwordInput.value = "";
    passwordInput.focus();
    return false;
  }

  // Creación del objeto de usuario para la sesión
  const aliasUsuario = email.split("@")[0];
  const nombreLimpio = aliasUsuario.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, " ").trim();
  const nombreFormateado = nombreLimpio.length > 0
    ? (nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1))
    : "Cliente";

  const usuario = {
    email: email,
    nombre: nombreFormateado,
    autenticado: true,
    fecha: new Date().toISOString()
  };

  try {
    localStorage.setItem("laure_usuario", JSON.stringify(usuario));
  } catch (err) {
    console.error("Error al persistir usuario en localStorage:", err);
  }

  alert(`¡Bienvenido/a a Laure Joyas, ${usuario.nombre}! Ha iniciado sesión correctamente.`);
  window.location.href = "index.html";
  return true;
};

/**
 * Cierra la sesión activa del usuario eliminando los datos de autenticación de localStorage, actualiza la barra de navegación y notifica al usuario.
 * @method cerrarSesion
 * @return {void} No retorna ningún valor
 */
const cerrarSesion = () => {
  localStorage.removeItem("laure_usuario");
  alert("Ha cerrado sesión exitosamente.");
  verificarSesionEnNav();
  window.location.href = "index.html";
};

/**
 * Comprueba si existe una sesión de usuario almacenada en localStorage y actualiza el contenedor de usuario en la barra de navegación
 * para mostrar su nombre y botón de salida, o el enlace de acceso. Aplica sanitización para prevenir XSS.
 * @method verificarSesionEnNav
 * @return {void} No retorna ningún valor
 */
const verificarSesionEnNav = () => {
  const contenedorNavUsuario = document.getElementById("nav-usuario");
  if (!contenedorNavUsuario) {
    return;
  }

  try {
    const sesion = localStorage.getItem("laure_usuario");
    if (sesion) {
      const usuario = JSON.parse(sesion);
      const nombreSeguro = escaparHTML(usuario.nombre || "Cliente");
      contenedorNavUsuario.innerHTML = `
        <span class="usuario-activo">
          Hola, <strong>${nombreSeguro}</strong>
        </span>
        <button type="button" class="btn-secundario" onclick="cerrarSesion()">Salir</button>
      `;
    } else {
      contenedorNavUsuario.innerHTML = `<a href="login.html">Acceso</a>`;
    }
  } catch (error) {
    console.error("Error al verificar la sesión en el nav:", error);
    contenedorNavUsuario.innerHTML = `<a href="login.html">Acceso</a>`;
  }
};

/**
 * En caso de hallarse en la vista de login y contar con una sesión activa preexistente,
 * adapta la tarjeta para mostrar el estado actual y evitar confusión en el usuario.
 * @method verificarEstadoLoginCard
 * @return {void} No retorna ningún valor
 */
const verificarEstadoLoginCard = () => {
  const cardLogin = document.getElementById("card-login");
  if (!cardLogin) {
    return;
  }

  try {
    const sesion = localStorage.getItem("laure_usuario");
    if (sesion) {
      const usuario = JSON.parse(sesion);
      const nombreSeguro = escaparHTML(usuario.nombre || "Cliente");
      const emailSeguro = escaparHTML(usuario.email || "");

      cardLogin.innerHTML = `
        <h2>Sesión Activa</h2>
        <p class="subtitulo-seccion">Actualmente ha iniciado sesión con la cuenta de <strong>${nombreSeguro}</strong> (${emailSeguro}).</p>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <a href="index.html" class="btn-primario" style="flex: 1; text-align: center;">Continuar al Inicio</a>
          <button type="button" class="btn-secundario" onclick="cerrarSesion()" style="flex: 1;">Cerrar Sesión</button>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error al verificar estado de la tarjeta de login:", error);
  }
};

/* ==========================================================================
   AUTO-INICIALIZACIÓN DE LA APLICACIÓN Y BLINDAJE GLOBAL
   ========================================================================== */

/**
 * Inicializa los módulos de la aplicación al cargarse completamente el documento DOM:
 * actualiza el distintivo del carrito, valida la sesión activa, renderiza la tabla de compras si corresponde
 * y adapta el login si ya existe sesión activa.
 * @method inicializarApp
 * @return {void} No retorna ningún valor
 */
const inicializarApp = () => {
  actualizarBadgeCarrito();
  verificarSesionEnNav();
  verificarEstadoLoginCard();

  const tablaCarrito = document.getElementById("tabla-carrito") || document.getElementById("cuerpo-tabla-carrito");
  if (tablaCarrito) {
    renderizarTablaCarrito();
  }
};

// Escucha preventiva global para registrar cualquier anomalía no controlada en la consola sin detener la ejecución
window.addEventListener("error", (event) => {
  console.warn("Anomalía interceptada de forma preventiva en tiempo de ejecución:", event.message);
});

// Registro del evento de inicialización del DOM
document.addEventListener("DOMContentLoaded", inicializarApp);