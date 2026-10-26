#!/usr/bin/env python3
"""Aplica los JPG oficiales UCC a los sketches SVG, sin red ni dependencias nuevas.

Requiere los SVG de pantallas/, los JPG de plantillas/, Python/Pillow e
ImageMagick con librsvg. Mantiene intactos esos archivos de entrada.
Cada SVG de salida conserva texto/formas y embebe su template JPG original.
"""
from pathlib import Path
from html import escape
from fractions import Fraction
import base64
import hashlib
import math
import runpy
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'con-plantilla'
NS = '{http://www.w3.org/2000/svg}'
PAGES = [('inicio', 'Inicio'), ('catalogo', 'Catálogo'), ('cotizador', 'Cotizador'),
         ('contacto', 'Contacto'), ('carrito', 'Carrito'), ('acceso', 'Acceso'),
         ('crear-cuenta', 'Crear cuenta'), ('validaciones', 'Estados y validación')]
ET.register_namespace('', 'http://www.w3.org/2000/svg')


def num(value):
    return f'{float(value):.9f}'.rstrip('0').rstrip('.')


def text(x, y, label, size=13, center=False):
    return f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" fill="#222222" text-anchor="{"middle" if center else "start"}">{escape(label)}</text>'


def source(page, device):
    path = ROOT / 'pantallas' / f'{page}-{device}.svg'
    tree = ET.parse(path).getroot()
    body = ''.join(ET.tostring(child, encoding='unicode') for child in tree
                   if child.tag not in (NS + 'title', NS + 'desc'))
    return int(tree.attrib['width']), int(tree.attrib['height']), body


def compose(page, title, device, sheet, total, template, encoded, source_width, source_height, body, boxes, span):
    mobile = device == 'mobile'
    w, imageh, fullh = (899, 557, 655) if mobile else (884, 552, 660)
    top = 64
    name = f'{page}-{device}-{sheet + 1:02d}'
    device_label = 'Móvil · tres tramos de la misma pantalla' if mobile else 'Escritorio · viewport de navegador'
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * 2}" height="{fullh * 2}" viewBox="0 0 {w} {fullh}" role="img" aria-labelledby="title desc">',
             f'<title id="title">{escape(title)} · {device_label} · lámina {sheet + 1} de {total}</title>',
             '<desc id="desc">Sketch digital sobre template oficial UCC. Texto y formas editables; JPG de referencia incrustado sin modificar. Los tramos consecutivos muestran una sola pantalla al recorrerla verticalmente. No realizado en papel.</desc>',
             f'<rect width="{w}" height="{fullh}" fill="#ffffff"/>',
             text(20, 27, f'{title} · {"Móvil" if mobile else "Escritorio"} · lámina {sheet + 1}/{total}', 19),
             text(20, 49, 'Sketch digital · template oficial UCC · lectura de izquierda a derecha' if mobile else 'Sketch digital · template oficial UCC · continuación vertical de la pantalla', 12),
             f'<image href="data:image/jpeg;base64,{encoded}" x="0" y="{top}" width="{w}" height="{imageh}"/>']
    records = []
    for slot, (x, y, width, height) in enumerate(boxes):
        index = sheet * len(boxes) + slot
        start = index * span
        end = min(Fraction(source_height), start + span)
        clip = f'clip-{page}-{device}-{sheet}-{slot}'
        y += top
        parts.append(f'<defs><clipPath id="{clip}"><rect x="{x}" y="{y}" width="{width}" height="{height}"/></clipPath></defs>')
        parts.append(f'<g clip-path="url(#{clip})"><rect x="{x}" y="{y}" width="{width}" height="{height}" fill="#ffffff"/>')
        if start < source_height:
            scale = Fraction(width, source_width)
            parts.append(f'<g transform="translate({x},{y}) scale({num(scale)}) translate(0,-{num(start)})">{body}</g>')
            records.append({'sheet': sheet + 1, 'slot': slot + 1, 'start': num(start), 'end': num(end)})
            label = f'Tramo {index + 1} · scroll {round(start)}–{round(end)} px'
            used_height = (end - start) * scale
            if end == source_height and used_height < height - 25:
                parts.append(text(x + width / 2, num(y + used_height + 19), 'Fin de pantalla', 10, True))
        else:
            label = 'Sin otro tramo · fin de pantalla'
            parts.append(text(x + width / 2, y + height / 2, 'Fin de pantalla', 12, True))
        parts.append('</g>')
        parts.append(text(x + width / 2, 638 if mobile else 641, label, 11, True))
    parts.append('</svg>')
    svg = OUTPUT / (name + '.svg')
    svg.write_text(''.join(parts), encoding='utf-8')
    ET.parse(svg)
    subprocess.run(['magick', '-background', 'white', str(svg), '-strip', str(svg.with_suffix('.png'))], check=True)
    with Image.open(svg.with_suffix('.png')) as image:
        assert image.size == (w * 2, fullh * 2)
    return name, records


