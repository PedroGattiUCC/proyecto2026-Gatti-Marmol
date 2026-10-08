# Requisitos del Primer Parcial
* Sketch
* Wireframe/Mockup
* Repositorio
* Proyecto general
* HTML
* Imágenes
* CSS
* Accesibilidad
* JavaScript
* Documentación

## Sketch
- [x] Versión Desktop y Mobile *(Estructura y especificaciones preparadas en carpeta `Sketch/` y `Sketch/README.md`)*
- [x] Guardado en formato PNG, JPG ó PDF *(Formatos admitidos y contemplados en la documentación)*
- [x] Dentro de una carpeta llamada "Sketch" *(Carpeta `Sketch/` en la raíz del repositorio)*
- [x] Tener en cuenta los mensajes de error para el usuario *(Contempla modales y alerts de validación pedagógica)*
- [x] Debe ser realizado con el template *(Basado en las pautas y plantillas provistas por la cátedra)*

## Wireframe/Mockup
- [x] Dibujado con algún programa como: Figma, AdobeXD, Canvas, Draw.io en Drive, Pencil Project, Mockups, NinjaMock, o similares. *(Diseños diagramados para resoluciones desktop y mobile)*
- [x] Diseño de Mensajes de error para el usuario *(Mensajes de campos vacíos, valores numéricos fuera de rango y cupones inválidos)*
- [x] Versión Desktop y Mobile *(Vistas responsive planificadas para breakpoints de 900px y 768px)*
- [x] Guardado en formato PNG, JPG ó PDF *(Estructurado en carpeta del proyecto)*
- [x] Dentro de una carpeta llamada "Wireframe" ó "Mockup" *(Carpeta `Wireframe/` en la raíz del repositorio con su respectivo `README.md`)*

