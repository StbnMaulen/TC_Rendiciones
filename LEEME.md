# Mis Boletas — PWA

## Archivos

```
index.html              La app completa
manifest.webmanifest    Nombre, íconos, colores de instalación
sw.js                   Service worker (cache offline)
icons/                  Íconos en todos los tamaños
```

Los cuatro deben quedar en la **misma carpeta** y servirse por **HTTPS**. Sin HTTPS, Android no ofrece instalar y el service worker no se registra.

## Publicar con GitHub Pages (gratis)

1. Crea un repositorio nuevo en github.com (puede ser privado; Pages funciona igual en cuentas Pro, o hazlo público si tu cuenta es gratuita).
2. Sube los archivos respetando la estructura de carpetas (`icons/` adentro).
3. Ve a **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. Espera 1–2 minutos. Tu URL será:
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

Alternativas igual de simples: arrastrar la carpeta a **netlify.com/drop**, o usar **Cloudflare Pages**.

## Instalar en el teléfono

**Android (Chrome)** — abre la URL, ve a la pestaña *Exportar* y toca **Instalar Mis Boletas**. Si no aparece el botón, usa el menú ⋮ → *Añadir a pantalla de inicio*.

**iPhone (Safari)** — abre la URL en Safari (no funciona en Chrome iOS), toca **Compartir** y luego **Añadir a pantalla de inicio**. iOS no permite instalación automática.

## Publicar una actualización

1. Edita `index.html`.
2. **Sube el número de versión en `sw.js`** (línea 3): `mb-v1` → `mb-v2`.
3. Sube los archivos.

Sin el paso 2 los usuarios seguirán viendo la versión antigua desde el cache. Al abrir la app aparecerá una barra verde "Hay una versión nueva disponible".

## Sobre los datos

Cada usuario guarda sus gastos en el `localStorage` de **su propio dispositivo**. Nada viaja a un servidor. Consecuencias:

- Los datos no se sincronizan entre teléfonos.
- Borrar los datos del navegador borra los gastos.
- El respaldo JSON es la única copia de seguridad: conviene descargarlo después de cada rendición.
- El espacio típico ronda los 5–10 MB, y las fotos son lo que más pesa. La app ya las comprime, pero si aparece un aviso de falta de espacio, descarga el respaldo y borra las boletas antiguas.

Si en algún momento quieren que varios empleados vean los mismos datos, eso ya requiere un backend y deja de ser una app puramente local.
