# Mis Boletas — PWA

App local para registrar boletas de gastos, clasificarlas por cliente y proyecto, y generar el
PDF de la rendición. Todo queda en el teléfono: **no hay servidor y no se envía nada a internet**.

## Archivos

```
index.html              La app completa (interfaz + lógica)
manifest.webmanifest    Nombre, íconos y colores de instalación
sw.js                   Service worker (cache offline)
icons/                  Íconos en todos los tamaños
fonts/                  Tipografías (Chakra Petch y Share Tech Mono)
```

Todo debe quedar en la **misma carpeta**, respetando la estructura, y servirse por **HTTPS**. Sin
HTTPS, Android no ofrece instalar y el service worker no se registra.

## Publicar con GitHub Pages (gratis)

1. Crea un repositorio nuevo en github.com (puede ser privado; Pages funciona igual en cuentas Pro,
   o hazlo público si tu cuenta es gratuita).
2. Sube los archivos respetando la estructura de carpetas (`icons/` adentro).
3. Ve a **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`. Guarda.
5. Espera 1–2 minutos. Tu URL será:
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

Alternativas igual de simples: arrastrar la carpeta a **netlify.com/drop**, o usar
**Cloudflare Pages**.

## Instalar en el teléfono

**Android (Chrome)** — abre la URL, ve a la pestaña *Exportar* y toca **Instalar Mis Boletas**.
Si no aparece el botón, usa el menú ⋮ → *Añadir a pantalla de inicio*.

**iPhone (Safari)** — abre la URL en Safari (no funciona en Chrome iOS), toca **Compartir** y luego
**Añadir a pantalla de inicio**. iOS no permite instalación automática.

## Cómo se usa

1. Escribe tu nombre arriba (queda guardado).
2. En **Registrar**, escribe el cliente y el proyecto — la primera vez los creas escribiéndolos, y
   desde ahí quedan como sugerencia. Agrega monto, descripción y la foto de la boleta.
3. Para viajes en vehículo propio elige la categoría *Vehículo particular (Km)*: la app calcula el
   reembolso por kilómetro con los valores que define la empresa.
4. En **Resumen** filtras por fecha, cliente, proyecto o estado.
5. En **Exportar** generas el PDF. Después de guardarlo, la app te pregunta si marca esas boletas
   como rendidas.

Los clientes, proyectos y categorías se corrigen o borran en **Exportar → Configuración**.
Renombrar arregla el nombre en todos los gastos que ya lo usan.

## Publicar una actualización

1. Edita `index.html`.
2. Sube `APP_VERSION` en `index.html` y la constante `VERSION` en `sw.js` — deben coincidir.
3. Sube los archivos.

`index.html` se sirve *red primero*, así que la versión nueva llega igual sin tocar `sw.js`. Subir
la versión sirve para dos cosas: refrescar los íconos y el manifest cacheados, y mostrar la barra
verde **"Hay una versión nueva disponible"**. La app **no** se recarga sola: espera a que el usuario
toque ACTUALIZAR, para no interrumpir un gasto a medio escribir.

## Sobre los datos

Cada usuario guarda sus gastos en **su propio teléfono**. Nada viaja a un servidor. Consecuencias:

- Los datos no se sincronizan entre teléfonos.
- Borrar los datos del navegador borra los gastos.
- El respaldo JSON es la única copia de seguridad: conviene descargarlo después de cada rendición.

**Dónde se guarda qué.** Los datos del gasto (fecha, monto, cliente, y una miniatura de la foto) van
a `localStorage`, que tiene un tope duro de ~5 MB. Las **fotos completas** van a IndexedDB, que
dispone de cientos de MB o más. Por eso la app aguanta cientos de boletas con foto. En *Exportar*
hay un indicador del espacio usado; si se pone en amarillo, descarga el respaldo y borra boletas
antiguas. Si alguna vez no se puede guardar, la app **deshace el cambio y te avisa con un aviso
bloqueante**: nunca te va a mostrar como guardado algo que no lo está.

### Qué es el respaldo JSON (y qué no es)

Es tu **copia de seguridad personal**, con las fotos incluidas. Sirve para pasar tus datos a un
teléfono nuevo o recuperarlos si se borran.

**Restaurar un respaldo reemplaza todo** lo que haya en ese teléfono: gastos, fotos, cajas,
vehículos y listas. No suma ni mezcla. Por eso **no** sirve para que un supervisor consolide varios
empleados: si restaura el archivo de uno y después el de otro, el primero se pierde. Lo que se
entrega para rendir es el **PDF** de cada persona.

Si en algún momento se necesita que un supervisor vea los datos de todo el equipo en un solo lugar,
eso requiere un backend y deja de ser una app puramente local.

## Política de kilometraje

El precio de la bencina, el porcentaje de desgaste y los rendimientos por tipo de vehículo están
**fijos en el código** (`DEF.configKm` en `index.html`) y se muestran en solo lectura: el empleado no
puede alterar el valor de su propio reembolso. Para cambiarlos, edita esos valores, sube
`configKm.version` y publica la actualización; los teléfonos la toman al abrir la app.

Cada gasto de kilometraje guarda los valores que estaban vigentes cuando se registró
(`precioPromedioUsado`, `desgastePct`, `rendimiento`), así una rendición vieja sigue siendo
auditable aunque la política haya cambiado.

## Tipografías

El look de consola lo dan **Chakra Petch** (títulos, montos, botones y campos) y **Share Tech Mono**
(etiquetas y datos técnicos). Van dentro del repo, en `fonts/`, en vez de pedirlas a Google:

- **Privacidad:** cargarlas desde un CDN le informa a un tercero la IP y el user-agent de cada
  empleado cada vez que abre la app. Alojadas acá, no sale ninguna petición del teléfono.
- **Offline:** están en la lista de precarga del service worker, así que el primer arranque sin
  señal ya se ve bien.
- **Peso:** 4 archivos woff2 del subset latin, 43 KB en total. El subset latin cubre todo el
  español (á é í ó ú ñ ü ¿ ¡), por eso no se incluyen los subsets thai, vietnamita ni latin-ext que
  Google sirve por defecto.

El texto de párrafo usa la fuente del sistema a propósito: se lee mejor en pantallas chicas y no
suma bytes.

Ambas familias están bajo **SIL Open Font License 1.1** — ver `fonts/OFL.txt`. Si algún día se
cambian, hay que actualizar los `@font-face` al inicio del `<style>` de `index.html` **y** la lista
`SHELL_FILES` de `sw.js`.

## Privacidad

La app no carga ningún recurso de terceros y una cabecera `Content-Security-Policy` restringida
(`connect-src 'self'`) impide que se envíen datos a otro dominio. Se puede usar completamente sin
conexión después de la primera carga.
