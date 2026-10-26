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
    alt: "Anillo Solitario Imperial en oro amarillo 18k con diamante central",
    metal: "Oro Amarillo 18k",
    descripcion: "Anillo solitario clásico con diamante engarzado en oro amarillo de 18 quilates."
  },
  {
    id: 2,
    nombre: "Colgante Luminance",
    categoria: "collares",
    precio: 1250000,
    imagen: "imagenes/joyas_collar.jpg",
    alt: "Colgante Luminance en platino noble con diamante talla esmeralda",
    metal: "Platino Noble",
    descripcion: "Gargantilla con colgante de platino pulido y pavé de gemas brillantes."
  },
  {
    id: 3,
    nombre: "Aros Royal Brilliance",
    categoria: "aros",
    precio: 620000,
    imagen: "imagenes/joyas_aros.jpg",
    alt: "Par de aros Royal Brilliance en oro blanco 18k con corte baguette",
    metal: "Oro Blanco 18k",
    descripcion: "Par de aros colgantes en oro blanco 18k con corte baguette deslumbrante."
  },
  {
    id: 4,
    nombre: "Brazalete Étoile",
    categoria: "pulseras",
    precio: 980000,
    imagen: "imagenes/joyas_pulsera.jpg",
    alt: "Brazalete Étoile de oro amarillo 18k con engarce artesanal",
    metal: "Oro Amarillo 18k",
    descripcion: "Pulsera rígida de oro amarillo de 18 quilates con engarce artesanal."
  },
  {
    id: 5,
    nombre: "Anillo Sublime Emerald",
    categoria: "anillos",
    precio: 1450000,
    imagen: "imagenes/joyas_anillo_esmeralda.jpg",
    alt: "Anillo Sublime Emerald con esmeralda colombiana y platino noble",
    metal: "Platino Noble",
    descripcion: "Majestuoso anillo con esmeralda central colombiana y engarce en platino."
  },
  {
    id: 6,
    nombre: "Cronógrafo Prestige",
    categoria: "relojes",
    precio: 2100000,
    imagen: "imagenes/joyas_reloj.jpg",
    alt: "Reloj Cronógrafo Prestige en oro rosa 18k con mecanismo suizo",
    metal: "Oro Rosa 18k",
    descripcion: "Reloj suizo de alta precisión con caja maciza en oro rosa de 18 quilates."
  }
];

const METALES = {
  oro18k: { nombre: "Oro 18k", precio: 95000, etiqueta: "Oro 18k ($95.000/g)" },
  plata925: { nombre: "Plata 925", precio: 12000, etiqueta: "Plata 925 ($12.000/g)" },
  platino: { nombre: "Platino 950", precio: 110000, etiqueta: "Platino 950 ($110.000/g)" }
};
const COSTO_POR_GEMA = 25000;
const COSTO_GRABADO_BASE = 5000;
const CLAVE_CUENTAS = "laure_cuentas_demo";
const formateador = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});
let porcentajeDescuentoCupon = 0;
let ultimaCotizacion = null;

/**
 * Lee el carrito guardado en el navegador.
 * @method obtenerCarrito
 * @return {Array} Productos del carrito
 */
const obtenerCarrito = () => {
  const datos = localStorage.getItem("laure_carrito");
  return datos === null ? [] : JSON.parse(datos);
};

/**
 * Guarda el carrito y actualiza su contador.
 * @method guardarCarrito
 * @param {Array} carrito - Productos seleccionados
 * @return {void}
 */
const guardarCarrito = (carrito) => {
  localStorage.setItem("laure_carrito", JSON.stringify(carrito));
  actualizarBadgeCarrito();
};

/**
 * Muestra la cantidad total de unidades seleccionadas.
 * @method actualizarBadgeCarrito
 * @return {void}
 */
const actualizarBadgeCarrito = () => {
  document.getElementById("badge-carrito").innerText = obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
};

/**
 * Agrega una pieza del catálogo o aumenta su cantidad.
 * @method agregarAlCarrito
 * @param {number} idProducto - Identificador de la pieza
 * @return {void}
 */
