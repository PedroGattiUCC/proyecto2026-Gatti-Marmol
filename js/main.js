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

/* ==========================================================================
   MÓDULO DE CARRITO DE COMPRAS Y PERSISTENCIA (localStorage)
   ========================================================================== */

/**
 * Recupera el listado de productos almacenados en el carrito de compras desde el almacenamiento local del navegador.
 * @method obtenerCarrito
 * @return {Array<Object>} Arreglo con los objetos de productos presentes en el carrito, o un arreglo vacío si no existen registros
 */
const obtenerCarrito = () => {
  try {
    const datos = localStorage.getItem("laure_carrito");
    return datos ? JSON.parse(datos) : [];
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
    localStorage.setItem("laure_carrito", JSON.stringify(carrito));
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
  const totalItems = carrito.reduce((acumulado, item) => acumulado + (item.cantidad || 0), 0);
  badge.textContent = totalItems.toString();
};

/**
 * Añade una pieza de joyería al carrito de compras utilizando su identificador único. Si ya existe, incrementa su cantidad; de lo contrario, agrega un nuevo ítem con cantidad unitaria.
 * @method agregarAlCarrito
 * @param {number} idProducto - Identificador numérico del producto a incorporar
 * @return {void} No retorna ningún valor
 */
const agregarAlCarrito = (idProducto) => {
  const idNumerico = parseInt(idProducto, 10);
  const productoEncontrado = PRODUCTOS.find((p) => p.id === idNumerico);

  if (!productoEncontrado) {
    alert("El producto seleccionado no pudo ser encontrado.");
    return;
  }

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === idNumerico);

  if (itemExistente) {
    itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
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
 * Modifica la cantidad de unidades de un producto específico en el carrito y actualiza la vista de la tabla.
 * @method modificarCantidadCarrito
 * @param {number} indice - Posición índice del elemento en el arreglo del carrito
 * @param {number|string} nuevaCantidad - Nueva cantidad numérica deseada
 * @return {void} No retorna ningún valor
 */
const modificarCantidadCarrito = (indice, nuevaCantidad) => {
  const carrito = obtenerCarrito();
  const cantidadEntera = parseInt(nuevaCantidad, 10);

  if (isNaN(cantidadEntera) || cantidadEntera <= 0) {
    eliminarDelCarrito(indice);
    return;
  }

  if (carrito[indice]) {
    carrito[indice].cantidad = cantidadEntera;
    guardarCarrito(carrito);
    renderizarTablaCarrito();
  }
};

/**
 * Elimina una joya del carrito de compras según su índice en la lista, guarda el cambio y actualiza la tabla de compras.
 * @method eliminarDelCarrito
 * @param {number} indice - Posición del producto a remover dentro del arreglo
 * @return {void} No retorna ningún valor
 */
const eliminarDelCarrito = (indice) => {
  const carrito = obtenerCarrito();
  if (indice >= 0 && indice < carrito.length) {
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    renderizarTablaCarrito();
  }
};

/**
 * Remueve la totalidad de los artículos del carrito de compras tras comprobar su existencia, resetea cupones y actualiza la interfaz.
 * @method vaciarCarrito
 * @return {void} No retorna ningún valor
 */
const vaciarCarrito = () => {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("El carrito ya se encuentra vacío.");
    return;
  }

  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  renderizarTablaCarrito();
  alert("El carrito de compras ha sido vaciado correctamente.");
};

/**
 * Valida el código de cupón promocional ingresado por el usuario. Si coincide con 'LAURE10', aplica un 10% de descuento y recalcula los totales; si es incorrecto, notifica mediante alert, blanquea el campo y devuelve el foco.
 * @method validarCupon
 * @param {HTMLInputElement} inputElement - Elemento de entrada de texto que contiene el código de cupón
 * @return {void} No retorna ningún valor
 */
const validarCupon = (inputElement) => {
  const input = inputElement || document.getElementById("input-cupon");
  if (!input) {
    return;
  }

  const codigo = input.value.trim().toUpperCase();

  if (codigo === "LAURE10") {
    porcentajeDescuentoCupon = 0.10;
    alert("¡Cupón 'LAURE10' aplicado con éxito! Se aplicó un 10% de descuento sobre el total.");
    renderizarTablaCarrito();
  } else {
    porcentajeDescuentoCupon = 0;
    alert("El cupón ingresado no es válido o ha expirado. Ingrese un cupón vigente.");
    input.value = "";
    input.focus();
    renderizarTablaCarrito();
  }
};

/**
 * Procesa la orden de compra si existen artículos en el carrito, emite mensaje de confirmación, limpia el almacenamiento y redirige a la página principal.
 * @method confirmarCompra
 * @return {void} No retorna ningún valor
 */
const confirmarCompra = () => {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    alert("Su carrito está vacío. Agregue productos desde el catálogo antes de confirmar la compra.");
    return;
  }

  alert("¡Muchas gracias por su compra en Laure Joyas! Su pedido ha sido registrado con éxito. Uno de nuestros asesores se comunicará para coordinar la entrega.");
  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  window.location.href = "index.html";
};

