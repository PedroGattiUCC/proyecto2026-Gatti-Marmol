# Correcciones de los issues

Revisión del 26 de octubre de 2026, basada en `origin/main` (`8447753`).

| Issue | Corrección local | Evidencia |
| --- | --- | --- |
| [#1](https://github.com/PedroGattiUCC/proyecto2026-Gatti-Marmol/issues/1) | HTML, CSS, JavaScript, imágenes y prototipos reunidos en `primera-entrega/`. | El README raíz documenta la estructura. Las entradas raíz `index.html` y `404.html` mantienen la publicación en GitHub Pages. |
| [#3](https://github.com/PedroGattiUCC/proyecto2026-Gatti-Marmol/issues/3) | Pantallas de Inicio, Catálogo, Cotizador, Contacto, Carrito, Acceso y Crear cuenta para escritorio y móvil; estados de validación. | [Sketch](Sketch/README.md) y [Wireframe](Wireframe/README.md), fuentes SVG editables y exportaciones PNG. Incluye láminas paginadas sobre los templates oficiales. |
| [#4](https://github.com/PedroGattiUCC/proyecto2026-Gatti-Marmol/issues/4) | Estilos definidos en la única hoja CSS; estados controlados con `hidden`. | Sin atributos `style`, etiquetas `<style>` en HTML ni asignaciones `.style` en JavaScript. |
| [#5](https://github.com/PedroGattiUCC/proyecto2026-Gatti-Marmol/issues/5) | Registro local enlazado desde Acceso; el login comprueba una cuenta previamente creada. | Validaciones, duplicados y confirmación; hash PBKDF2 salado, sesión persistente y cierre de sesión. Demostración local, sin backend. |
| [#6](https://github.com/PedroGattiUCC/proyecto2026-Gatti-Marmol/issues/6) | Inicialización y acciones declaradas en los HTML. | `body onload` y plantillas HTML para navegación y filas del carrito; sin `addEventListener` ni handlers generados desde JavaScript. |

## Verificación realizada

- Sintaxis de JavaScript con `node --check`.
- Auditoría de rutas locales, IDs únicos, imágenes con `alt`, etiquetas de campos y separación de estilos/eventos.
- Chromium: las ocho vistas en anchos de 1440 y 390 píxeles, sin desbordamiento horizontal de página ni errores JavaScript.
- Catálogo: búsqueda sin resultados, restablecimiento y agregado de productos.
- Carrito: dos Solitarios Imperial con cupón `LAURE10`, total esperado de $1.530.000.
- Cotizador: oro 18k de 10 g, dos gemas y grabado, total esperado de $1.005.000; incorporación al carrito y rechazo de peso fuera de rango. Las gemas rechazan valores fraccionarios o fuera de rango; su notación numérica se interpreta igual al validar y calcular.
- Registro/acceso: cuenta persistida sin contraseña plana; correo duplicado sin distinguir mayúsculas; confirmación diferente; clave incorrecta; acceso correcto; sesión tras recargar y salida.
- Recuperación de cuentas corruptas y manejo de almacenamiento bloqueado/lleno sin comunicar éxito falso; restablecimiento conserva el carrito.

El proyecto es estático y no tiene un proceso de build ni dependencias de aplicación que instalar. Las pruebas de navegador usaron el runtime de Playwright disponible en el entorno; no se agregaron paquetes al proyecto.

- Prototipos: 63 pares SVG/PNG, XML y enlaces válidos; templates JPG oficiales conservados sin cambios y revisión visual de escritorio, móvil y láminas paginadas.

## Alcance y fuentes

Se localizaron los templates oficiales en la presentación de la cátedra y se aplicaron a las láminas de Sketch. Los nuevos bocetos son digitales y no se presentan como trabajo en papel. Las fuentes y las diferencias entre versiones de la consigna están documentadas en [Consignas](../CONSIGNAS.md). Se retiraron las autoevaluaciones que afirmaban cumplimiento total sin evidencia; la consigna conserva su texto original.

Las correcciones se prepararon localmente. Este informe no acredita su publicación en GitHub Pages ni el cierre de los issues remotos.