const agregarAlCarrito = (idProducto) => {
  const producto = PRODUCTOS.find((item) => item.id === idProducto);
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === idProducto);
  if (existente) {
    if (existente.cantidad >= 30) {
      alert("Alcanzaste el límite máximo de 30 unidades para este producto exclusivo.");
      return;
    }
    existente.cantidad += 1;
  } else {
    carrito[carrito.length] = {
      id: producto.id,
      nombre: producto.nombre,
      metal: producto.metal,
      precio: producto.precio,
      cantidad: 1
    };
  }
  guardarCarrito(carrito);
  alert(`¡"${producto.nombre}" fue añadido al carrito de compras con éxito!`);
};

/**
 * Agrega al carrito la última cotización calculada.
 * @method agregarCotizacionAlCarrito
 * @return {void}
 */
const agregarCotizacionAlCarrito = () => {
  if (!ultimaCotizacion) {
    alert("Por favor, calculá primero un presupuesto en el cotizador antes de agregarlo al carrito.");
    return;
  }
  const carrito = obtenerCarrito();
  carrito[carrito.length] = {
    id: "personalizada",
    nombre: ultimaCotizacion.nombre,
    metal: ultimaCotizacion.metal,
    precio: ultimaCotizacion.precio,
    cantidad: 1
  };
  guardarCarrito(carrito);
  alert(`¡Tu joya personalizada ("${ultimaCotizacion.nombre}") fue añadida al carrito de compras con éxito!`);
};

/**
 * Cambia la cantidad de una fila del carrito.
 * @method modificarCantidadCarrito
 * @param {number} indice - Posición del producto
 * @param {string} nuevaCantidad - Cantidad ingresada
 * @return {void}
 */
const modificarCantidadCarrito = (indice, nuevaCantidad) => {
  const cantidad = parseFloat(nuevaCantidad);
  if (isNaN(cantidad) || cantidad !== parseInt(cantidad, 10)) {
    alert("Por favor, ingresá un número entero válido de unidades.");
    renderizarTablaCarrito();
    return;
  }
  if (cantidad <= 0) {
    eliminarDelCarrito(indice);
    return;
  }
  const carrito = obtenerCarrito();
  if (cantidad > 30) {
    alert("Por motivos de stock artesanal, el límite máximo por pieza es de 30 unidades.");
  }
  carrito[indice].cantidad = cantidad > 30 ? 30 : cantidad;
  guardarCarrito(carrito);
  renderizarTablaCarrito();
};

/**
 * Elimina una fila después de confirmar la acción.
 * @method eliminarDelCarrito
 * @param {number} indice - Posición del producto
 * @return {void}
 */
const eliminarDelCarrito = (indice) => {
  const carrito = obtenerCarrito();
  const nombre = carrito[indice].nombre;
  if (confirm(`¿Querés eliminar "${nombre}" de tu carrito?`)) {
    carrito.splice(indice, 1);
    guardarCarrito(carrito);
    alert(`"${nombre}" ha sido removido del carrito.`);
  }
  renderizarTablaCarrito();
};

/**
 * Vacía el carrito después de confirmar la acción.
 * @method vaciarCarrito
 * @return {void}
 */
const vaciarCarrito = () => {
  if (obtenerCarrito().length === 0) {
    alert("El carrito ya se encuentra vacío.");
    return;
  }
  if (!confirm("¿Querés vaciar todos los artículos de tu carrito?")) return;
  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  renderizarTablaCarrito();
  alert("El carrito de compras ha sido vaciado correctamente.");
};

/**
 * Alterna los mensajes de éxito y error definidos en el HTML.
 * @method mostrarMensaje
 * @param {string} destino - ID del mensaje de éxito
 * @param {string} texto - Mensaje para el usuario
 * @param {boolean} esError - Indica si corresponde mostrar un error
 * @return {void}
 */
const mostrarMensaje = (destino, texto, esError = false) => {
  document.getElementById(destino).innerText = esError ? "" : texto;
  document.getElementById(destino).hidden = esError;
  document.getElementById(`${destino}-error`).innerText = esError ? texto : "";
  document.getElementById(`${destino}-error`).hidden = !esError;
};

