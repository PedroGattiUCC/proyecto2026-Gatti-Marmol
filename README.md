# Laure Joyas - Proyecto Integrador 2026

Repositorio oficial para el desarrollo del proyecto integrador de la cátedra **Taller de Desarrollo Web** (Segundo Año - Semestre 2), carrera de Ingeniería Informática en la [Universidad Católica de Córdoba](https://ucc.edu.ar).

---

## Índice de Contenidos

1. [Título del Proyecto](#título-del-proyecto)
2. [Descripción General](#descripción-general)
3. [Autores e Información Institucional](#autores-e-información-institucional)
4. [Sitio Web en Vivo (GitHub Pages)](#sitio-web-en-vivo-github-pages)
5. [Arquitectura Multi-Página del Sitio](#arquitectura-multi-página-del-sitio)
   - [1. Página Principal (index.html)](#1-página-principal-indexhtml)
   - [2. Catálogo de Productos (catalogo.html)](#2-catálogo-de-productos-catalogohtml)
   - [3. Cotizador Personalizado (cotizador.html)](#3-cotizador-personalizado-cotizadorhtml)
   - [4. Carrito de Compras (carrito.html)](#4-carrito-de-compras-carritohtml)
   - [5. Acceso y Autenticación (login.html)](#5-acceso-y-autenticación-loginhtml)
6. [Tecnologías Aplicadas](#tecnologías-aplicadas)
   - [Primera Entrega (Evaluada)](#primera-entrega-evaluada)
   - [Segunda Entrega (Planificación Futura)](#segunda-entrega-planificación-futura)
7. [Estructura del Repositorio](#estructura-del-repositorio)
8. [Documentación y Defensa Oral](#documentación-y-defensa-oral)
9. [Criterios de Calidad y Cumplimiento de Rúbrica](#criterios-de-calidad-y-cumplimiento-de-rúbrica)

---

## Título del Proyecto

### **Laure Joyas - E-Commerce de Alta Joyería y Cotizador Personalizado**

Plataforma web comercial y catálogo interactivo para una marca de joyería artesanal y accesorios contemporáneos de lujo.

---

## Descripción General

**Laure Joyas** es un e-commerce integral desarrollado para ofrecer una experiencia estética, confiable y funcional en la adquisición de piezas de orfebrería fina (anillos, collares, pulseras, aros y relojes). 

El proyecto combina un escaparate digital enriquecido con un **cotizador interactivo en tiempo real**, permitiendo a los clientes estimar presupuestos personalizados según el tipo de metal precioso (oro 18k, plata 925, platino), gramaje, gemas incrustadas y opciones de grabado, con la posibilidad de incorporar el diseño resultante de forma directa al flujo de compra.

El desarrollo está concebido siguiendo estrictos estándares de **HTML5 semántico**, **CSS3 modular y adaptable (Responsive Web Design)**, y lógica de programación en **JavaScript ES6+ vanilla**, prescindiendo de dependencias externas o librerías que oculten la lógica fundamental de manipulación del DOM y gestión de estado mediante `localStorage`.

---

## Autores e Información Institucional

### Integrantes del Equipo de Desarrollo

| Nombre | Apellido | Legajo | Correo Institucional | Perfil de GitHub |
| :--- | :--- | :--- | :--- | :--- |
| Pedro | **Gatti** | 2519717 | [2519717@ucc.edu.ar](mailto:2519717@ucc.edu.ar) | [@PedroGattiUCC](https://github.com/PedroGattiUCC) |
| Joaquin | **Mármol** | 2514908 | [2514908@ucc.edu.ar](mailto:2514908@ucc.edu.ar) | [@Gu4co](https://github.com/Gu4co) |

### Datos de la Cátedra
* **Institución:** [Universidad Católica de Córdoba (UCC)](https://ucc.edu.ar)
* **Facultad:** Facultad de Ingeniería
* **Carrera:** Ingeniería Informática
* **Materia:** Taller de Desarrollo Web (Segundo Año - Ciclo Lectivo 2026)
* **Docente Titular:** Ing. Carlos Fontanini

---

## Sitio Web en Vivo (GitHub Pages)

El proyecto se encuentra desplegado y accesible públicamente a través de GitHub Pages:

🌐 **[Acceder al Sitio Web de Laure Joyas en Vivo](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/)**

---

## Arquitectura Multi-Página del Sitio

El sitio se estructura en **5 páginas HTML5 independientes y completamente funcionales**, interconectadas mediante una barra de navegación semántica y consistente:

### 1. Página Principal (`index.html`)
* **Propósito:** Portada institucional y vitrina inicial de la marca.
* **Componentes Destacados:**
  * Cabecera semántica con logotipo tipográfico y navegación con indicador de página activa (`.active`).
  * Hero Section con llamada a la acción (*Call to Action*) hacia el catálogo y cotizador.
  * Sección de colecciones destacadas con tarjetas de productos de alta gama.
  * Sección de propuesta de valor institucional (garantía, artesanía y envíos asegurados).
  * Testimonios de clientes y formulario de suscripción a *newsletter*.
  * Pie de página semántico (`<footer>`) con enlaces rápidos, datos de contacto y copyright.

### 2. Catálogo de Productos (`catalogo.html`)
* **Propósito:** Exhibición estructurada del inventario con herramientas dinámicas de exploración.
* **Componentes Destacados:**
  * Barra de herramientas con filtros interactivos por categoría (Todos, Anillos, Collares, Pulseras, Relojes).
  * Selector de ordenamiento en tiempo real (menor precio, mayor precio, nombre alfabético y relevancia) implementado vía JavaScript nativo sobre `data-attributes`.
  * Buscador interactivo por texto con filtrado en vivo de tarjetas visibles.
  * Grilla responsiva de tarjetas de productos (`article.card-joya`) con insignias, especificaciones y botón interactivo "Agregar al Carrito".

### 3. Cotizador Personalizado (`cotizador.html`)
* **Propósito:** Herramienta interactiva para calcular el presupuesto estimado de piezas a medida.
* **Componentes Destacados:**
  * Formulario accesible con vinculación estricta `<label for="...">` e inputs controlados.
  * Selección de tipo de joya y material (Plata 925, Oro 18k, Platino) con multiplicadores de valor.
  * Configuración de peso en gramos y selector numérico de gemas incrustadas.
  * Opciones de personalización con casilla de verificación para grabado personalizado.
  * **Validaciones pedagógicas en JavaScript:** Detección de rangos inválidos, emisión de `alert()`, blanqueo del valor del campo (`input.value = ""`) y reposicionamiento con `.focus()`.
  * Panel de desglose en vivo con cálculo aritmético transparente y botón para transferir la cotización directamente al carrito de compras.

### 4. Carrito de Compras (`carrito.html`)
* **Propósito:** Gestión y confirmación de la orden de compra del cliente.
* **Componentes Destacados:**
  * Tabla semántica accesible con `<caption>`, `<thead>`, `<tbody>`, `<tfoot>` y cabeceras con atributo `scope="col"`.
  * Renderizado dinámico de productos y cotizaciones a partir de `localStorage`.
  * Controles interactivos para modificar cantidades (+ / -), eliminar ítems individuales y vaciar el carrito completo con confirmación modal.
  * Módulo de código de descuento con validación pedagógica para cupón promocional (`LAURE10` otorga 10% de bonificación).
  * Resumen de compra con subtotal, descuento, costo de envío y total final calculado dinámicamente.
  * Botón de confirmación de compra con finalización de transacción y reseteo de almacenamiento.

### 5. Acceso y Autenticación (`login.html`)
* **Propósito:** Módulo de autenticación simulada y gestión de sesión en el frontend.
* **Componentes Destacados:**
  * Formulario semántico de inicio de sesión con campos para correo electrónico institucional y contraseña.
  * Validación de campos obligatorios en el cliente con alertas informativas.
  * Persistencia de sesión mediante clave `laure_usuario` en `localStorage`.
  * Integración con la barra de navegación: actualización reactiva en todas las páginas para exhibir el nombre del usuario autenticado y proveer acción de cierre de sesión.

---

## Tecnologías Aplicadas

### Primera Entrega (Evaluada)
* **HTML5:** Marcado semántico riguroso (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<figcaption>`), tablas de datos accesibles y formularios vinculados.
* **CSS3 Centralizado:** Única hoja de estilos (`css/styles.css`) estructurada ordenadamente en las 5 secciones requeridas por la cátedra:
  1. Estilos Generales y Etiquetas Base.
  2. Identificadores (#id).
  3. Clases (.clase).
  4. Pseudoclases y Pseudoelementos (:hover, :focus, :active, etc.).
  5. Consultas de Medios (@media queries para 900px y 768px).
* **JavaScript ES6+ Vanilla:** Lógica centralizada en `js/main.js` sin librerías externas:
  * Funciones flecha en la totalidad de las declaraciones.
  * Documentación exhaustiva en estándar JsDoc (`@method`, `@param`, `@return`).
  * Validación pedagógica de datos de entrada mediante `alert()`, blanqueo de campos y foco automático.
  * Manipulación segura del DOM con `addEventListener` y atributos de datos (`data-*`).
* **Web Storage API (`localStorage`):** Almacenamiento local en el navegador para sincronizar el estado del carrito (`laure_carrito`) y la sesión (`laure_usuario`) entre las 5 páginas.
* **Google Fonts:** Tipografía web curada ('Cinzel' para estética de lujo en títulos y 'Montserrat' para alta legibilidad en cuerpo de texto).
* **GitHub Pages:** Infraestructura de publicación y despliegue continuo (CI/CD nativo de GitHub).

### Segunda Entrega (Planificación Futura)
* **React 18+:** Migración a componentes declarativos y reutilizables utilizando **Vite** como entorno de empaquetado.
* **React Router DOM v6:** Enrutamiento del lado del cliente (*Single Page Application* - SPA) con rutas anidadas y `<Outlet />`.
* **SASS (.scss):** Modularización de estilos mediante variables, mixins, nesting y arquitectura BEM/Atomic.
* **Servicio Simulado & Asincronismo:** Consumo de catálogo mockeado mediante `fetch` con `async/await`, promesas y manejo de estados de carga/error.

---

## Estructura del Repositorio

```text
proyecto2026-Gatti-Marmol/
├── .gitignore                          # Configuración de exclusiones de control de versiones
├── DEFENSA_ORAL_PRIMERA_ENTREGA.md     # Guía maestra y manual de defensa oral para la mesa docente
├── README.md                           # Documento principal del repositorio (este archivo)
├── index.html                          # Página 1: Inicio y presentación institucional
├── catalogo.html                       # Página 2: Catálogo con filtros, orden y buscador
├── cotizador.html                      # Página 3: Cotizador interactivo de joyas a medida
├── carrito.html                        # Página 4: Carrito de compras, tabla semántica y cupones
├── login.html                          # Página 5: Módulo de acceso y control de sesión
├── css/
│   └── styles.css                      # Hoja de estilos centralizada (5 secciones pedagógicas)
├── js/
│   └── main.js                         # Lógica JavaScript ES6+ (funciones flecha + JsDoc)
├── imagenes/                           # Directorio de recursos gráficos optimizados
│   ├── favicon.svg                     # Icono de pestaña del navegador
│   ├── joyas_anillo_esmeralda.jpg      # Fotografía de producto
│   ├── joyas_aros.jpg                  # Fotografía de producto
│   ├── joyas_collar.jpg                # Fotografía de producto
│   ├── joyas_hero.jpg                  # Imagen de portada principal
│   ├── joyas_pulsera.jpg               # Fotografía de producto
│   └── joyas_reloj.jpg                 # Fotografía de producto
├── primera-entrega/
│   └── Requerimientos.md               # Especificaciones y rúbrica oficial de la Primera Entrega
├── segunda-entrega/
│   └── Requerimientos.md               # Plan de requerimientos para la Segunda Entrega (React)
├── Sketch/
│   └── README.md                       # Documentación de bocetos iniciales en papel
└── Wireframe/
    └── README.md                       # Documentación de esquemas digitales y maquetas UX/UI
```

---

## Documentación y Defensa Oral

Para preparar la instancia de evaluación oral y coloquio de la cátedra, se ha elaborado un documento integral de consulta técnica:

📖 **[Ver Documento de Defensa Oral: DEFENSA_ORAL_PRIMERA_ENTREGA.md](DEFENSA_ORAL_PRIMERA_ENTREGA.md)**

### Contenido de la Guía de Defensa Oral
1. **Resumen Ejecutivo:** Justificación de cada decisión técnica frente a las consignas de la cátedra.
2. **Separación de Capas:** Aislamiento estricto entre marcado (HTML), presentación (CSS) y comportamiento (JS).
3. **Análisis Código por Código:** Explicación pedagógica de funciones flecha, `localStorage`, JSDoc, validaciones, algoritmos de cálculo y ordenamiento de arrays.
4. **Arquitectura CSS:** Uso armónico de Flexbox y CSS Grid, cálculo de especificidad en cascada y ausencia deliberada de `!important`.
5. **Simulacro de Examen Oral:** Respuestas modelo a 12 preguntas frecuentes formuladas por la mesa docente.
6. **Cheat-Sheet de 5 Minutos:** Resumen rápido de repaso previo para Pedro Gatti y Joaquin Mármol.

---

## Criterios de Calidad y Cumplimiento de Rúbrica

El proyecto ha sido sometido a una verificación técnica automatizada garantizando el 100% de cumplimiento con las directivas docentes:

* [x] **Cero Estilos en Línea:** Ningún archivo HTML contiene el atributo prohibido `style=`.
* [x] **Cero Código Muerto / Comentado:** No existen bloques de código fuente comentados (`<!--`) en los documentos HTML.
* [x] **Cero Abuso de `!important`:** La hoja de estilos `css/styles.css` respeta naturalmente la cascada y la especificidad CSS.
* [x] **Documentación JsDoc Total:** Todas las funciones de `js/main.js` cuentan con anotaciones estándar `@method`, `@param` y `@return`.
* [x] **Sintaxis JavaScript Válida:** Verificado exitosamente mediante `node --check js/main.js`.
* [x] **Navegación Relativa Consistente:** Enlaces cruzados operativos entre las 5 páginas sin enlaces rotos ni dependencias absolutas locales.
* [x] **Persistencia de Datos:** Sincronización íntegra de carrito y sesión mediante la API nativa `localStorage`.
* [x] **Accesibilidad Web (a11y):** Formatos semánticos, contrastes de color legibles y soporte para navegación accesible.