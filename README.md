# Laure Joyas - Proyecto Integrador 2026

Repositorio oficial para el desarrollo del proyecto integrador de la cátedra **Taller de Desarrollo Web** (Segundo Año, Semestre 2), carrera de Ingeniería Informática de la [Universidad Católica de Córdoba](https://ucc.edu.ar).

---

## 📑 Índice de Contenidos
1. [Título del Proyecto](#título-del-proyecto)
2. [Descripción General](#descripción-general)
3. [Autores e Información de Contacto](#autores-e-información-de-contacto)
4. [Sitio Web en Vivo (GitHub Pages)](#sitio-web-en-vivo-github-pages)
5. [Contenido y Funcionalidades del Sitio](#contenido-y-funcionalidades-del-sitio)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Estructura del Repositorio](#estructura-del-repositorio)

---

## Título del Proyecto
### **Laure Joyas - E-Commerce de Joyería Fina & Cotizador Personalizado**

---

## Descripción General
**Laure Joyas** es una plataforma web desarrollada para una marca de joyería contemporánea y accesorios de lujo. El sitio web ofrece una vitrina visual elegante para exhibir anillos, collares, aros y pulseras, acompañada de un cotizador interactivo que permite calcular presupuestos estimativos según el tipo de metal (oro, plata, platino), quilates, peso y opciones de grabado personalizado.

---

## Autores e Información de Contacto
### Integrantes del Equipo

| Nombre | Apellido | Legajo | Correo Institucional | Perfil de GitHub |
| :--- | :--- | :--- | :--- | :--- |
| Pedro | **Gatti** | 2519717 | [2519717@ucc.edu.ar](mailto:2519717@ucc.edu.ar) | [@PedroGattiUCC](https://github.com/PedroGattiUCC) |
| Joaquin | **Mármol** | 2514908 | [2514908@ucc.edu.ar](mailto:2514908@ucc.edu.ar) | [@Gu4co](https://github.com/Gu4co) |

* **Universidad:** Universidad Católica de Córdoba (UCC)
* **Facultad:** Facultad de Ingeniería
* **Materia:** Taller de Desarrollo Web

---

## Sitio Web en Vivo (GitHub Pages)
El proyecto se encuentra desplegado de forma pública y accesible en:
🌐 **[Ver sitio en GitHub Pages](https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/)**

---

## Contenido y Funcionalidades del Sitio
### Características Principales de la Primera Entrega
* **Estructura Semántica Estricta:** Implementación de etiquetas HTML5 estándares (`header`, `nav`, `main`, `section`, `article`, `footer`).
* **Diseño Visual & Estilos CSS:** Diseño adaptable (Desktop y Mobile) con paleta de colores curada, tipografía Google Fonts e interactividad visual mediante pseudoclases.
* **Cotizador Interactivo en JavaScript:**
  * Validación de datos de entrada con alertas y limpieza automática ante valores inválidos.
  * Cálculo dinámico de costos de joyas según material, peso y personalización.
  * Funciones flecha documentadas siguiendo el estándar **JsDoc** (`@method`, `@param`, `@return`).
* **Accesibilidad Web (a11y):** Formulario con etiquetas `<label for="...">` asociadas, atributos `alt` descriptivos en todas las imágenes y controles accesibles por teclado.
* **Prototipado:** Bocetos previos en papel y maquetas digitales organizadas en las carpetas `Sketch/` y `Wireframe/`.

---

## Tecnologías Utilizadas
### Primera Entrega
* **HTML5:** Marcado semántico y accesible.
* **CSS3:** Estilos personalizados, Flexbox, Grid y media queries para diseño responsivo.
* **JavaScript (ES6+):** Funciones flecha, validación en tiempo de ejecución y manipulación del DOM.
* **Google Fonts:** Tipografía web de alta fidelidad.
* **GitHub Pages:** Despliegue continuo de la aplicación.

### Segunda Entrega (Próximamente)
* **React:** Librería frontend moderna inicializada con Vite.
* **React Router DOM:** Enrutamiento del lado del cliente con `<Outlet />`.
* **SASS (.scss):** Preprocesador de estilos modular con alias.
* **Mock Service & Storage:** Persistencia local (`localStorage`) y consumo simulado con `fetch` y `async/await`.

---

## Estructura del Repositorio
```text
proyecto2026-Gatti-Marmol/
├── .gitignore
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── imagenes/
├── Sketch/
├── Wireframe/
├── primera-entrega/
│   └── Requerimientos.md
└── segunda-entrega/
    └── Requerimientos.md
```