/**
 * Aplica el descuento del cupón ingresado.
 * @method validarCupon
 * @return {void}
 */
const validarCupon = () => {
  const input = document.getElementById("input-cupon");
  const codigo = input.value.trim().toLowerCase();
  if (codigo === "") {
    mostrarMensaje("mensaje-cupon", "Por favor, ingresá un código de cupón antes de aplicar.", true);
    return;
  }
  if (obtenerCarrito().length === 0) {
    mostrarMensaje("mensaje-cupon", "Tu carrito está vacío. Agregá productos desde el catálogo antes de aplicar un cupón de descuento.", true);
    input.value = "";
    return;
  }
  const descuento = codigo === "laure10" ? 0.10 : codigo === "pedroyjoaquin" ? 0.80 : 0;
  const nombre = codigo === "laure10" ? "LAURE10" : codigo;
  if (descuento === 0) {
    porcentajeDescuentoCupon = 0;
    mostrarMensaje("mensaje-cupon", "El cupón ingresado no es válido o ha expirado. Podés probar ingresando el código 'LAURE10'.", true);
    input.value = "";
  } else if (porcentajeDescuentoCupon === descuento) {
    mostrarMensaje("mensaje-cupon", `El cupón '${nombre}' ya está aplicado: ${descuento * 100}% de descuento sobre tu pedido.`);
  } else {
    porcentajeDescuentoCupon = descuento;
    mostrarMensaje("mensaje-cupon", `¡Cupón '${nombre}' aplicado con éxito! Se aplicó un ${descuento * 100}% de descuento sobre el total.`);
  }
  renderizarTablaCarrito();
};

/**
 * Confirma la compra de demostración y permite volver al inicio.
 * @method confirmarCompra
 * @return {boolean} Indica si el formulario puede continuar al inicio
 */
const confirmarCompra = () => {
  if (obtenerCarrito().length === 0) {
    alert("Tu carrito está vacío. Agregá productos desde el catálogo antes de confirmar la compra.");
    return false;
  }
  if (!confirm("¿Querés finalizar esta compra de demostración? Se vaciará el carrito; no se enviará ningún pedido ni se procesará un pago.")) return false;
  const mensajeCupon = porcentajeDescuentoCupon === 0.80
    ? " Cupón 'pedroyjoaquin' aplicado: 80% de descuento sobre el total." : "";
  alert("Compra de demostración finalizada. Se vació el carrito. No se envió ningún pedido ni se procesó un pago." + mensajeCupon);
  localStorage.removeItem("laure_carrito");
  porcentajeDescuentoCupon = 0;
  actualizarBadgeCarrito();
  return true;
};

/**
 * Genera las filas del carrito y calcula sus totales.
 * @method renderizarTablaCarrito
 * @return {void}
 */
const renderizarTablaCarrito = () => {
  const carrito = obtenerCarrito();
  let filas = "";
  let subtotal = 0;
  carrito.forEach((item, i) => {
    const importe = item.precio * item.cantidad;
    subtotal += importe;
    filas += `
      <tr>
        <td><strong>${item.nombre}</strong></td>
        <td><span class="badge-metal">${item.metal}</span></td>
        <td>${formateador.format(item.precio)}</td>
        <td>
          <label class="solo-lectores" for="cantidad-carrito-${i}">Cantidad para ${item.nombre}</label>
          <input id="cantidad-carrito-${i}" type="number" min="1" max="30" value="${item.cantidad}" onchange="modificarCantidadCarrito(${i}, this.value)" />
        </td>
        <td>${formateador.format(importe)}</td>
        <td><button type="button" class="btn-peligro" onclick="eliminarDelCarrito(${i})">Eliminá</button></td>
      </tr>`;
  });
  if (carrito.length === 0) {
    filas = '<tr class="carrito-vacio-mensaje"><td colspan="6">Tu carrito se encuentra actualmente vacío. Te invitamos a explorar nuestro catálogo de piezas exclusivas.</td></tr>';
    porcentajeDescuentoCupon = 0;
    mostrarMensaje("mensaje-cupon", "");
  }
  const descuento = subtotal * porcentajeDescuentoCupon;
  document.getElementById("cuerpo-tabla-carrito").innerHTML = filas;
  document.getElementById("subtotal-carrito-texto").innerText = `${formateador.format(subtotal)} ARS`;
  document.getElementById("descuento-carrito-texto").innerText = descuento > 0
    ? `- ${formateador.format(descuento)} (${porcentajeDescuentoCupon * 100}%) ARS` : `${formateador.format(0)} ARS`;
  document.getElementById("total-carrito-texto").innerText = `${formateador.format(subtotal - descuento)} ARS`;
};

