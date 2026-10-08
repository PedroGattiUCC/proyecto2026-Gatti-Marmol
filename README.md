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

---

## Descripción General

Sitio web para una tienda de joyería artesanal desarrollado desde cero con **HTML5**, **CSS3** y **JavaScript Vanilla**. Incluye un catálogo dinámico con filtros, un cotizador de piezas a medida en tiempo real y almacenamiento del carrito y usuario en el navegador mediante `localStorage`.

---

## Páginas del Sitio

### 1. Inicio (`index.html`)
Portada institucional con presentación de la marca, banner principal, galería de piezas destacadas con compra directa y tabla comparativa sobre metales nobles.

### 2. Catálogo (`catalogo.html`)
Listado completo de productos con **buscador por texto en tiempo real**, **filtros por categoría** y **ordenamiento dinámico por precio y nombre**.

### 3. Cotizador (`cotizador.html`)
Cálculo de presupuestos según metal, peso en gramos y gemas. Aplica **validaciones pedagógicas** (`alert()`, blanqueo de campo y foco automático) y permite añadir la cotización resultante directamente al carrito.

### 4. Carrito (`carrito.html`)
Tabla con el detalle del pedido, actualización de cantidades, eliminación de ítems, aplicación de cupones de descuento (código: `LAURE10`) y cálculo dinámico de subtotales y total final.

### 5. Login (`login.html`)
Formulario de acceso para clientes que valida correo y contraseña, guardando la sesión activa para actualizar la barra de navegación con el nombre del usuario.

---

## Tecnologías Utilizadas

* **HTML5:** Estructura y maquetado de las páginas, con formularios y tablas para organizar la información del sitio.
* **CSS3:** Diseño visual y adaptación para pantallas de celulares y computadoras (diseño responsivo), centralizado en una única hoja de estilos.
* **JavaScript:** Lógica interactiva para la búsqueda y filtrado de joyas, el cotizador en tiempo real y el control de los formularios.
* **LocalStorage:** Almacenamiento en el navegador para mantener guardados los productos del carrito y la sesión del usuario entre páginas.
* **Google Fonts:** Tipografías para la estética de los textos y títulos.

---

## Estructura del Proyecto

* `index.html`, `catalogo.html`, `cotizador.html`, `carrito.html`, `login.html`: Vistas del sitio web.
* `css/styles.css`: Hoja de estilos centralizada y diseño responsive.
* `js/main.js`: Lógica y funciones interactivas en JavaScript.
* `imagenes/`: Recursos gráficos y favicon.
* `Sketch/`: Bocetos iniciales en papel (desktop y mobile).
* `Wireframe/`: Prototipos y diagramas digitales.
* `primera-entrega/`: Consignas y rúbrica de evaluación.