def docs(manifest):
    intro = '''# Sketches en el template oficial UCC

Se aplica digitalmente el [template oficial de la consigna UCC](https://ucc-tallerdesarrolloweb.github.io/filminas/Proyecto.html#/7) a las siete pantallas y los estados de validación de Laure Joyas. Las [referencias JPG originales y sus fuentes](../plantillas/README.md) se conservan sin cambios. Consulta: **26/10/2026**.

**Son composiciones digitales; no dibujos hechos a mano ni en papel.** Los archivos editables contienen el JPG del marco incrustado y el contenido como texto y formas vectoriales. Los PNG se exportan al doble de resolución del template para facilitar la lectura. Las [vistas completas sin marco](../README.md#pantallas) se conservan para revisar cada pantalla de corrido.

## Cómo leer las láminas

- **Escritorio:** cada navegador muestra un viewport; las láminas numeradas continúan verticalmente hasta el pie de página.
- **Móvil:** los tres teléfonos muestran tramos consecutivos de **la misma pantalla**, de izquierda a derecha. Si hay más de tres tramos, siguen en otra lámina de esa misma pantalla. No se mezclan páginas dentro de una lámina.
- Bajo cada marco se indica el número de tramo y su rango de scroll. El último tramo termina donde acaba el diseño; los marcos restantes se identifican como “Fin de pantalla”.
- Las láminas de **Estados y validación** recorren el documento de variantes: peso, gemas, cupón, acceso, confirmación de contraseña, correo duplicado, carrito vacío, vaciado, cuenta creada y sesión activa.

## Índice de pantallas y láminas

| Pantalla | Escritorio | Móvil |
|---|---|---|
'''
    for page, title in PAGES:
        cells = []
        for device in ['desktop', 'mobile']:
            names = manifest[page][device]['files']
            cells.append('<br>'.join(f'{i + 1}: [PNG]({name}.png) · [SVG]({name}.svg)' for i, name in enumerate(names)))
        intro += f'| {title} | {cells[0]} | {cells[1]} |\n'
    intro += '\n## Previsualizaciones PNG\n\nTodas las láminas siguientes también pueden abrirse desde los enlaces de la tabla a tamaño completo.\n\n'
    for page, title in PAGES:
        intro += f'### {title}\n\n'
        for device, label in [('desktop', 'Escritorio'), ('mobile', 'Móvil')]:
            for i, name in enumerate(manifest[page][device]['files']):
                intro += f'**{label} · lámina {i + 1}**\n\n![Sketch digital en template UCC: {title}, {label}, lámina {i + 1}]({name}.png)\n\n'
    intro += '''## Regeneración y edición

```bash
python3 primera-entrega/Sketch/generar_con_plantilla.py
```

Requiere Python 3, Pillow e ImageMagick con librsvg y los archivos locales de `pantallas/` y `plantillas/`. No instala herramientas ni utiliza red. Si cambian los diseños completos, ejecutar primero el [generador de pantallas](../../Wireframe/generar_prototipos.py). Las herramientas de regeneración no son dependencias de la web.

El JPG de referencia está embebido en cada SVG, y el texto y las formas se pueden editar en un editor vectorial. Los originales `.drawio` permanecen como antecedentes y no son fuentes de estas nuevas láminas. [cobertura.json](cobertura.json) registra los tramos y las huellas SHA-256 de las referencias utilizadas.
'''
    (OUTPUT / 'README.md').write_text(intro, encoding='utf-8')


def main():
    import json
    OUTPUT.mkdir(exist_ok=True)
    # Márgenes interiores de 1 px preservan los bordes del JPG oficial.
    settings = {
        'desktop': ('GTP_sketchDesktop.jpg', [(5, 48, 872, 504)]),
        'mobile': ('GTP_sketchMovil.jpg', [(43, 68, 230, 414), (332, 68, 230, 414), (625, 68, 230, 414)])}
    manifest = {}
    hashes = {}
    count = 0
    for page, title in PAGES:
        manifest[page] = {}
        for device, (filename, boxes) in settings.items():
            template = ROOT / 'plantillas' / filename
            raw = template.read_bytes()
            hashes[filename] = hashlib.sha256(raw).hexdigest()
            encoded = base64.b64encode(raw).decode('ascii')
            width, height, body = source(page, device)
            span = Fraction(boxes[0][3] * width, boxes[0][2])
            pieces = math.ceil(Fraction(height) / span)
            sheets = math.ceil(Fraction(pieces, len(boxes)))
            entry = {'width': width, 'height': height, 'span': num(span), 'files': [], 'segments': []}
            for sheet in range(sheets):
                name, records = compose(page, title, device, sheet, sheets, template, encoded, width, height, body, boxes, span)
                entry['files'].append(name)
                entry['segments'].extend(records)
                count += 1
            assert Fraction(entry['segments'][0]['start']) == 0
            assert float(entry['segments'][-1]['end']) == height
            for before, after in zip(entry['segments'], entry['segments'][1:]):
                assert before['end'] == after['start'], (page, device, before, after)
            manifest[page][device] = entry
    data = {'consulted': '2026-10-26', 'templates_sha256': hashes, 'screens': manifest}
    (OUTPUT / 'cobertura.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    docs(manifest)
    # Mantener los README principales reproducibles sin volver a exportar pantallas.
    shared = runpy.run_path(str(ROOT.parent / 'Wireframe' / 'generar_prototipos.py'))
    shared['readme'](ROOT, True)
    shared['readme'](ROOT.parent / 'Wireframe', False)
    print(f'{count} láminas SVG + {count} PNG; cobertura secuencial verificada para 8 pantallas × 2 dispositivos.')


if __name__ == '__main__':
    main()
