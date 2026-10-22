export const langs = ['es', 'en'] as const;
export type Lang = (typeof langs)[number];

// GitHub Pages sirve el sitio bajo /portafolio/ y el contenedor del servidor en la raiz: toda ruta
// interna pasa por aqui para llevar el prefijo que corresponda (base de astro.config.mjs).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string) {
  return `${BASE}${path}`;
}

// Las URL se traducen tambien: /es/proyectos/ y /en/projects/ son la misma pagina.
export const routes = {
  home: { es: withBase('/es/'), en: withBase('/en/') },
  projects: { es: withBase('/es/proyectos/'), en: withBase('/en/projects/') },
  cases: { es: withBase('/es/casos/'), en: withBase('/en/cases/') },
  about: { es: withBase('/es/sobre-mi/'), en: withBase('/en/about/') },
};

export type RouteKey = keyof typeof routes;

export function projectUrl(lang: Lang, slug: string) {
  return `${routes.projects[lang]}${slug}/`;
}

export function caseUrl(lang: Lang, slug: string) {
  return `${routes.cases[lang]}${slug}/`;
}

// Las entradas de contenido viven en <coleccion>/<lang>/<slug>.md y su id es "<lang>/<slug>".
export function slugOf(id: string) {
  return id.split('/').slice(1).join('/');
}

export function langOf(id: string): Lang {
  return id.split('/')[0] as Lang;
}

// "[...]" marca la parte del titulo que va resaltada (SectionTitle.astro). plain() la quita para
// los usos sin formato: <title>, aria-label.
export function splitHighlight(text: string) {
  return text
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((part) => (part.startsWith('[') ? { text: part.slice(1, -1), highlight: true } : { text: part, highlight: false }));
}

export function plain(text: string) {
  return text.replace(/[[\]]/g, '');
}

