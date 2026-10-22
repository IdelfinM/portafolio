import {
  siAngular,
  siAvaloniaui,
  siCapacitor,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siHtml5,
  siIonic,
  siJavascript,
  siJsonwebtokens,
  siLaravel,
  siLetsencrypt,
  siLinux,
  siMariadb,
  siMysql,
  siNginx,
  siNodedotjs,
  siPhp,
  siPinia,
  siPostgresql,
  siReactivex,
  siTailwindcss,
  siUbuntu,
  siVite,
  siVitest,
  siVuedotjs,
  siVuetify,
} from 'simple-icons';

// Logotipos de simple-icons (CC0), empaquetados en el build: la CSP no deja cargar nada de terceros.
// Van en un solo color (currentColor) para que se lean igual en tema claro y oscuro.
// tag: etiqueta de casos con la que se filtra la lista de desafios al hacer clic en la tecnologia.
// Las etiquetas genericas se traducen (Seguridad/Security), por eso tag admite una por idioma.
// El orden importa: gana la primera coincidencia ("PHP-FPM" antes que "PHP").
const security = { es: 'Seguridad', en: 'Security' };
const testing = { es: 'Pruebas', en: 'Testing' };

const techs: { match: RegExp; icon?: { path: string }; tag?: string | { es: string; en: string } }[] = [
  { match: /^php-fpm/i, icon: siPhp, tag: 'PHP-FPM' },
  { match: /^php\b/i, icon: siPhp },
  { match: /^laravel/i, icon: siLaravel, tag: 'Laravel' },
  { match: /^vue\b/i, icon: siVuedotjs, tag: 'Vue' },
  { match: /^vuetify/i, icon: siVuetify },
  { match: /^pinia/i, icon: siPinia },
  { match: /^tailwind/i, icon: siTailwindcss },
  { match: /^vite$/i, icon: siVite },
  { match: /^vitest/i, icon: siVitest, tag: testing },
  { match: /^(phpunit|xunit|testcontainers)/i, tag: testing },
  { match: /^ionic/i, icon: siIonic },
  { match: /^angular/i, icon: siAngular },
  { match: /^capacitor/i, icon: siCapacitor },
  { match: /^rxjs/i, icon: siReactivex },
  { match: /^avalonia/i, icon: siAvaloniaui },
  { match: /^(c#|\.net)/i, icon: siDotnet, tag: '.NET' },
  { match: /^(asp\.net|ef core)/i, icon: siDotnet },
  { match: /^mariadb/i, icon: siMariadb },
  { match: /^mysql/i, icon: siMysql },
  { match: /^postgresql/i, icon: siPostgresql },
  { match: /^nginx/i, icon: siNginx, tag: 'nginx' },
  { match: /^docker/i, icon: siDocker, tag: 'Docker' },
  { match: /^ubuntu/i, icon: siUbuntu, tag: 'Linux' },
  { match: /^linux/i, icon: siLinux, tag: 'Linux' },
  { match: /^node\.js/i, icon: siNodedotjs },
  { match: /^javascript/i, icon: siJavascript },
  { match: /^html/i, icon: siHtml5 },
  { match: /^css$/i, icon: siCss },
  { match: /^let's encrypt/i, icon: siLetsencrypt },
  { match: /^git\b/i, icon: siGit },
  { match: /^jwt/i, icon: siJsonwebtokens },
  { match: /^(rbac|csp|rate limiting|auditor[ií]a|immutable audit)/i, tag: security },
];

export function techInfo(label: string) {
  return techs.find((t) => t.match.test(label)) ?? {};
}