/**
 * Filtra los productos, los ordena y genera sus tarjetas.
 * @method filtrarYOrdenar
 * @return {void}
 */
const filtrarYOrdenar = () => {
  const categoria = document.getElementById("select-categoria").value;
  const orden = document.getElementById("select-orden").value;
  const texto = document.getElementById("input-busqueda").value.trim().toLowerCase();
  const lista = PRODUCTOS.filter((producto) =>
    (categoria === "todas" || producto.categoria === categoria) &&
    (producto.nombre.toLowerCase().includes(texto) || producto.categoria.includes(texto) || producto.metal.toLowerCase().includes(texto))
  );
  if (orden === "precio-menor") {
    lista.sort((a, b) => a.precio - b.precio);
  } else if (orden === "precio-mayor") {
    lista.sort((a, b) => b.precio - a.precio);
  } else if (orden === "nombre-az") {
    lista.sort((a, b) => a.nombre.toLowerCase() < b.nombre.toLowerCase() ? -1 : a.nombre.toLowerCase() > b.nombre.toLowerCase() ? 1 : 0);
  }
  let tarjetas = "";
  lista.forEach((producto) => {
    tarjetas += `
      <article class="card-producto">
        <div class="card-imagen-wrapper">
          <img class="card-img" src="${producto.imagen}" alt="${producto.alt}" />
        </div>
        <div class="card-cuerpo">
          <span class="badge-metal">${producto.metal}</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <p class="precio-texto">${formateador.format(producto.precio)} ARS</p>
          <button type="button" class="btn-primario" onclick="agregarAlCarrito(${producto.id})">Agregá al Carrito</button>
        </div>
      </article>`;
  });
  document.getElementById("catalogo-grid").innerHTML = tarjetas;
  document.getElementById("sin-resultados-catalogo").hidden = lista.length !== 0;
};

/**
 * Actualiza el catálogo al escribir en la búsqueda.
 * @method buscarProductos
 * @return {void}
 */
const buscarProductos = () => {
  filtrarYOrdenar();
};

/**
 * Restablece la búsqueda, categoría y orden iniciales.
 * @method restablecerFiltrosCatalogo
 * @return {void}
 */
const restablecerFiltrosCatalogo = () => {
  document.getElementById("select-categoria").value = "todas";
  document.getElementById("select-orden").value = "defecto";
  document.getElementById("input-busqueda").value = "";
  filtrarYOrdenar();
};

/**
 * Comprueba que el peso esté entre 1 y 500 gramos.
 * @method validarPeso
 * @param {HTMLInputElement} input - Campo de peso
 * @return {boolean} Indica si el peso es válido
 */
const validarPeso = (input) => {
  const peso = parseFloat(input.value);
  if (isNaN(peso) || peso < 1 || peso > 500) {
    alert("Por favor, ingresá un peso válido en gramos (entre 1 y 500 gramos).");
    input.value = "";
    return false;
  }
  return true;
};

/**
 * Comprueba que las gemas sean una cantidad entera entre 0 y 30.
 * @method validarGemas
 * @param {HTMLInputElement} input - Campo de gemas
 * @return {boolean} Indica si la cantidad es válida
 */
const validarGemas = (input) => {
  if (input.value === "") input.value = "0";
  const cantidad = parseFloat(input.value);
  if (isNaN(cantidad) || cantidad !== parseInt(cantidad, 10) || cantidad < 0 || cantidad > 30) {
    alert("La cantidad de gemas debe ser un número entero entre 0 y 30.");
    input.value = "";
    return false;
  }
  return true;
};

/**
 * Calcula y muestra el precio por metal, peso, gemas y grabado.
 * @method calcularPresupuesto
 * @return {void}
 */
