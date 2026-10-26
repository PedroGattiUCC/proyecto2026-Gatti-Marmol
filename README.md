# Laure Joyas - E-Commerce y Cotizador Web

Proyecto integrador de **Taller de Desarrollo Web** (2026), [Universidad Católica de Córdoba](https://ucc.edu.ar).

## Índice

1. [Integrantes](#integrantes)
2. [Sitio en vivo](#sitio-en-vivo)
3. [Descripción general](#descripción-general)
4. [Páginas del sitio](#páginas-del-sitio)
5. [Ejecución local](#ejecución-local)
6. [Tecnologías utilizadas](#tecnologías-utilizadas)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Alcance de la demostración](#alcance-de-la-demostración)

## Integrantes

| Apellido | Nombre | Legajo | Correo institucional | GitHub |
| :--- | :--- | :--- | :--- | :--- |
| **Gatti** | Pedro | 2519717 | [2519717@ucc.edu.ar](mailto:2519717@ucc.edu.ar) | [PedroGattiUCC](https://github.com/PedroGattiUCC) |
| **Mármol** | Joaquin | 2514908 | [2514908@ucc.edu.ar](mailto:2514908@ucc.edu.ar) | [Gu4co](https://github.com/Gu4co) |

## Sitio en vivo

[Entrada en GitHub Pages](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/) · [Primera entrega](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/primera-entrega/index.html).

La raíz conserva una entrada que redirige al sitio de `primera-entrega/` y un `404.html` de publicación que conduce a la vista de error dentro de esa carpeta. Los cambios locales se reflejan en GitHub Pages después de publicarlos.

## Descripción general

Sitio académico de una tienda de joyería desarrollado con **HTML5**, **CSS3** y **JavaScript**. Incluye catálogo con filtros, cotizador de piezas a medida, carrito y cuentas de demostración almacenadas en el navegador.

## Páginas del sitio

### Recorrido principal

| Página | Contenido |
| :--- | :--- |
| [Inicio](primera-entrega/index.html) | Presentación, piezas destacadas y comparación de metales. |
| [Catálogo](primera-entrega/catalogo.html) | Búsqueda, filtro por categoría y ordenamiento. |
| [Cotizador](primera-entrega/cotizador.html) | Cálculo por metal, peso, gemas y grabado; permite añadir la pieza al carrito. |
| [Contacto](primera-entrega/contacto.html) | Dirección de referencia y contactos académicos de los autores. |
| [Carrito](primera-entrega/carrito.html) | Cantidades, eliminación, cupón `LAURE10` y total de demostración. |
| [Acceso](primera-entrega/login.html) | Verificación de una cuenta previamente creada en este navegador y cierre de sesión. |
| [Crear cuenta](primera-entrega/registro.html) | Registro local con nombre, correo, contraseña de prueba y confirmación. |
| [Página no encontrada](primera-entrega/404.html) | Enlaces para regresar al inicio o catálogo. |

## Ejecución local

No requiere instalar paquetes. Con Python 3, desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abrir [Laure Joyas en localhost](http://localhost:8000/primera-entrega/index.html). Utilizar `localhost` o HTTPS para disponer de Web Crypto en los formularios de cuenta. No abrir los HTML directamente mediante `file://`.

El `404.html` de la raíz utiliza el prefijo `/proyecto2026-Gatti-Marmol/` de GitHub Pages para que sus enlaces funcionen también desde URLs inexistentes anidadas. Para revisar su diseño localmente, abrir `primera-entrega/404.html`.

## Tecnologías utilizadas

- **HTML5:** estructura semántica, formularios, tablas y plantillas `<template>`; eventos declarados en HTML.
- **CSS3:** una única hoja de estilos, Flexbox, Grid, estados con `hidden` y adaptación a pantallas pequeñas.
- **JavaScript:** funciones flecha documentadas, validaciones, catálogo, cotizador y carrito.
- **localStorage:** carrito, cuentas y sesión de demostración de este navegador.
- **Web Crypto:** derivación PBKDF2 con SHA-256, 100.000 iteraciones y sal aleatoria individual de 16 bytes; no se guardan contraseñas en texto claro.
- **Google Fonts:** Montserrat y Playfair Display.
- **GitHub Pages:** publicación del sitio estático.

## Estructura del proyecto

```text
proyecto2026-Gatti-Marmol/
├── README.md
├── index.html                    # Entrada de publicación
├── 404.html                      # Entrada de error para GitHub Pages
├── primera-entrega/
│   ├── Requerimientos.md
│   ├── index.html
│   ├── catalogo.html
│   ├── cotizador.html
│   ├── contacto.html
│   ├── carrito.html
│   ├── login.html
│   ├── registro.html
│   ├── 404.html
│   ├── css/styles.css
│   ├── js/main.js
│   ├── imagenes/
│   ├── Sketch/
│   └── Wireframe/
└── segunda-entrega/
    └── Requerimientos.md
```

Los prototipos y su cobertura se documentan en [Sketch](primera-entrega/Sketch/README.md) y [Wireframe](primera-entrega/Wireframe/README.md). Los sketches incluyen el template oficial aplicado digitalmente; no se presentan como dibujos realizados en papel.

## Alcance de la demostración

No usar datos ni contraseñas reales. El registro comprueba nombre, correo, longitud de contraseña, confirmación y correos duplicados. Después de crear una cuenta, se puede ingresar desde Acceso. Las cuentas solo existen en el navegador y origen donde se crearon; no hay servidor de autenticación, recuperación por correo ni sincronización entre dispositivos.

Los formularios muestran errores accesibles y alertas; los datos de cuentas dañados se informan y pueden borrarse mediante **Restablecé las cuentas de demostración**. Esa acción elimina cuentas y sesión locales, conservando el carrito. Los datos del navegador pueden ser alterados por quien lo usa: esta demostración no constituye autenticación para un comercio real.

El cotizador muestra precios orientativos; confirmar el carrito produce un mensaje local de demostración, no procesa pagos ni envía pedidos. Contacto abre la aplicación de correo mediante enlaces `mailto:` y no envía mensajes desde el sitio.

Las consignas del segundo parcial están en `segunda-entrega/Requerimientos.md`; esta corrección mantiene la primera entrega en HTML, CSS y JavaScript, sin migrarla a React.

El detalle de los issues atendidos y las pruebas realizadas está en [Correcciones](primera-entrega/CORRECCIONES.md).

Las fuentes oficiales y sus templates están enlazados en [Consignas de la cátedra](CONSIGNAS.md).