export const ui = {
  es: {
    'meta.description':
      'Ingeniero de software full-stack: Laravel, Vue, .NET y Docker. Proyectos en producción y desafíos de ingeniería resueltos, con su diagnóstico y su resultado.',
    'nav.projects': 'Proyectos',
    'nav.cases': 'Desafíos de ingeniería',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.switch': 'English',
    'hero.role': 'Ingeniero de Software Full-Stack',
    'hero.pitch':
      'No me limito a escribir código: analizo el problema, diseño la solución y la llevo hasta producción, donde la opero y la mantengo. Cuando algo falla, busco la causa raíz con evidencia antes de cambiar nada.',
    'hero.cta.projects': 'Ver proyectos',
    'hero.cta.cv': 'Descargar CV',
    'hero.cta.contact': 'Escribirme',
    'home.featured': 'Proyectos [destacados]',
    'home.featured.all': 'Todos los proyectos',
    'home.cases': 'Desafíos de [ingeniería]',
    'home.cases.intro':
      'Problemas reales de producción y de desarrollo, contados siempre en el mismo orden: contexto, problema, diagnóstico, solución y resultado.',
    'home.cases.all': 'Todos los desafíos',
    'home.stack': 'Stack [técnico]',
    'home.stack.intro':
      'Cada tecnología tiene código real detrás. Las subrayadas llevan a los desafíos resueltos con ella.',
    'projects.title': 'Proyectos [construidos]',
    'projects.intro':
      'Aplicaciones diseñadas y construidas de punta a punta; varias se despliegan y se operan en producción.',
    'project.stack': 'Tecnologías',
    'project.stack.hint': 'Las enlazadas llevan a los desafíos resueltos con esa tecnología.',
    'project.highlights': 'Capacidades [clave]',
    'project.metrics': 'En números',
    'project.cases': 'Desafíos [resueltos] en este proyecto',
    'project.links': 'Enlaces',
    'project.back': 'Volver a proyectos',
    'project.confidential': 'Proyecto privado de empresa: solo se describen el alcance y mi rol.',
    'project.demo': 'Demo en vivo disponible a solicitud.',
    'status.production': 'En producción',
    'status.development': 'En desarrollo',
    'status.private': 'Privado',
    'cases.title': 'Desafíos de [ingeniería]',
    'cases.intro':
      'Problemas concretos, cómo se diagnosticaron y qué cambió después. Filtra por tecnología o abre cualquiera para ver el detalle.',
    'cases.filter.all': 'Todos',
    'case.project': 'Proyecto',
    'case.result': 'Resultado',
    'case.back': 'Volver a los desafíos',
    'about.title': 'Sobre [mí]',
    'contact.title': 'Hablemos',
    'contact.text':
      'Abierto a colaboraciones y a proyectos que representen nuevos retos de ingeniería. Si tienes un problema difícil entre manos, conversemos, en español o en inglés.',
    'footer.selfhosted': 'Este sitio también corre en Docker en mi propio servidor',
    'footer.built': 'Hecho con Astro y Tailwind CSS',
    'footer.source': 'Código de este sitio',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.toggle': 'Cambiar tema claro/oscuro',
    'hero.stats.tests': 'pruebas automatizadas',
    'hero.stats.projects': 'proyectos',
    'hero.stats.cases': 'desafíos documentados',
    'common.readMore': 'Ver desafío',
    'common.viewProject': 'Ver proyecto',
  },
  en: {
    'meta.description':
      'Full-stack software engineer: Laravel, Vue, .NET and Docker. Production projects and solved engineering challenges, with their diagnosis and outcome.',
    'nav.projects': 'Projects',
    'nav.cases': 'Engineering challenges',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.switch': 'Español',
    'hero.role': 'Full-Stack Software Engineer',
    'hero.pitch':
      "I don't just write code: I analyze the problem, design the solution and take it all the way to production, where I run and maintain it. When something breaks, I find the root cause with evidence before changing anything.",
    'hero.cta.projects': 'See projects',
    'hero.cta.cv': 'Download resume',
    'hero.cta.contact': 'Get in touch',
    'home.featured': 'Featured [projects]',
    'home.featured.all': 'All projects',
    'home.cases': 'Engineering [challenges]',
    'home.cases.intro':
      'Real problems from production and development, always told in the same order: context, problem, diagnosis, solution and result.',
    'home.cases.all': 'All challenges',
    'home.stack': 'Tech [stack]',
    'home.stack.intro':
      'There is real code behind every technology. The underlined ones lead to the challenges solved with them.',
    'projects.title': "What I've [built]",
    'projects.intro':
      'Applications designed and built end to end; several are deployed and run in production.',
    'project.stack': 'Technologies',
    'project.stack.hint': 'Linked ones lead to the challenges solved with that technology.',
    'project.highlights': 'Key [capabilities]',
    'project.metrics': 'By the numbers',
    'project.cases': 'Challenges [solved] in this project',
    'project.links': 'Links',
    'project.back': 'Back to projects',
    'project.confidential': 'Private company project: only the scope and my role are described.',
    'project.demo': 'Live demo available on request.',
    'status.production': 'In production',
    'status.development': 'In development',
    'status.private': 'Private',
    'cases.title': 'Engineering [challenges]',
    'cases.intro':
      'Concrete problems, how they were diagnosed and what changed afterwards. Filter by technology or open any of them for the details.',
    'cases.filter.all': 'All',
    'case.project': 'Project',
    'case.result': 'Result',
    'case.back': 'Back to challenges',
    'about.title': 'About [me]',
    'contact.title': "Let's talk",
    'contact.text':
      "Open to collaborations and projects that bring new engineering challenges. If you have a hard problem on your hands, let's talk, in Spanish or English.",
    'footer.selfhosted': 'This site also runs in Docker on my own server',
    'footer.built': 'Built with Astro and Tailwind CSS',
    'footer.source': 'Source code',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Switch light/dark theme',
    'hero.stats.tests': 'automated tests',
    'hero.stats.projects': 'projects',
    'hero.stats.cases': 'documented challenges',
    'common.readMore': 'See challenge',
    'common.viewProject': 'View project',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function useT(lang: Lang) {
  return (key: UiKey) => ui[lang][key];
}