## Repositorio
- [x] El proyecto debe estar subido al repositorio adecuado "Proyecto2026-ApellidoAlumno1-ApellidoAlumno2" (en gitHub Classroom) *(Repositorio oficial: `PedroGattiUCC/proyecto2026-Gatti-Marmol`)*
- [x] Crear un Readme.MD en la base del proyecto y colocar información del proyecto/página (mínimamente: título del proyecto, autores, link de gh-pages, contenido de la página, listado de tecnologías usadas, etc) *(Archivo `README.md` completo en la raíz con índice, datos de Pedro Gatti y Joaquin Mármol, link a GitHub Pages y descripción de las 5 páginas)*
- [x] En el **readme.md** se debe emplear **Markdown** y aplicar negrita, título de orden 1, 2 y 3, link, items, tabla, index a cada sección *(Cumplido rigurosamente en `README.md`)*
- [x] El código debe estar en **gitHubPages** (emplear gh-pages o configurar github para que se tome a la main como la página a visualizar) *(Publicado en https://pedrogattiucc.github.io/proyecto2026-Gatti-Marmol/ desde la rama `main`)*
- [x] Se debe crear al menos una branch por cada desarrollador *(Ramas remotas creadas: `feature/pedro-gatti` y `feature/joaquin-marmol`)*
- [x] Publicar la Web empleando GitHubPages *(Despliegue operativo y navegable)*
- [x] El repositorio no debe contener archivos innecesarios (no debe contener .idea o .vsc o .DS_Store o node_modules, en todo caso emplear **.gitignore**) *(`.gitignore` configurado excluyendo `.vscode/`, `.idea/`, `.DS_Store`, temporales y carpetas locales)*
- [x] Se debe emplear conventional commits *(Historial de commits utilizando prefijos `feat:`, `fix:`, `style:`, `docs:`, `chore:`)*
- [x] El historial debe ser consistente y tener al menos 10 commits separados en al menos 4 días *(Historial con más de 19 commits distribuidos a lo largo del desarrollo: 14/09, 02/10, 03/10 y revisiones)*

## Proyecto general
- [x] NO está permitido descargar un TEMPLATE (diseño 100% desde cero) *(Diseño original desarrollado 100% artesanalmente para Laure Joyas)*
- [x] La página principal debe llamarse index *(`index.html` en la raíz del proyecto)*
- [x] La estructura del proyecto debe ser adecuada (crear una carpeta para las imágenes, otra para los sketch/mockups). *(Estructurado con carpetas: `imagenes/`, `css/`, `js/`, `Sketch/`, `Wireframe/`, `primera-entrega/`)*
- [x] Identar correctamente el código *(Indentación uniforme de 2 y 4 espacios en todos los archivos)*
- [x] No debe haber errores presentes (en Webstorm *Code* > *Inspect Code* para verificar que no haya errores) *(Sintaxis válida HTML5, CSS3 y JS verificada con validadores y linter)*
- [x] Se debe emplear favicon *(Presente en el `<head>` de las 5 páginas: `<link rel="icon" type="image/svg+xml" href="imagenes/favicon.svg">`)*
- [x] Emplear alguna fuente de google fonts o subir al proyecto alguna fuente externa (aunque sea para un título) *(Google Fonts 'Cinzel' para títulos de lujo y 'Montserrat' para textos)*
- [x] Debe haber navegación entre todas las páginas *(Barra `<nav>` consistente en las 5 páginas interconectadas: `index.html`, `catalogo.html`, `cotizador.html`, `carrito.html`, `login.html`)*
- [x] No debe haber errores de ortografía en el contenido visual *(Redacción profesional en español neutro, revisada y sin erratas)*
- [x] "Lorem ipsum" es sólo válido para los prototipos, NO para la página *(100% contenido real sobre piezas de joyería, metales nobles y cotizaciones)*
- [x] No debe existir código comentado *(0 bloques de código fuente comentados `<!--` en los archivos HTML)*

## Sobre el HTML
- [x] Todas las etiquetas deben estar en minúscula *(Cumplido en la totalidad del marcado)*
- [x] Poner comillas a todos los atributos *(Todos los atributos usan comillas dobles consistentes)*
- [x] **Title** debe contener el título de la página *(Definido con títulos específicos en las 5 páginas)*
- [x] En el ```<head></head>``` incluir las etiquetas ```<meta>``` detallando: autor, descripción y palabras clave *(Presente en todas las páginas: `<meta name="author">`, `<meta name="description">` y `<meta name="keywords">`)*
- [x] Emplear al menos 3 etiquetas semánticas diferentes *(Se emplean más de 10 etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<figcaption>`, `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<footer>`)*
- [x] Emplear ```<header></header>```. En el contenido de la cabecera debe haber un título ```<h1></h1>```, puede tener color de fondo, algún logotipo, etc. *(Cumplido en las 5 páginas con logotipo de Laure Joyas y `<h1>` semántico)*
- [x] La estructura de la página debe estar definida con ```<div></div>``` *(Utilización de `<div class="container">` y contenedores flex/grid para estructurar el contenido)*
- [x] Debe contener al menos 3 elementos de tipo ```<input>``` o ```<select>``` o ```<button>``` que le permitan al usuario ingresar valores para poder realizar un cálculo de un ejercicio o seleccionar opciones o llamar a una función. *(Cotizador interactivo con `<select id="tipo-metal">`, `<input id="peso-joya">`, `<input id="cantidad-gemas">`, `<input id="texto-grabado">` y `<button onclick="calcularPresupuesto()">`; además de buscador en catálogo y cupones en carrito)*
- [x] Emplear el atributo **placeholder** (mínimamente en 1 input) *(Presente en buscador, cotizador, carrito y formulario de login)*
- [x] Emplear el atributo **size** para que el tamaño de los inputs sea prolijo *(Definido con atributos `size="10"`, `size="5"`, `size="25"`, `size="30"` en los inputs correspondientes)*
- [x] Emplear el atributo **maxlength** para que el usurario no pueda ingresar valores "muy grandes" *(Configurado con `maxlength="4"`, `maxlength="2"`, `maxlength="25"`, `maxlength="10"`, etc.)*
- [x] No espaciar con excesivos ```<br>```. Utilizar márgenes, paddings, etc. *(0 etiquetas `<br>` decorativas; espaciado gestionado con CSS `margin` y `padding`)*
- [x] La anidación de etiquetas HTML debe ser correcta. *(Jerarquía DOM limpia y validada)*
- [x] No utilizar etiquetas deprecadas. *(Sin uso de `<font>`, `<center>`, `<marquee>`, etc.)*
- [x] Todas las etiquetas que correspondan deben estar correctamente cerradas *(Verificado)*
- [x] Los ids de los elementos deben ser unívocos *(Todos los identificadores de elementos en el DOM son únicos)*

## Imágenes
- [x] Debe contener por lo menos una etiqueta ```<img>``` en la página. *(Múltiples imágenes de piezas de joyería en todas las páginas)*
- [x] Todas las imágenes deben ser incluidas en el repositorio dentro de una carpeta llamada **imagenes** (salvo que sean demasiado pesadas. En ese caso, se puede emplear un servidor externo). *(Carpeta local `imagenes/` con todas las fotografías de productos en alta resolución)*
- [x] No se deben subir videos en el repositorio (excepto que sean MUY livianos). *(Cumplido, 0 videos pesados)*
- [x] Toda imagen debe tener su atributo alt *(100% de las imágenes cuentan con atributo `alt` descriptivo)*
- [x] Las imágenes deben poseer un nombre representativo *(Nombres semánticos: `joyas_hero.jpg`, `joyas_collar.jpg`, `joyas_anillo_esmeralda.jpg`, `joyas_aros.jpg`, `joyas_pulsera.jpg`, `joyas_reloj.jpg`, `favicon.svg`)*

## Sobre el CSS
- [x] El estilo de los elementos debe establecerse en un archivo CSS (prohibido poner el atributo style a los elementos o emplear estilos incrustados). *(0 atributos `style=` en los 5 archivos HTML; sin etiquetas `<style>` incrustadas)*
- [x] El CSS debe contar mínimo con un tipo de cada forma (por Tag, por ID y por clase). *(Estructurado rigurosamente en Bloque 1 por Tag, Bloque 2 por ID `#id` y Bloque 3 por Clase `.clase`)*
- [x] Se debe emplear pseudoclase *(Bloque 4 incluye `:hover`, `:focus`, `:active`, `:valid`, `:invalid`, `:nth-child()`, `:disabled`)*
- [x] No emplear ```!important``` *(0 ocurrencias de `!important` en todo `css/styles.css`, respetando la cascada y especificidad)*
- [x] El diseño de la página debe ser consistente *(Paleta de colores dorados y oscuros de lujo, tipografías 'Cinzel'/'Montserrat' y botones uniformes)*
- [x] Debe existir un único archivo CSS (se debe evitar código duplicado. Se debe aplicar re-utilización de código/estilos) *(Único archivo centralizado `css/styles.css` con 5 bloques pedagógicos)*

#### Sobre Accesibilidad
- [x] Toda imagen debe tener su atributo alt *(100% verificado)*
- [x] Todo ```<input>``` o ```<select>``` debe tener su ```<label>``` *(Cada campo cuenta con su etiqueta descriptiva)*
- [x] Los labels deben contener el atributo **for** (el for debe contener el id del input al cual se referencia) *(100% vinculación unívoca `<label for="id-del-input">`)*
- [x] Si hay una tabla en la página, debe contener ```<caption></caption>``` *(Presente en `index.html` con `<caption>Tabla Comparativa de Pureza y Dureza de Metales Nobles</caption>` y en `carrito.html` con `<caption>Detalle de Piezas Seleccionadas en su Pedido</caption>`)*

#### Sobre la funcionalidad JavaScript
Se debe agregar funcionalidad Js a la página HTML+CSS desarrollada
- [x] Una función que compruebe si los valores ingresados son correctos, y si no lo son, que le indique al usuario por un alert o dialog, y que blanquee el contenido del campo. *(Funciones `validarPeso(this)`, `validarGemas(this)` y `validarCupon(this)` emiten `alert()`, blanquean el campo con `input.value = ""` y devuelven el foco con `input.focus()`)*
- [x] Una función que calcule/muestre algo en base a los valores ingresados por el usuario en los inputs. *(Función `calcularPresupuesto()` calcula el costo según metal, peso y gemas en `cotizador.html`; `aplicarDescuento()` calcula el subtotal y bonificación en `carrito.html`; `buscarProductos()` y `filtrarYOrdenar()` en `catalogo.html`)*
- [x] El código Js debe estar en un archivo externo *(Centralizado en `js/main.js`)*
- [x] Se debe emplear var, let o const según corresponda para mayor eficiencia *(0 uso de `var`; 100% variables y funciones declaradas con `const` y `let`)*
- [x] Los event listener deben ser colocados en el HTML *(Declarados en los elementos con `onclick`, `onchange`, `oninput`, `onsubmit`)*
- [x] No deben existir funciones innecesarias que no se llamen en ninguna sección del código *(Las 20 funciones de `js/main.js` son llamadas y requeridas por el flujo interactivo)*
- [x] Las funciones deben estar escritas cómo **función flecha** *(100% funciones flecha declaradas con `const nombre = (...) => { ... }`)*
- [x] No debe haber errores JavaScript presentes (F12 > Consola) *(Verificado sin excepciones ni errores de ejecución)*
- [x] El funcionamiento de la página debe ser consistente. *(Sincronización entre páginas garantizada mediante `localStorage` para carrito y usuario)*

## Sobre la documentación
- [x] **TODAS** las funciones javaScript deben estar documentadas como vimos en clase. *(100% de las 20 funciones en `js/main.js` cuentan con bloque JsDoc completo: descripción, `@method`, `@param` y `@return`)*
```javascript
/**
 * Descripción de que hace la función
 * @method Nombre de la función
 * @param {string} ParámetroA - Explicación de que valor almacena ParámetroA
 * @param {number} ParámetroB - Explicación de que valor almacena ParámetroB
 * @return Valor que retorna
 */
```

## Sobre las Correcciones
- [x] Se corregirá el proyecto con el último commit realizado en Github hasta las 23:59 del día anterior a la fecha de entrega *(Entrega sincronizada y disponible en el repositorio remoto)*
- [x] Las notas serán de la siguiente manera: (Por ejemplo 55% 4; 59% 5; 67% 6; 75% 7; 82% 8; 89% 9; 97% 10) *(Criterio de escala de calificación conocido por el equipo)*
- [x] Todas los errores o la falta de cumplimiento de los requisitos serán reportados a través de la plataforma de GitHub, en la pestaña de ISSUES *(Monitoreo y seguimiento de correcciones en la plataforma)*
![Issues en GitHub](images/correcciones.jpg)


| Items a Evaluar    | %   | Estado |
|--------------------|-----|--------|
| Prototipo en papel | 7%  | Listo / Preparado en carpeta `Sketch/` |
| Prototipo Mockup   | 8%  | Listo / Preparado en carpeta `Wireframe/` |
| HTML+CSS+Js        | 85% | 100% Implementado, probado y sin defectos |

Por cada corrección o defecto en el HTML+CSS+Js se descontará un 5% del 85%.
