#!/usr/bin/env python3
"""Genera SVG editables y PNG de los prototipos, sin red ni paquetes nuevos.

Ejecutar desde cualquier carpeta: python3 primera-entrega/Wireframe/generar_prototipos.py
Requiere Python, Pillow e ImageMagick con librsvg, disponibles en el entorno de trabajo.
No modifica los diagramas ni las exportaciones históricos.
"""
from pathlib import Path
from html import escape
import subprocess
import shutil
import xml.etree.ElementTree as ET
from PIL import Image, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def resolve_font(preferred, fallback):
    """Resuelve familia y archivo locales sin asumir rutas de una distribución."""
    if shutil.which('fc-match'):
        result = subprocess.check_output(['fc-match', '-f', '%{family[0]}\n%{file}\n', preferred], text=True).splitlines()
        if len(result) >= 2 and Path(result[1]).is_file():
            return result[0], result[1]
    font = ImageFont.truetype(fallback, 16)
    return font.getname()[0], str(font.path)


FONTS = {'sketch': resolve_font('Lato', 'DejaVuSans.ttf'),
         'mockup': resolve_font('Montserrat', 'DejaVuSans.ttf'),
         'heading': resolve_font('Liberation Serif', 'DejaVuSerif.ttf')}
PAGES = [('inicio', 'Inicio'), ('catalogo', 'Catálogo'), ('cotizador', 'Cotizador'),
         ('contacto', 'Contacto'), ('carrito', 'Carrito'), ('acceso', 'Acceso'),
         ('crear-cuenta', 'Crear cuenta'), ('validaciones', 'Estados y validación')]
PRODUCTS = [
    ('Solitario Imperial', 'Oro Amarillo 18k', '$ 850.000 ARS', 'anillo'),
    ('Colgante Luminance', 'Platino 950', '$ 1.250.000 ARS', 'collar'),
    ('Aros Royal Brilliance', 'Oro Blanco 18k', '$ 620.000 ARS', 'aros'),
    ('Brazalete Étoile', 'Oro Amarillo 18k', '$ 980.000 ARS', 'pulsera'),
    ('Anillo Sublime Emerald', 'Platino 950', '$ 1.450.000 ARS', 'esmeralda'),
    ('Cronógrafo Prestige', 'Oro Rosa 18k', '$ 2.100.000 ARS', 'reloj')]