/**
 * Renderiza dinámicamente las filas de la tabla del carrito de compras en el DOM, calculando subtotales por ítem, descuentos de cupones y el total general.
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
    if (elementoSubtotal) elementoSubtotal.textContent = formateador.format(0);
    if (elementoDescuento) elementoDescuento.textContent = formateador.format(0);
    if (elementoTotal) elementoTotal.textContent = formateador.format(0);
    return;
  }

  let subtotalAcumulado = 0;
  let htmlFilas = "";

  carrito.forEach((item, indice) => {
    const cantidad = item.cantidad || 1;
    const precioUnitario = item.precio || 0;
    const subtotalItem = cantidad * precioUnitario;
    subtotalAcumulado += subtotalItem;

    htmlFilas += `
      <tr>
        <td><strong>${item.nombre}</strong></td>
        <td><span class="badge-metal">${item.metal}</span></td>
        <td>${formateador.format(precioUnitario)}</td>
        <td>
          <input
            type="number"
            min="1"
            max="30"
            value="${cantidad}"
            onchange="modificarCantidadCarrito(${indice}, this.value)"
            aria-label="Cantidad para ${item.nombre}"
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
  const montoTotal = subtotalAcumulado - montoDescuento;

  if (elementoSubtotal) {
    elementoSubtotal.textContent = formateador.format(subtotalAcumulado);
  }
  if (elementoDescuento) {
    elementoDescuento.textContent = porcentajeDescuentoCupon > 0
      ? `- ${formateador.format(montoDescuento)} (10%)`
      : formateador.format(0);
  }
  if (elementoTotal) {
    elementoTotal.textContent = formateador.format(montoTotal);
  }
};

/* ==========================================================================
   MÓDULO DE CATÁLOGO (FILTROS Y BÚSQUEDA EN TIEMPO REAL)
   ========================================================================== */

/**
 * Filtra las tarjetas de productos por categoría y las ordena en el DOM según el criterio seleccionado (precio menor, precio mayor o nombre alfabético).
 * @method filtrarYOrdenar
 * @return {void} No retorna ningún valor
 */
