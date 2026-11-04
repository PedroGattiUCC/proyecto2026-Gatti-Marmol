# Laure Joyas - E-Commerce y Cotizador Web

Proyecto integrador para la cátedra **Taller de Desarrollo Web** (2026) - [Universidad Católica de Córdoba](https://ucc.edu.ar).

---

## Índice

1. [Integrantes](#integrantes)
2. [Sitio en Vivo](#sitio-en-vivo)
3. [Descripción General](#descripción-general)
4. [Pasos de Ejecución](#pasos-de-ejecución)
5. [Páginas del Sitio](#páginas-del-sitio)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Integrantes

| Apellido | Nombre | Legajo | Correo Institucional | GitHub |
| :--- | :--- | :--- | :--- | :--- |
| **Gatti** | Pedro | 2519717 | [2519717@ucc.edu.ar](mailto:2519717@ucc.edu.ar) | [@PedroGattiUCC](https://github.com/PedroGattiUCC) |
| **Mármol** | Joaquin | 2514908 | [2514908@ucc.edu.ar](mailto:2514908@ucc.edu.ar) | [@Gu4co](https://github.com/Gu4co) |

---

## Sitio en Vivo

🌐 **Despliegue en GitHub Pages:** [https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/)

El `index.html` de la raíz redirige a la carpeta `primera-entrega/`. La segunda entrega usa un mock local, así que se ejecuta siguiendo los [pasos de ejecución](#pasos-de-ejecución).

---

## Descripción General

Sitio web para una tienda de joyería artesanal, con un catálogo con filtros, un cotizador de piezas a medida, un carrito y cuentas de prueba.

* **Primera entrega:** sitio desarrollado con **HTML5**, **CSS3** y **JavaScript**. Guarda el carrito y las cuentas en el navegador con `localStorage`.
* **Segunda entrega:** la misma tienda como aplicación de **React** con **Vite**. Lee los productos y registra pedidos y cuentas en un mock de **json-server**.

---

## Pasos de Ejecución

### Primera entrega

No necesita instalación. Se puede ver en el [despliegue de GitHub Pages](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/) o abriendo `primera-entrega/index.html` en el navegador.

### Segunda entrega

Necesita [Node.js](https://nodejs.org) 20.19, o 22.12 o superior. Instalá las dependencias desde la carpeta `segunda-entrega/`:

```bash
cd segunda-entrega
npm install
```

La aplicación y el mock se ejecutan al mismo tiempo, cada uno en su terminal y desde `segunda-entrega/`:

| Terminal | Comando | Dirección |
| :--- | :--- | :--- |
| 1 | `npm run mock` | [http://localhost:4000](http://localhost:4000) |
| 2 | `npm run dev` | [http://localhost:5173](http://localhost:5173) |

Si el mock está apagado, el sitio abre igual, pero el catálogo, los pedidos y las cuentas muestran un mensaje de error.

Otros comandos:

| Comando | Para qué sirve |
| :--- | :--- |
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión generada por `build` |

---

## Páginas del Sitio

Cada título indica el archivo de la primera entrega. En la segunda entrega, las mismas páginas son rutas de React.

| Página | Ruta en la segunda entrega |
| :--- | :--- |
| Inicio | `/` |
| Catálogo | `/catalogo` |
| Cotizador | `/cotizador` |
| Contacto | `/contacto` |
| Carrito | `/carrito` |
| Acceso | `/login` |
| Crear cuenta | `/registro` |
| Página no encontrada | cualquier otra ruta |

### 1. Inicio (`index.html`)
Presentación de la marca, piezas destacadas y tabla comparativa de metales.

### 2. Catálogo (`catalogo.html`)
Listado de productos con buscador, filtro por categoría y ordenamiento por precio y nombre.

### 3. Cotizador (`cotizador.html`)
Calcula un presupuesto según metal, peso, gemas y grabado, y permite agregar la pieza al carrito.

### 4. Contacto (`contacto.html`)
Dirección y correos de los integrantes.

### 5. Carrito (`carrito.html`)
Detalle del pedido, cambio de cantidades, eliminación de productos y total. La primera entrega suma un cupón de descuento (código: `LAURE10`). En la segunda, el carrito se conserva al recargar la página y el pedido se registra en el mock.

### 6. Acceso (`login.html`) y Crear cuenta (`registro.html`)
Primero se crea una cuenta y después se ingresa con ese correo y contraseña. Son cuentas de demostración: no usar datos reales. En la primera entrega se guardan en el navegador y en la segunda, en `src/data/db.json`, que no cifra las contraseñas. La sesión queda guardada en el navegador hasta tocar "Salí".

### 7. Página no encontrada (`404.html`)
Enlaces para volver al inicio o al catálogo.

---

## Tecnologías Utilizadas

### Primera entrega

* **HTML5:** estructura de las páginas, formularios y tablas. Los eventos (`onclick`, `onsubmit`, etc.) se declaran en el HTML.
* **CSS3:** una única hoja de estilos, con Flexbox, Grid y adaptación a celulares.
* **JavaScript:** búsqueda y filtros del catálogo, cotizador, carrito y validación de formularios.
* **LocalStorage:** guarda el carrito, las cuentas y la sesión del usuario.
* **Google Fonts:** tipografías Montserrat y Playfair Display.

### Segunda entrega

* **React:** componentes funcionales con JSX y los hooks `useState`, `useEffect` y `useNavigate`.
* **Vite:** creación del proyecto, servidor de desarrollo y compilación, con alias para los imports.
* **React Router (`react-router-dom`):** rutas de las páginas y `Outlet` en el diseño principal.
* **SASS (SCSS):** variables, mixins y una hoja de estilos por componente o página.
* **json-server:** mock de los servicios de productos, pedidos y usuarios, a partir de `db.json`.
* **Fetch API:** pedidos GET y POST al mock con `async` y `await`.
* **LocalStorage:** guarda el carrito y la sesión del usuario.
* **ESLint:** revisión del código.
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
* `segunda-entrega/`: todo lo de la segunda entrega.
  * `public/`: favicon e imágenes servidas por ruta directa.
  * `src/api/`: pedidos al mock con `fetch`.
  * `src/assets/`: imágenes importadas desde los componentes.
  * `src/components/`: componentes reutilizables, como `Button` e `Input`.
  * `src/data/`: `db.json` del mock y lectura y guardado del carrito y la sesión.
  * `src/layouts/`: `MainLayout`, con `Header`, `Footer` y `Outlet`.
  * `src/pages/`: una página por cada ruta.
  * `src/styles/`: hojas de estilos SCSS.
  * `Requerimientos.md`: consigna de la segunda entrega.