class Canvas:
    def __init__(self, sketch, mobile, page, title):
        self.sketch, self.mobile, self.page = sketch, mobile, page
        self.w = 390 if mobile else 1440
        self.x = 24 if mobile else 96
        self.cw = self.w - self.x * 2
        self.font, self.fontpath = FONTS['sketch' if sketch else 'mockup']
        self.heading = self.font if sketch else FONTS['heading'][0]
        self.c = dict(bg='#ffffff', panel='#f8f8f8', image='#eeeeee', text='#181818',
                      muted='#505050', accent='#181818', border='#737373', button='#222222',
                      onbutton='#ffffff', danger='#303030', errorbg='#eeeeee', success='#303030') if sketch else dict(
                      bg='#0b0f12', panel='#161e27', image='#10171d', text='#edf0f3',
                      muted='#b0bac5', accent='#f5d77f', border='#354657', button='#f5d77f',
                      onbutton='#12181f', danger='#ffb1ac', errorbg='#352226', success='#aee2c4')
        self.parts = []
        self.title = title
        self.rect(0, 0, self.w, 44, fill='panel', stroke=False, radius=0)
        self.text(16 if mobile else 32, 27,
                  ('SKETCH DIGITAL' if sketch else 'MOCKUP DIGITAL') + '  /  ' + title.upper(),
                  11 if mobile else 13, 'muted', weight=600)
        self.header()

    def color(self, name):
        return self.c.get(name, name)

    def rect(self, x, y, w, h, fill='panel', stroke=True, radius=10, border='border'):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{2 if self.sketch else radius}" fill="{self.color(fill)}" stroke="{self.color(border) if stroke else "none"}" stroke-width="{1.4 if self.sketch else 1}"/>')

    def line(self, x1, y1, x2, y2, color='border', width=1):
        self.parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{self.color(color)}" stroke-width="{width}"/>')

    def text(self, x, y, text, size=16, color='text', weight=400, heading=False, anchor='start'):
        self.parts.append(f'<text x="{x}" y="{y}" font-family="{self.heading if heading else self.font}" font-size="{size}" font-weight="{weight}" fill="{self.color(color)}" text-anchor="{anchor}">{escape(str(text))}</text>')

    def para(self, x, y, text, width, size=16, color='muted', leading=None, weight=400):
        font = ImageFont.truetype(self.fontpath, size)
        leading = leading or round(size * 1.55)
        words, lines, current = text.split(), [], ''
        for word in words:
            test = current + (' ' if current else '') + word
            if font.getlength(test) > width and current:
                lines.append(current)
                current = word
            else:
                current = test
        if current:
            lines.append(current)
        for i, line in enumerate(lines):
            self.text(x, y + i * leading, line, size, color, weight)
        return y + len(lines) * leading

    def button(self, x, y, w, label, secondary=False, small=False):
        h = 40 if small else 48
        self.rect(x, y, w, h, fill='panel' if secondary else 'button', border='border' if secondary else 'button', radius=6)
        self.text(x + w / 2, y + h / 2 + 5, label, 13 if small else (14 if self.mobile else 15),
                  'text' if secondary else 'onbutton', 600, anchor='middle')
        return y + h

    def field(self, x, y, w, label, value, helptext=None, select=False, error=False):
        self.text(x, y, label, 14 if self.mobile else 16, 'text', 600)
        self.rect(x, y + 13, w, 48, fill='bg', border='danger' if error else 'border', radius=6)
        self.text(x + 14, y + 43, value, 14 if self.mobile else 16, 'muted')
        if select:
            self.text(x + w - 22, y + 42, '⌄', 18, 'accent', anchor='middle')
        bottom = y + 61
        if helptext:
            bottom = self.para(x, y + 83, helptext, w, 12 if self.mobile else 13, 'danger' if error else 'muted', leading=19)
        return bottom + 25

    def header(self):
        if self.mobile:
            self.text(24, 85, 'LAURE JOYAS', 25, 'accent', 700, heading=True)
            links = [('inicio', 'Inicio'), ('catalogo', 'Catálogo'), ('cotizador', 'Cotizador'),
                     ('contacto', 'Contacto'), ('carrito', 'Carrito (2)'), ('acceso', 'Acceso')]
            for i, (key, label) in enumerate(links):
                x, y = 24 + (i % 3) * 114, 125 + (i // 3) * 39
                active = key == self.page or (key == 'acceso' and self.page == 'crear-cuenta')
                self.text(x + 3, y, label, 13, 'accent' if active else 'muted', 600 if active else 400)
                if active:
                    self.line(x, y + 10, x + 90, y + 10, 'accent', 2)
            self.line(0, 190, self.w, 190)
            self.start = 234
        else:
            self.text(64, 99, 'LAURE JOYAS', 30, 'accent', 700, heading=True)
            links = [('inicio', 'Inicio'), ('catalogo', 'Catálogo'), ('cotizador', 'Cotizador'),
                     ('contacto', 'Contacto'), ('carrito', 'Carrito (2)'), ('acceso', 'Acceso')]
            for i, (key, label) in enumerate(links):
                x = 614 + i * 126
                active = key == self.page or (key == 'acceso' and self.page == 'crear-cuenta')
                self.text(x, 97, label, 15, 'accent' if active else 'muted', 600 if active else 400)
                if active:
                    self.line(x, 109, x + 90, 109, 'accent', 2)
            self.line(0, 132, self.w, 132)
            self.start = 192

    def section_title(self, y, title, description=None):
        if self.mobile:
            y = self.para(self.x, y, title, self.cw, 27, 'accent', leading=35, weight=600)
        else:
            self.text(self.x, y, title, 38, 'accent', 700, heading=True)
            y += 33
        if description:
            y = self.para(self.x, y + 5, description, self.cw, 15 if self.mobile else 17)
        return y + 24

    def artwork(self, x, y, w, h, kind, label=None):
        self.rect(x, y, w, h, 'image', False, 0)
        if self.sketch:
            self.line(x + 14, y + 14, x + w - 14, y + h - 14, 'border')
            self.line(x + w - 14, y + 14, x + 14, y + h - 14, 'border')
            self.rect(x + 20, y + h / 2 - 19, w - 40, 40, 'bg', False)
            self.text(x + w / 2, y + h / 2 + 6, label or 'Imagen de la pieza', 13, anchor='middle')
            return
        cx, cy, s = x + w / 2, y + h / 2, min(w, h) / 240
        gold, pale = self.c['accent'], '#e8edf1'
        self.parts.append(f'<g transform="translate({cx},{cy}) scale({s})" fill="none" stroke="{gold}" stroke-width="3">')
        if kind in ('anillo', 'esmeralda', 'hero'):
            self.parts.append('<ellipse cx="0" cy="20" rx="57" ry="64"/><ellipse cx="0" cy="20" rx="46" ry="55" stroke-width="1"/>')
            if kind == 'esmeralda':
                self.parts.append('<path d="M-20,-55 L20,-55 L29,-43 L29,-18 L18,-8 L-18,-8 L-29,-18 L-29,-43Z" fill="#215c4c"/><path d="M-12,-47 L12,-47 L20,-37 L20,-24 L12,-17 L-12,-17 L-20,-24 L-20,-37Z" stroke-width="1"/>')
            else:
                self.parts.append(f'<path d="M-30,-40 L-18,-58 L18,-58 L30,-40 L0,-8Z" fill="{pale}" stroke="{pale}"/><path d="M-30,-40 L30,-40 M-18,-58 L0,-8 L18,-58 M-10,-40 L0,-58 L10,-40" stroke="#6c8393" stroke-width="1"/>')
        elif kind == 'collar':
            self.parts.append('<path d="M-72,-80 Q-70,28 0,53 Q70,28 72,-80"/><path d="M-67,-80 Q-64,23 0,48 Q64,23 67,-80" stroke-width="1"/><path d="M0,48 L22,69 L0,96 L-22,69Z" fill="#d8e5ee" stroke="#d8e5ee"/>')
        elif kind == 'aros':
            self.parts.append('<ellipse cx="-44" cy="13" rx="26" ry="56"/><ellipse cx="44" cy="13" rx="26" ry="56"/><circle cx="-44" cy="-50" r="10" fill="#e8edf1"/><circle cx="44" cy="-50" r="10" fill="#e8edf1"/>')
        elif kind == 'pulsera':
            self.parts.append('<ellipse cx="0" cy="0" rx="85" ry="47"/><ellipse cx="0" cy="5" rx="85" ry="47"/><ellipse cx="0" cy="-3" rx="76" ry="36" stroke-width="1"/>')
        elif kind == 'reloj':
            self.parts.append('<rect x="-23" y="-104" width="46" height="208" rx="6" fill="#806248"/><circle r="56" fill="#14202a"/><circle r="48" stroke-width="1"/><path d="M0,-34 L0,0 L25,18"/><circle r="4" fill="#f5d77f"/><path d="M0,-45V-39 M45,0H39 M0,45V39 M-45,0H-39"/>')
        self.parts.append('</g>')
        if label:
            self.text(x + 16, y + h - 15, label, 11, 'muted')

    def product(self, x, y, w, product):
        name, metal, price, kind = product
        h = 346
        self.rect(x, y, w, h)
        self.artwork(x + 1, y + 1, w - 2, 166, kind, 'Fotografía de producto' if self.sketch else None)
        self.text(x + 20, y + 194, metal.upper(), 11, 'muted', 600)
        self.text(x + 20, y + 226, name, 18 if self.mobile else 20, 'accent', 600, heading=not self.mobile)
        self.text(x + 20, y + 260, price, 18, 'text', 600)
        self.button(x + 20, y + 281, w - 40, 'Agregá al Carrito')
        return y + h

    def tariffs(self, y):
        y = self.section_title(y, 'Tarifas de referencia')
        self.para(self.x, y, 'Valores por gramo de metal precioso · ARS', self.cw, 13)
        y += 36
        if self.mobile:
            for metal, purity, price in [('Oro 18k', '750 · Pulido / satinado', '$ 95.000 / g'),
                                         ('Plata 925', '925 · Envejecido / rodinado', '$ 12.000 / g'),
                                         ('Platino 950', '950 · Brillo de alta durabilidad', '$ 110.000 / g')]:
                self.rect(self.x, y, self.cw, 105)
                self.text(self.x + 16, y + 27, metal, 16, 'accent', 600)
                self.text(self.x + 16, y + 51, purity, 12, 'muted')
                self.text(self.x + 16, y + 81, price, 17, weight=600)
                y += 117
        else:
            widths = [self.x + 24, self.x + 360, self.x + 640, self.x + 925]
            self.rect(self.x, y, self.cw, 202)
            for x, text in zip(widths, ['Metal precioso', 'Pureza / Ley', 'Valor por gramo', 'Acabado disponible']):
                self.text(x, y + 33, text, 15, 'accent', 600)
            for i, row in enumerate([('Oro 18k', '18 quilates (750)', '$ 95.000 ARS', 'Pulido o satinado'),
                                     ('Plata 925', '925 milésimas', '$ 12.000 ARS', 'Envejecido o rodinado'),
                                     ('Platino 950', '950 milésimas', '$ 110.000 ARS', 'Brillo de alta durabilidad')]):
                yy = y + 53 + i * 49
                self.line(self.x, yy, self.x + self.cw, yy)
                for x, text in zip(widths, row):
                    self.text(x, yy + 32, text, 15)
            y += 218
        return y

    def footer(self, y):
        y += 54
        height = 233 if self.mobile else 170
        self.rect(0, y, self.w, height, 'panel', False, 0)
        self.line(0, y, self.w, y)
        self.text(self.x, y + 43, 'LAURE JOYAS', 22, 'accent', 700, heading=True)
        yy = self.para(self.x, y + 76, 'Obispo Trejo 323 · Córdoba, Argentina', self.cw, 12)
        yy = self.para(self.x, yy + 8, 'Proyecto académico · Taller de Desarrollo Web · UCC 2026', self.cw, 12)
        self.para(self.x, yy + 8, 'Pedro Gatti · Joaquin Mármol', self.cw, 12)
        self.h = y + height

    def save(self, folder, name):
        path = folder / (name + '.svg')
        kind = 'Boceto digital monocromo de baja fidelidad' if self.sketch else 'Mockup digital vectorial de Laure Joyas'
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" role="img" aria-labelledby="title desc"><title id="title">{escape(self.title)}</title><desc id="desc">{kind}. Versión {"móvil de 390" if self.mobile else "escritorio de 1440"} píxeles. Prototipo de diseño, no captura de la web. Elementos y texto editables.</desc><rect width="{self.w}" height="{self.h}" fill="{self.c["bg"]}"/>' + ''.join(self.parts) + '</svg>'
        path.write_text(svg, encoding='utf-8')
        ET.parse(path)
        subprocess.run(['magick', '-background', self.c['bg'], str(path), '-strip', str(path.with_suffix('.png'))], check=True)
        with Image.open(path.with_suffix('.png')) as image:
            assert image.size == (self.w, self.h), (path, image.size)


def inicio(c):
    x, w, y = c.x, c.cw, c.start
    if c.mobile:
        y = c.section_title(y, 'Piezas eternas forjadas a mano')
        y = c.para(x, y, 'Arte orfebre tradicional y gemas de pureza inigualable. Cada joya cuenta una historia única.', w, 15)
        y = c.button(x, y + 8, w, 'Explorá el Catálogo')
        y = c.button(x, y + 12, w, 'Cotizá a Medida', True)
        c.artwork(x, y + 24, w, 270, 'hero', 'Colección de anillos y colgantes')
        y += 350
    else:
        c.rect(x, y - 12, w, 390)
        c.text(x + 36, y + 34, 'ALTA JOYERÍA · ORFEBRERÍA FINA', 13, 'muted', 600)
        c.text(x + 36, y + 103, 'Piezas eternas', 48, 'accent', 700, heading=True)
        c.text(x + 36, y + 160, 'forjadas a mano', 48, 'accent', 700, heading=True)
        c.para(x + 36, y + 208, 'Arte orfebre tradicional y gemas de pureza inigualable. Cada joya cuenta una historia única.', 520, 17)
        c.button(x + 36, y + 298, 245, 'Explorá el Catálogo')
        c.button(x + 295, y + 298, 245, 'Cotizá a Medida', True)
        c.artwork(x + 666, y - 11, w - 667, 388, 'hero', 'Colección de anillos y colgantes')
        y += 452
    y = c.section_title(y, 'Obras maestras destacadas', 'Una selección de nuestras piezas en metales nobles.')
    if c.mobile:
        for p in PRODUCTS[:3]:
            y = c.product(x, y, w, p) + 22
    else:
        pw = (w - 48) / 3
        for i, p in enumerate(PRODUCTS[:3]):
            c.product(x + i * (pw + 24), y, pw, p)
        y += 410
    y = c.tariffs(y + 20)
    c.rect(x, y + 26, w, 220 if c.mobile else 190)
    c.text(x + 22, y + 64, '¿Querés una pieza a medida?', 20 if c.mobile else 28, 'accent', 600, heading=not c.mobile)
    yy = c.para(x + 22, y + 99, 'Elegí metal, peso, gemas y grabado para estimar tu joya personalizada.', w - 44, 14 if c.mobile else 16)
    c.button(x + 22, yy + 12, w - 44 if c.mobile else 310, 'Cotizá tu Joya Personalizada')
    c.footer(y + (246 if c.mobile else 216))


def catalogo(c):
    x, w = c.x, c.cw
    y = c.section_title(c.start, 'Catálogo de piezas exclusivas', 'Explorá nuestra colección de metales nobles y piedras preciosas.')
    if c.mobile:
        y = c.field(x, y, w, 'Buscar joya o metal', 'Ej: Anillo, Platino, Diamante…')
        y = c.field(x, y, w, 'Filtrá por categoría', 'Todas', select=True)
        y = c.field(x, y, w, 'Ordená por', 'Defecto', select=True)
    else:
        fw = (w - 48) / 3
        c.rect(x - 1, y - 27, w + 2, 127)
        for i, (label, val) in enumerate([('Buscar joya o metal', 'Ej: Anillo, Platino, Diamante…'),
                                        ('Filtrá por categoría', 'Todas'), ('Ordená por', 'Defecto')]):
            c.field(x + 20 + i * (fw + 24), y, fw - 40, label, val, select=i > 0)
        y += 130
    c.text(x, y, '6 piezas', 14, 'muted')
    y += 25
    if c.mobile:
        for p in PRODUCTS:
            y = c.product(x, y, w, p) + 22
    else:
        pw = (w - 48) / 3
        for i, p in enumerate(PRODUCTS):
            c.product(x + (i % 3) * (pw + 24), y + (i // 3) * 370, pw, p)
        y += 730
    c.footer(y)


def cotizador(c):
    x, w = c.x, c.cw
    y = c.section_title(c.start, 'Cotizador interactivo de joyas', 'Calculá un presupuesto estimativo según los materiales de tu pieza.')
    fw = w - 40 if c.mobile else 566
    fx = x + 20 if c.mobile else x + 28
    c.rect(x, y - 8, w if c.mobile else 622, 686)
    c.text(fx, y + 26, 'Personalizá tu pieza', 22, 'accent', 600)
    fy = c.field(fx, y + 66, fw, 'Metal precioso', 'Oro 18k ($ 95.000/g)', select=True)
    fy = c.field(fx, fy, fw, 'Peso aproximado (gramos)', '10', 'Entre 1 y 500 gramos.')
    fy = c.field(fx, fy, fw, 'Cantidad de gemas', '2', 'Número entero entre 0 y 30.')
    fy = c.field(fx, fy, fw, 'Grabado personalizado (opcional)', 'Laure 2026', 'Máximo 25 caracteres.')
    c.button(fx, fy, fw, 'Calculá tu Presupuesto')
    c.button(fx, fy + 60, fw, 'Restablecé', True)
    ry = y + 710 if c.mobile else y - 8
    rx, rw = (x, w) if c.mobile else (x + 658, w - 658)
    c.rect(rx, ry, rw, 375)
    c.text(rx + 24, ry + 39, 'Presupuesto estimativo', 21, 'accent', 600)
    for i, (label, val) in enumerate([('Oro 18k · 10 g', '$ 950.000'), ('2 gemas engarzadas', '$ 50.000'), ('Grabado: Laure 2026', '$ 5.000')]):
        yy = ry + 84 + i * 48
        c.text(rx + 24, yy, label, 12 if c.mobile else 15, 'muted')
        c.text(rx + rw - 24, yy, val, 13 if c.mobile else 16, anchor='end')
    c.line(rx + 24, ry + 211, rx + rw - 24, ry + 211)
    c.text(rx + 24, ry + 240, 'TOTAL ESTIMADO · ARS', 11, 'muted', 600)
    c.text(rx + 24, ry + 279, '$ 1.005.000', 31, 'accent', 600)
    c.button(rx + 24, ry + 304, rw - 48, 'Agregá tu Joya al Carrito')
    c.para(rx, ry + 403, 'Estimación de referencia. El importe depende del metal, peso, gemas y grabado elegidos.', rw, 13)
    y = c.tariffs((ry + 520) if c.mobile else (y + 758))
    c.footer(y)


def contacto(c):
    x, w = c.x, c.cw
    y = c.section_title(c.start, 'Contacto', 'Conocé la ubicación y los datos del equipo de este proyecto académico.')
    gap, cw = 28, w if c.mobile else (w - 28) / 2
    c.rect(x, y, cw, 249)
    c.text(x + 24, y + 42, 'Ubicación de referencia', 20 if c.mobile else 25, 'accent', 600)
    yy = c.para(x + 24, y + 88, 'Obispo Trejo 323', cw - 48, 18, 'text', weight=600)
    yy = c.para(x + 24, yy + 10, 'Córdoba, Argentina', cw - 48, 16)
    c.para(x + 24, yy + 22, 'Alta Joyería y Orfebrería Fina · Laure Joyas', cw - 48, 14)
    rx, ry = (x, y + 277) if c.mobile else (x + cw + gap, y)
    c.rect(rx, ry, cw, 346)
    c.text(rx + 24, ry + 42, 'Equipo académico', 20 if c.mobile else 25, 'accent', 600)
    c.text(rx + 24, ry + 86, 'Pedro Gatti', 17, weight=600)
    c.text(rx + 24, ry + 117, '2519717@ucc.edu.ar', 14, 'accent')
    c.line(rx + 24, ry + 147, rx + cw - 24, ry + 147)
    c.text(rx + 24, ry + 183, 'Joaquin Mármol', 17, weight=600)
    c.text(rx + 24, ry + 214, '2514908@ucc.edu.ar', 14, 'accent')
    c.para(rx + 24, ry + 259, 'Los correos abren tu aplicación de email. Proyecto de Taller de Desarrollo Web · UCC 2026.', cw - 48, 13)
    yy = ry + 391
    c.rect(x, yy, w, 180 if c.mobile else 137)
    c.text(x + 22, yy + 35, 'Sobre este sitio', 20, 'accent', 600)
    c.para(x + 22, yy + 68, 'Laure Joyas es una demostración académica. Estos datos identifican a los autores del proyecto.', w - 44, 14 if c.mobile else 16)
    c.footer(yy + (180 if c.mobile else 137))


def carrito(c):
    x, w = c.x, c.cw
    y = c.section_title(c.start, 'Tu carrito de joyas', 'Revisá las piezas, ajustá las cantidades y aplicá tu cupón.')
    c.text(x, y, 'Detalle de piezas seleccionadas', 14, 'muted', 600)
    y += 25
    if c.mobile:
        for p in PRODUCTS[:2]:
            c.rect(x, y, w, 220)
            c.text(x + 18, y + 32, p[0], 17, 'accent', 600)
            c.text(x + 18, y + 60, p[1], 13, 'muted')
            c.text(x + 18, y + 89, 'Precio unitario: ' + p[2], 13)
            c.text(x + 18, y + 128, 'Cantidad', 13, weight=600)
            c.rect(x + 99, y + 103, 73, 38, 'bg', radius=4)
            c.text(x + 113, y + 128, '1   ↕', 15)
            c.text(x + w - 18, y + 128, 'Eliminar', 13, 'danger', anchor='end')
            c.line(x + 18, y + 158, x + w - 18, y + 158)
            c.text(x + 18, y + 191, 'Subtotal', 13, 'muted')
            c.text(x + w - 18, y + 191, p[2], 16, 'text', 600, anchor='end')
            y += 240
    else:
        c.rect(x, y, w, 243)
        cols = [x + 24, x + 340, x + 568, x + 786, x + 936, x + 1150]
        for xx, label in zip(cols, ['Producto', 'Metal precioso', 'Precio unitario', 'Cantidad', 'Subtotal', 'Acción']):
            c.text(xx, y + 32, label, 14, 'accent', 600)
        for i, p in enumerate(PRODUCTS[:2]):
            yy = y + 53 + i * 95
            c.line(x, yy, x + w, yy)
            for xx, value in zip(cols, [p[0], p[1], p[2], '', p[2], 'Eliminar']):
                c.text(xx, yy + 51, value, 14, 'danger' if value == 'Eliminar' else 'text')
            c.rect(cols[3], yy + 22, 76, 47, 'bg', radius=4)
            c.text(cols[3] + 17, yy + 51, '1   ↕', 16)
        y += 290
    rx, rw = (x, w) if c.mobile else (x + w - 570, 570)
    c.rect(rx, y, rw, 449)
    c.text(rx + 24, y + 41, 'Resumen del pedido', 22, 'accent', 600)
    c.field(rx + 24, y + 82, rw - 146, '¿Tenés un cupón?', 'LAURE10')
    c.button(rx + rw - 110, y + 95, 86, 'Aplicá', True)
    c.para(rx + 24, y + 178, 'Cupón LAURE10 aplicado: 10% de descuento.', rw - 48, 12, 'success')
    c.line(rx + 24, y + 219, rx + rw - 24, y + 219)
    for i, (label, value) in enumerate([('Subtotal', '$ 2.100.000'), ('Descuento · 10%', '− $ 210.000')]):
        c.text(rx + 24, y + 253 + i * 40, label, 13 if c.mobile else 15, 'muted')
        c.text(rx + rw - 24, y + 253 + i * 40, value, 14 if c.mobile else 16, anchor='end')
    c.line(rx + 24, y + 318, rx + rw - 24, y + 318)
    c.text(rx + 24, y + 350, 'Total final · ARS', 13, 'muted')
    c.text(rx + 24, y + 398, '$ 1.890.000', 35, 'accent', 600)
    y += 475
    if c.mobile:
        y = c.button(x, y, w, 'Confirmá tu Compra')
        y = c.button(x, y + 12, w, 'Vaciá el Carrito', True)
        y = c.button(x, y + 12, w, 'Seguí Comprando', True)
    else:
        c.button(x, y, 260, 'Vaciá el Carrito', True)
        c.button(x + 285, y, 260, 'Seguí Comprando', True)
        c.button(x + w - 570, y, 570, 'Confirmá tu Compra')
        y += 48
    c.footer(y)


def acceso(c):
    x, w = (c.x, c.cw) if c.mobile else (420, 600)
    y = c.section_title(c.start, 'Acceso de clientes', 'Ingresá con tu cuenta para gestionar tus pedidos.')
    c.rect(x, y, w, 521 if c.mobile else 500)
    xx, ww, yy = x + 24, w - 48, y + 43
    yy = c.field(xx, yy, ww, 'Correo electrónico', 'ejemplo@correo.com')
    yy = c.field(xx, yy, ww, 'Contraseña', '••••••••', 'La contraseña de tu cuenta registrada.')
    yy = c.button(xx, yy, ww, 'Iniciá Sesión')
    c.text(xx, yy + 45, '¿Todavía no tenés cuenta?', 14, 'muted')
    yy = c.button(xx, yy + 67, ww, 'Creá tu cuenta', True)
    c.para(xx, yy + 37, 'Demostración académica. Usá una cuenta creada en este navegador.', ww, 13)
    c.footer(y + (521 if c.mobile else 500))


def registro(c):
    x, w = (c.x, c.cw) if c.mobile else (392, 656)
    y = c.section_title(c.start, 'Creá tu cuenta', 'Registrate para iniciar sesión en esta demostración académica.')
    c.rect(x, y, w, 807 if c.mobile else 790)
    xx, ww, yy = x + 24, w - 48, y + 44
    yy = c.field(xx, yy, ww, 'Nombre completo', 'Ej: Ana García', '2–60 caracteres: letras, espacios, guion o apóstrofo.')
    yy = c.field(xx, yy, ww, 'Correo electrónico', 'ejemplo@correo.com', 'Máximo 80 caracteres.')
    yy = c.field(xx, yy, ww, 'Contraseña', '••••••••', 'Entre 8 y 128 caracteres. Usá una clave de prueba.')
    yy = c.field(xx, yy, ww, 'Confirmá la contraseña', '••••••••', 'Ingresá nuevamente la misma contraseña.')
    yy = c.button(xx, yy, ww, 'Creá tu cuenta')
    yy = c.para(xx, yy + 35, '¿Ya tenés cuenta? Iniciá sesión', ww, 14, 'accent')
    c.para(xx, yy + 22, 'Cuenta de demostración almacenada en este navegador. No uses datos sensibles ni una clave de otro servicio.', ww, 13)
    c.footer(y + (807 if c.mobile else 790))


def validations(c):
    y = c.section_title(c.start, 'Estados y validación', 'Variantes de las pantallas. Los mensajes se acompañan de texto y acciones claras.')
    cards = [
        ('01 · COTIZADOR', 'Peso fuera de rango', 'Peso aproximado (gramos)', 'Ingresá un peso válido',
         'Ingresá un peso entre 1 y 500 gramos.', 'Alert: campo vacío y foco en peso.', 'Aceptar'),
        ('02 · COTIZADOR', 'Gemas inválidas', 'Cantidad de gemas', 'Ingresá una cantidad entera',
         'La cantidad de gemas debe ser un número entero entre 0 y 30.', 'Alert: campo vacío y foco en gemas.', 'Aceptar'),
        ('03 · CARRITO', 'Cupón inválido', '¿Tenés un cupón?', 'Probá: LAURE10',
         'El cupón ingresado no es válido o ha expirado.', 'Campo vacío, foco y total sin descuento.', 'Aplicá'),
        ('04 · ACCESO', 'Datos inválidos', 'Correo electrónico', 'ejemplo@correo.com',
         'Ingresá un correo válido o revisá las credenciales de tu cuenta.', 'Panel de error + alert. Corregí el campo.', 'Iniciá Sesión'),
        ('05 · CREAR CUENTA', 'Contraseñas diferentes', 'Confirmá la contraseña', 'Repetí tu contraseña',
         'Las contraseñas no coinciden. Volvé a ingresarla.', 'Panel de error + alert. Foco en confirmación.', 'Creá tu cuenta'),
        ('06 · CREAR CUENTA', 'Correo ya registrado', 'Correo electrónico', 'ejemplo@correo.com',
         'Este correo ya tiene una cuenta en este navegador.', 'Revisá el correo o iniciá sesión.', 'Ir a Acceso')]
    if c.mobile:
        cardw, ch, cols = c.cw, 395, 1
    else:
        cardw, ch, cols = (c.cw - 48) / 3, 401, 3
    for i, (context, title, label, value, error, note, action) in enumerate(cards):
        xx = c.x + (i % cols) * (cardw + 24)
        yy = y + (i // cols) * (ch + 24)
        c.rect(xx, yy, cardw, ch)
        c.text(xx + 20, yy + 30, context, 11, 'muted', 600)
        c.text(xx + 20, yy + 68, title, 18, 'accent', 600)
        c.field(xx + 20, yy + 111, cardw - 40, label, value, error=True)
        c.rect(xx + 20, yy + 191, cardw - 40, 99, 'errorbg', border='danger', radius=6)
        c.text(xx + 32, yy + 215, 'Error', 12, 'danger', 700)
        c.para(xx + 32, yy + 239, error, cardw - 64, 12, 'danger', leading=18)
        c.para(xx + 20, yy + 313, note, cardw - 40, 11, leading=17)
        c.button(xx + 20, yy + ch - 54, cardw - 40, action, small=True)
    y += ((len(cards) + cols - 1) // cols) * (ch + 24) + 28
    extra = [
        ('07 · CARRITO VACÍO', 'Tu carrito está vacío', 'Agregá productos desde el catálogo antes de confirmar una compra o aplicar un cupón.', 'Explorá el Catálogo'),
        ('08 · CONFIRMAR VACIADO', '¿Querés vaciar tu carrito?', 'Se quitarán todos los artículos del carrito. Elegí Cancelar para conservarlos.', 'Cancelar     /     Aceptar'),
        ('09 · CUENTA CREADA', 'Tu cuenta fue creada', 'Registro local completado. Ahora podés iniciar sesión con el correo y la contraseña elegidos.', 'Ir a Acceso'),
        ('10 · SESIÓN ACTIVA', 'Hola, Ana', 'Ana García · ana@ejemplo.com. La sesión de demostración está activa en este navegador.', 'Salir')]
    for i, (context, title, message, action) in enumerate(extra):
        cols2 = 1 if c.mobile else 2
        ew = c.cw if c.mobile else (c.cw - 24) / 2
        eh = 284 if c.mobile else 241
        xx, yy = c.x + (i % cols2) * (ew + 24), y + (i // cols2) * (eh + 24)
        c.rect(xx, yy, ew, eh)
        c.text(xx + 20, yy + 29, context, 11, 'muted', 600)
        c.text(xx + 20, yy + 67, title, 19, 'accent', 600)
        c.para(xx + 20, yy + 102, message, ew - 40, 13, leading=21)
        if i == 1:
            bw = (ew - 52) / 2
            c.button(xx + 20, yy + eh - 67, bw, 'Cancelar', secondary=True)
            c.button(xx + 32 + bw, yy + eh - 67, bw, 'Aceptar')
        else:
            c.button(xx + 20, yy + eh - 67, ew - 40, action)
    c.footer(y + (4 * 308 if c.mobile else 2 * 265))


RENDER = {'inicio': inicio, 'catalogo': catalogo, 'cotizador': cotizador, 'contacto': contacto,
          'carrito': carrito, 'acceso': acceso, 'crear-cuenta': registro, 'validaciones': validations}


def readme(folder, sketch):
    family = 'Sketch digital' if sketch else 'Wireframe / mockup digital'
    description = ('Bocetos digitales de baja fidelidad, monocromos y con marcadores para las fotografías.' if sketch else
                   'Mockups vectoriales con paleta oscura y dorada, tipografía Montserrat, jerarquía y contenido específicos de Laure Joyas.')
    text = f'''# {family} — Laure Joyas

{description} Se diseñaron siete pantallas completas en escritorio (1440 px de ancho) y móvil (390 px), además de sus estados de validación. Cada diseño tiene **SVG editable** y **PNG visible en GitHub**.

Son prototipos de interfaz, no capturas de la implementación. Las ilustraciones vectoriales del mockup representan el lugar de las fotografías de producto. El diseño móvil adapta los bloques a una columna; la navegación se distribuye en dos filas visibles.

**Template oficial:** se encontró la referencia de la cátedra en la [consigna UCC](https://ucc-tallerdesarrolloweb.github.io/filminas/Proyecto.html#/7) y se aplicó digitalmente a los sketches. Consultá las [láminas con template](../Sketch/con-plantilla/README.md) y las [referencias originales](../Sketch/plantillas/README.md).

**Alcance académico:** estos bocetos son digitales; no son dibujos hechos a mano ni en papel. El template oficial está aplicado en las láminas enlazadas, pero eso no acredita por sí solo el requisito de prototipo en papel. Esa evidencia debe incorporarse aparte si la cátedra la exige.

## Cobertura y fuentes editables

| Pantalla | Contenido diseñado | Escritorio | Móvil |
|---|---|---|---|
'''
    content = {
        'inicio': 'Hero, CTA de catálogo/cotizador, tres destacados y tarifas',
        'catalogo': 'Búsqueda, categoría, orden y las seis piezas con precio y acción',
        'cotizador': 'Metal, peso, gemas, grabado, cálculo desglosado y tarifas',
        'contacto': 'Dirección y correos académicos de los dos autores; sin formulario ficticio',
        'carrito': 'Dos piezas, cantidades, eliminar, cupón, descuento, total y acciones',
        'acceso': 'Correo, contraseña, iniciar sesión y enlace para crear cuenta',
        'crear-cuenta': 'Nombre, correo, contraseña, confirmación y condiciones de demo',
        'validaciones': 'Diez estados contextualizados de error, confirmación y éxito local'}
    for key, title in PAGES:
        text += f'| {title} | {content[key]} | [PNG](pantallas/{key}-desktop.png) · [SVG](pantallas/{key}-desktop.svg) | [PNG](pantallas/{key}-mobile.png) · [SVG](pantallas/{key}-mobile.svg) |\n'
    text += '''
## Reglas y estados representados

- **Cotizador:** peso entre 1 y 500 g; gemas enteras entre 0 y 30; grabado opcional de hasta 25 caracteres. Los errores usan alert, limpian el campo y devuelven el foco. Ejemplo calculado: oro 18k 10 g ($950.000) + 2 gemas ($50.000) + grabado ($5.000) = **$1.005.000 ARS**.
- **Carrito:** dos productos (1 unidad cada uno) suman $2.100.000; LAURE10 descuenta $210.000; total $1.890.000. Se incluyen cupón inválido, carrito vacío y confirmación antes de vaciar.
- **Cuenta:** nombre 2–60 (letras, espacios, guion o apóstrofo), correo válido de hasta 80 caracteres y contraseña 8–128 con confirmación. Se muestran credenciales inválidas, confirmación diferente, correo duplicado, cuenta creada e identificación de sesión activa. Mensajes de cuenta representativos del comportamiento de validación; no sustituyen una captura de cada mensaje de ejecución.
- **Contacto:** Obispo Trejo 323, Córdoba y enlaces de correo de los autores. No representa un envío ni una confirmación comercial.
- **Accesibilidad:** labels permanentes, ayuda bajo los campos, errores con texto además de color, botones de al menos 40–48 px y estados con acciones explícitas.

## Pantallas

Cada enlace de la tabla abre la imagen completa a resolución original. Los PNG siguientes se muestran sin herramientas externas.

'''
    for key, title in PAGES:
        text += f'### {title}\n\n**Escritorio**\n\n![{family}: {title}, escritorio](pantallas/{key}-desktop.png)\n\n**Móvil**\n\n![{family}: {title}, móvil](pantallas/{key}-mobile.png)\n\n'
    old = ('sketch_desarrollo_web.drawio', 'sketch') if sketch else ('wireframes_laure_joyas.drawio', 'wireframe')
    text += f'''## Antecedentes conservados

El archivo [{old[0]}]({old[0]}) y las exportaciones originales [{old[1]}_desktop.png]({old[1]}_desktop.png), [{old[1]}_mobile.png]({old[1]}_mobile.png) y [{old[1]}_mensajes_error.png]({old[1]}_mensajes_error.png) se conservan como antecedentes. **No son las fuentes de las nuevas pantallas** de `pantallas/` ni acreditan su cobertura.

## Edición y reproducción

Los SVG usan texto y formas vectoriales editables; pueden abrirse en un editor SVG. Los PNG se exportan directamente de esos SVG. Generador compartido: [generar_prototipos.py](../Wireframe/generar_prototipos.py).

```bash
python3 primera-entrega/Wireframe/generar_prototipos.py
```

Requiere Python 3, Pillow e ImageMagick con librsvg. Las fuentes se resuelven con `fc-match` (fontconfig): preferidas Montserrat/Lato/Liberation Serif; usa las alternativas del sistema si no están disponibles. Sin fontconfig, intenta DejaVu Sans/Serif mediante Pillow. No requiere rutas de fuentes de una distribución específica. No instala dependencias ni accede a la red. Estas herramientas son requisitos de regeneración de los artefactos, no dependencias del sitio web.

El comando regenera únicamente `Sketch/pantallas/`, `Wireframe/pantallas/` y sus README. Los SVG y PNG entregados se consultan sin ejecutar el script. Para regenerar las láminas con el template oficial después de cambiar los bocetos, ejecutar también [generar_con_plantilla.py](../Sketch/generar_con_plantilla.py).
'''
    (folder / 'README.md').write_text(text, encoding='utf-8')


if __name__ == '__main__':
    count = 0
    for sketch, dirname in [(True, 'Sketch'), (False, 'Wireframe')]:
        folder = ROOT / dirname
        out = folder / 'pantallas'
        out.mkdir(exist_ok=True)
        for key, title in PAGES:
            for mobile in [False, True]:
                device = 'mobile' if mobile else 'desktop'
                c = Canvas(sketch, mobile, key, title)
                RENDER[key](c)
                c.save(out, key + '-' + device)
                count += 1
        readme(folder, sketch)
    print(f'{count} SVG válidos y {count} PNG exportados; dimensiones verificadas.')