const calcularPresupuesto = () => {
  const peso = document.getElementById("peso-joya");
  const gemas = document.getElementById("cantidad-gemas");
  if (!validarPeso(peso) || !validarGemas(gemas)) return;
  const metal = METALES[document.getElementById("tipo-metal").value];
  const grabado = document.getElementById("texto-grabado").value.trim();
  const importeMetal = parseFloat(peso.value) * metal.precio;
  const importeGemas = parseFloat(gemas.value) * COSTO_POR_GEMA;
  const importeGrabado = grabado === "" ? 0 : COSTO_GRABADO_BASE;
  const total = importeMetal + importeGemas + importeGrabado;
  document.getElementById("detalle-metal").innerText = `${peso.value}g de ${metal.etiqueta}: ${formateador.format(importeMetal)}`;
  document.getElementById("detalle-gemas").innerText = `${gemas.value} gema(s) engarzada(s): ${formateador.format(importeGemas)}`;
  document.getElementById("detalle-grabado").innerText = grabado === ""
    ? "Sin grabado personalizado: $0" : `Grabado ("${grabado}"): ${formateador.format(importeGrabado)}`;
  document.getElementById("monto-final").innerText = formateador.format(total);
  document.getElementById("contenedor-resultado").hidden = false;
  ultimaCotizacion = { nombre: `Joya a Medida (${metal.nombre})`, metal: metal.nombre, precio: total };
};

/**
 * Limpia el cotizador y oculta su resultado.
 * @method limpiarCotizador
 * @return {void}
 */
const limpiarCotizador = () => {
  document.getElementById("peso-joya").value = "";
  document.getElementById("tipo-metal").value = "oro18k";
  document.getElementById("cantidad-gemas").value = "0";
  document.getElementById("texto-grabado").value = "";
  document.getElementById("contenedor-resultado").hidden = true;
  ultimaCotizacion = null;
};

/**
 * Lee el array de cuentas guardadas en este navegador.
 * @method obtenerCuentasDemo
 * @return {Array} Cuentas locales
 */
const obtenerCuentasDemo = () => {
  const datos = localStorage.getItem(CLAVE_CUENTAS);
  return datos === null ? [] : JSON.parse(datos);
};

/**
 * Muestra un error de cuenta y limpia el campo indicado.
 * @method informarErrorCuenta
 * @param {string} destino - ID del mensaje
 * @param {string} mensaje - Explicación del error
 * @param {HTMLInputElement} campo - Campo que se debe corregir
 * @return {void}
 */
const informarErrorCuenta = (destino, mensaje, campo) => {
  mostrarMensaje(destino, mensaje, true);
  campo.value = "";
  alert(mensaje);
};

/**
 * Valida y guarda una cuenta con nombre, email y password.
 * @method registrarCuenta
 * @return {void}
 */
