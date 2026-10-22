// Barrera antes de publicar: revisa dist/ y falla si encuentra algo que no debe salir a Internet.
// Uso: node scripts/verificar-dist.mjs   (lo llama scripts/publicar.sh despues del build)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = 'dist';
const TEXTO = new Set(['.html', '.js', '.css', '.xml', '.txt', '.json', '.svg', '']);

// Cada regla dice que busca y por que no puede publicarse. Aqui solo van patrones genericos:
// los nombres concretos (hostname del servidor, usuario, clinica) estan en .verificar.local,
// que no se versiona, porque escribirlos en el repo seria publicar justo lo que se quiere ocultar.
const reglas = [
  { patron: /CAMBIAR/, motivo: 'dato personal sin completar (src/config/site.ts o src/about/)' },
  { patron: /\b(10\.\d{1,3}|192\.168|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/, motivo: 'IP de red privada' },
  { patron: /\/home\/[a-z]/, motivo: 'ruta del servidor' },
  { patron: /example\.dev/, motivo: 'dominio de ejemplo sin reemplazar (src/config/site.ts)' },
];

// .verificar.local: una regla por linea, "patron<TAB>motivo" (tabulador y no "|", que es parte de
// las expresiones regulares); las lineas con # se ignoran.
const LOCAL = '.verificar.local';
if (existsSync(LOCAL)) {
  for (const linea of readFileSync(LOCAL, 'utf8').split(/\r?\n/)) {
    if (!linea.trim() || linea.trimStart().startsWith('#')) continue;
    const [patron, motivo = 'dato local prohibido'] = linea.split('\t').map((x) => x.trim());
    reglas.push({ patron: new RegExp(patron, 'i'), motivo });
  }
} else {
  console.warn(`verificar-dist: falta ${LOCAL}; solo se aplican las reglas genericas.`);
}

function* ficheros(dir) {
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) yield* ficheros(ruta);
    else if (TEXTO.has(extname(nombre))) yield ruta;
  }
}

const hallazgos = [];
for (const ruta of ficheros(DIST)) {
  // El trazo de un <path> son solo coordenadas, y algunas parecen IPs (el logo de HTML5 lleva
  // "10.059.003.23"). Se vacia antes de revisar; el texto visible y los demas atributos siguen igual.
  const lineas = readFileSync(ruta, 'utf8').replace(/ d="[^"]*"/g, ' d=""').split('\n');
  lineas.forEach((linea, i) => {
    for (const { patron, motivo } of reglas) {
      const m = linea.match(patron);
      if (m) hallazgos.push({ donde: `${ruta}:${i + 1}`, texto: m[0], motivo });
    }
  });
}

if (hallazgos.length > 0) {
  console.error(`verificar-dist: ${hallazgos.length} hallazgo(s), NO se publica:\n`);
  // Agrupado por motivo para que una sola causa no tape a las demas en pantalla.
  const porMotivo = Map.groupBy(hallazgos, (h) => h.motivo);
  for (const [motivo, lista] of porMotivo) {
    console.error(`- ${motivo} (${lista.length})`);
    for (const h of lista.slice(0, 3)) console.error(`    ${h.donde}  "${h.texto}"`);
  }
  process.exit(1);
}
console.log('verificar-dist: dist/ limpio.');