const filtrarYOrdenar = () => {
  const selectCategoria = document.getElementById("select-categoria");
  const selectOrden = document.getElementById("select-orden");
  const contenedorGrid = document.getElementById("catalogo-grid");

  if (!contenedorGrid) {
    return;
  }

  const categoriaSeleccionada = selectCategoria ? selectCategoria.value.toLowerCase() : "todas";
  const ordenSeleccionado = selectOrden ? selectOrden.value : "defecto";

  const tarjetas = Array.from(contenedorGrid.querySelectorAll(".card-producto"));
  if (tarjetas.length === 0) {
    return;
  }

  // Filtrado por categoría
  tarjetas.forEach((tarjeta) => {
    const catTarjeta = (tarjeta.getAttribute("data-categoria") || "").toLowerCase();
    const coincide = (categoriaSeleccionada === "todas" || categoriaSeleccionada === "" || catTarjeta === categoriaSeleccionada);
    tarjeta.style.display = coincide ? "flex" : "none";
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
};

/**
 * Realiza una búsqueda en tiempo real sobre las tarjetas de productos del catálogo comparando el texto ingresado con el nombre y la categoría de cada pieza.
 * @method buscarProductos
 * @return {void} No retorna ningún valor
 */
const buscarProductos = () => {
  const inputBusqueda = document.getElementById("input-busqueda");
  const contenedorGrid = document.getElementById("catalogo-grid");

  if (!inputBusqueda || !contenedorGrid) {
    return;
  }

  const texto = inputBusqueda.value.toLowerCase().trim();
  const tarjetas = contenedorGrid.querySelectorAll(".card-producto");

  tarjetas.forEach((tarjeta) => {
    const nombre = (tarjeta.getAttribute("data-nombre") || "").toLowerCase();
    const categoria = (tarjeta.getAttribute("data-categoria") || "").toLowerCase();

    if (texto === "" || nombre.includes(texto) || categoria.includes(texto)) {
      tarjeta.style.display = "flex";
    } else {
      tarjeta.style.display = "none";
    }
  });
};

/* ==========================================================================
   MÓDULO DE COTIZADOR PERSONALIZADO
   ========================================================================== */

/**
 * Valida que el peso numérico ingresado por el usuario se encuentre en el rango permitido (1 a 500 gramos). Si el valor no es válido, notifica al usuario con alert, blanquea el campo de texto y devuelve el foco.
 * @method validarPeso
 * @param {HTMLInputElement} inputElement - Elemento input del DOM que contiene el valor del peso
 * @return {boolean} Retorna true si el valor es válido; de lo contrario false
 */
const validarPeso = (inputElement) => {
  if (!inputElement) {
    return false;
  }

  const valor = parseFloat(inputElement.value);

  if (isNaN(valor) || valor < 1 || valor > 500) {
    alert("Por favor, ingrese un peso válido en gramos (entre 1 y 500 gramos).");
    inputElement.value = "";
    inputElement.focus();
    return false;
  }

  return true;
};

/**
 * Valida que la cantidad de gemas ingresada sea un entero positivo no mayor a 30 piedras. En caso de error, emite una advertencia con alert, restablece el campo a '0' y devuelve el foco.
 * @method validarGemas
 * @param {HTMLInputElement} inputElement - Elemento input del DOM con la cantidad de gemas
 * @return {boolean} Retorna true si la cantidad es admisible; false en caso contrario
 */
const validarGemas = (inputElement) => {
  if (!inputElement) {
    return false;
  }

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
 * Calcula el presupuesto total estimativo de la joya seleccionada considerando tipo de metal, peso, cantidad de gemas y servicio de grabado. Despliega el resumen desglosado y el monto final dentro del contenedor del resultado en la interfaz.
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

  if (!inputPeso || !selectMetal || !inputGemas || !inputGrabado || !contenedorResultado) {
    return;
  }

  // Validación previa de peso obligatorio y en rango
  if (!inputPeso.value || !validarPeso(inputPeso)) {
    alert("Debe ingresar un peso válido en gramos (entre 1 y 500) antes de calcular el presupuesto.");
    inputPeso.focus();
    return;
  }

  // Validación de cantidad de gemas
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
};

/* ==========================================================================
   MÓDULO DE AUTENTICACIÓN SIMPLE (LOGIN Y SESIÓN)
   ========================================================================== */

/**
 * Valida las credenciales ingresadas en el formulario de inicio de sesión (correo electrónico con formato válido y contraseña de al menos 6 caracteres), almacena los datos de sesión en localStorage y redirige al inicio. Si hay errores, muestra un alert, blanquea el campo respectivo y devuelve el foco.
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

  // Validación de formato de correo: debe contener @ y punto luego de la @
  const tieneArroba = email.includes("@");
  const tienePunto = email.includes(".");
  const posicionArroba = email.indexOf("@");
  const posicionPunto = email.lastIndexOf(".");

  if (!tieneArroba || !tienePunto || posicionPunto <= posicionArroba + 1 || posicionArroba === 0 || posicionPunto === email.length - 1) {
    alert("Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).");
    emailInput.value = "";
    emailInput.focus();
    return false;
  }

  // Validación de longitud de contraseña
  if (password.length < 6) {
    alert("La contraseña debe contener al menos 6 caracteres por razones de seguridad.");
    passwordInput.value = "";
    passwordInput.focus();
    return false;
  }

  // Creación del objeto de usuario para la sesión
  const aliasUsuario = email.split("@")[0];
  const nombreFormateado = aliasUsuario.charAt(0).toUpperCase() + aliasUsuario.slice(1);

  const usuario = {
    email: email,
    nombre: nombreFormateado,
    autenticado: true,
    fecha: new Date().toISOString()
  };

  localStorage.setItem("laure_usuario", JSON.stringify(usuario));
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
 * Comprueba si existe una sesión de usuario almacenada en localStorage y actualiza el contenedor de usuario en la barra de navegación para mostrar su nombre y botón de salida, o el enlace de acceso.
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
      contenedorNavUsuario.innerHTML = `
        <span class="usuario-activo">
          Hola, <strong>${usuario.nombre || "Cliente"}</strong>
        </span>
        <button type="button" class="btn-secundario" onclick="cerrarSesion()">Salir</button>
      `;
    } else {
      contenedorNavUsuario.innerHTML = `
        <a href="login.html">Acceso</a>
      `;
    }
  } catch (error) {
    console.error("Error al verificar la sesión en el nav:", error);
    contenedorNavUsuario.innerHTML = `<a href="login.html">Acceso</a>`;
  }
};

/* ==========================================================================
   AUTO-INICIALIZACIÓN DE LA APLICACIÓN
   ========================================================================== */

/**
 * Inicializa los módulos de la aplicación al cargarse completamente el documento DOM: actualiza el distintivo del carrito, valida la sesión activa y renderiza la tabla de compras si se encuentra en la vista del carrito.
 * @method inicializarApp
 * @return {void} No retorna ningún valor
 */
const inicializarApp = () => {
  actualizarBadgeCarrito();
  verificarSesionEnNav();

  const tablaCarrito = document.getElementById("tabla-carrito") || document.getElementById("cuerpo-tabla-carrito");
  if (tablaCarrito) {
    renderizarTablaCarrito();
  }
};

// Registro del evento de inicialización del DOM
document.addEventListener("DOMContentLoaded", inicializarApp);