# Laure Joyas - E-Commerce y Cotizador Web

Proyecto integrador para la cátedra **Taller de Desarrollo Web** (2026) - [Universidad Católica de Córdoba](https://ucc.edu.ar).

---

## Índice

1. [Integrantes](#integrantes)
2. [Sitio en Vivo](#sitio-en-vivo)
3. [Descripción General](#descripción-general)
4. [Páginas del Sitio](#páginas-del-sitio)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Integrantes

| Apellido | Nombre | Legajo | Correo Institucional | GitHub |
| :--- | :--- | :--- | :--- | :--- |
| **Gatti** | Pedro | 2519717 | [2519717@ucc.edu.ar](mailto:2519717@ucc.edu.ar) | [@PedroGattiUCC](https://github.com/PedroGattiUCC) |
| **Mármol** | Joaquin | 2514908 | [2514908@ucc.edu.ar](mailto:2514908@ucc.edu.ar) | [@Gu4co](https://github.com/Gu4co) |

---

## Sitio en Vivo

🌐 **Despliegue en GitHub Pages:** [https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/)

El `index.html` de la raíz redirige a la carpeta `primera-entrega/`.

---

## Descripción General

Sitio web para una tienda de joyería artesanal desarrollado con **HTML5**, **CSS3** y **JavaScript**. Incluye un catálogo con filtros, un cotizador de piezas a medida, un carrito y cuentas de prueba guardadas en el navegador con `localStorage`.

---

## Páginas del Sitio

### 1. Inicio (`index.html`)
Presentación de la marca, piezas destacadas y tabla comparativa de metales.

### 2. Catálogo (`catalogo.html`)
Listado de productos con buscador, filtro por categoría y ordenamiento por precio y nombre.

### 3. Cotizador (`cotizador.html`)
Calcula un presupuesto según metal, peso, gemas y grabado, y permite agregar la pieza al carrito.

### 4. Contacto (`contacto.html`)
Dirección y correos de los integrantes.

### 5. Carrito (`carrito.html`)
Detalle del pedido, cambio de cantidades, eliminación de productos, cupón de descuento (código: `LAURE10`) y total.

### 6. Acceso (`login.html`) y Crear cuenta (`registro.html`)
Primero se crea una cuenta y después se ingresa con ese correo y contraseña. Las cuentas se guardan solo en el navegador: no usar datos reales.

### 7. Página no encontrada (`404.html`)
Enlaces para volver al inicio o al catálogo.

---

## Tecnologías Utilizadas

* **HTML5:** estructura de las páginas, formularios y tablas. Los eventos (`onclick`, `onsubmit`, etc.) se declaran en el HTML.
* **CSS3:** una única hoja de estilos, con Flexbox, Grid y adaptación a celulares.
* **JavaScript:** búsqueda y filtros del catálogo, cotizador, carrito y validación de formularios.
* **LocalStorage:** guarda el carrito, las cuentas y la sesión del usuario.
* **Google Fonts:** tipografías Montserrat y Playfair Display.

---

## Estructura del Proyecto

* `primera-entrega/`: todo lo de la primera entrega.
  * `index.html`, `catalogo.html`, `cotizador.html`, `contacto.html`, `carrito.html`, `login.html`, `registro.html`, `404.html`: páginas del sitio.
  * `css/styles.css`: hoja de estilos.
  * `js/main.js`: funciones en JavaScript.
  * `imagenes/`: imágenes y favicon.
  * `Sketch/`: bocetos de cada pantalla ([ver](primera-entrega/Sketch/README.md)).
  * `Wireframe/`: wireframes de cada pantalla ([ver](primera-entrega/Wireframe/README.md)).
  * `Requerimientos.md`: consigna de la primera entrega.
* `segunda-entrega/Requerimientos.md`: consigna de la segunda entrega.