const registrarCuenta = () => {
  mostrarMensaje("mensaje-registro", "");
  const nombre = document.getElementById("registro-nombre");
  const email = document.getElementById("registro-email");
  const password = document.getElementById("registro-password");
  const confirmacion = document.getElementById("registro-confirmacion");
  const correo = email.value.trim().toLowerCase();
  if (nombre.value.trim().length < 2 || nombre.value.trim().length > 60) {
    informarErrorCuenta("mensaje-registro", "Ingresá un nombre de 2 a 60 caracteres.", nombre);
    return;
  }
  if (!correo.includes("@") || !correo.includes(".") || correo.length > 80) {
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
  const cuentas = obtenerCuentasDemo();
  if (cuentas.find((cuenta) => cuenta.email === correo)) {
    informarErrorCuenta("mensaje-registro", "Ya existe una cuenta de demostración con ese correo en este navegador. Iniciá sesión o usá otro correo de prueba.", email);
    return;
  }
  cuentas[cuentas.length] = { nombre: nombre.value.trim(), email: correo, password: password.value };
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
  nombre.value = "";
  email.value = "";
  password.value = "";
  confirmacion.value = "";
  mostrarMensaje("mensaje-registro", "Cuenta de demostración creada. Ya podés iniciar sesión desde el enlace Acceso.");
  alert("Cuenta de demostración creada. Iniciá sesión con tu correo y contraseña de prueba.");
};

/**
 * Compara las credenciales con una cuenta previamente registrada.
 * @method validarLogin
 * @return {boolean} Indica si el formulario puede continuar al inicio
 */
const validarLogin = () => {
  mostrarMensaje("mensaje-login", "");
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  const correo = email.value.trim().toLowerCase();
  if (!correo.includes("@") || !correo.includes(".") || correo.length > 80) {
    informarErrorCuenta("mensaje-login", "Ingresá un correo electrónico válido.", email);
    return false;
  }
  if (password.value.trim().length < 8 || password.value.length > 128) {
    informarErrorCuenta("mensaje-login", "Ingresá tu contraseña de demostración de 8 a 128 caracteres.", password);
    return false;
  }
  const cuenta = obtenerCuentasDemo().find((usuario) => usuario.email === correo && usuario.password === password.value);
  if (!cuenta) {
    informarErrorCuenta("mensaje-login", "El correo o la contraseña no coinciden con una cuenta de este navegador. Si aún no tenés cuenta, creala desde el enlace Crear cuenta.", password);
    return false;
  }
  localStorage.setItem("laure_usuario", JSON.stringify({ nombre: cuenta.nombre, email: cuenta.email }));
  password.value = "";
  alert(`¡Bienvenido/a, ${cuenta.nombre}! Iniciaste la sesión de demostración.`);
  return true;
};

/**
 * Lee la sesión guardada en este navegador.
 * @method obtenerSesionDemo
 * @return {Object|null} Usuario activo o ausencia de sesión
 */
const obtenerSesionDemo = () => {
  const datos = localStorage.getItem("laure_usuario");
  return datos === null ? null : JSON.parse(datos);
};

/**
 * Elimina la sesión local antes de volver al inicio.
 * @method cerrarSesion
 * @return {void}
 */
const cerrarSesion = () => {
  localStorage.removeItem("laure_usuario");
  alert("Cerraste la sesión de demostración.");
};

/**
 * Elimina cuentas y sesión sin borrar el carrito.
 * @method restablecerCuentasDemo
 * @return {void}
 */
const restablecerCuentasDemo = () => {
  if (!confirm("¿Querés eliminar todas las cuentas de demostración y su sesión en este navegador? El carrito se conserva.")) return;
  localStorage.removeItem(CLAVE_CUENTAS);
  localStorage.removeItem("laure_usuario");
  verificarSesionEnNav();
  mostrarMensaje("mensaje-registro", "Las cuentas de demostración se restablecieron. Podés crear una nueva.");
};

/**
 * Alterna el acceso y el nombre de usuario en la navegación.
 * @method verificarSesionEnNav
 * @return {void}
 */
const verificarSesionEnNav = () => {
  const usuario = obtenerSesionDemo();
  document.getElementById("nav-acceso").hidden = usuario !== null;
  document.getElementById("nav-sesion").hidden = usuario === null;
  document.getElementById("nav-nombre").innerText = usuario ? usuario.nombre : "";
};

/**
 * Alterna el formulario de acceso y el panel de sesión activa.
 * @method verificarEstadoLoginCard
 * @return {void}
 */
const verificarEstadoLoginCard = () => {
  const usuario = obtenerSesionDemo();
  document.getElementById("sesion-activa").hidden = usuario === null;
  document.getElementById("acceso-contenido").hidden = usuario !== null;
  if (usuario) {
    document.getElementById("sesion-nombre").innerText = usuario.nombre;
    document.getElementById("sesion-email").innerText = usuario.email;
  }
};

/**
 * Carga la navegación y el contenido de la página desde su onload.
 * @method inicializarApp
 * @return {void}
 */
const inicializarApp = () => {
  actualizarBadgeCarrito();
  verificarSesionEnNav();
  if (document.getElementById("sesion-activa")) verificarEstadoLoginCard();
  if (document.getElementById("catalogo-grid")) filtrarYOrdenar();
  if (document.getElementById("cuerpo-tabla-carrito")) renderizarTablaCarrito();
};
