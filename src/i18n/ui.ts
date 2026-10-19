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

export const ui = {
  es: {
    'meta.description':
      'Ingeniero de software full-stack: Laravel, Vue, .NET y Docker. Proyectos en producción y cómo resolví los problemas reales que aparecieron.',
    'nav.projects': 'Proyectos',
    'nav.cases': 'Problemas resueltos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.switch': 'English',
    'hero.role': 'Ingeniero de Software Full-Stack',
    'hero.pitch':
      'Construyo aplicaciones web completas, de la base de datos al despliegue, y las mantengo en producción. Me interesa tanto que el código funcione como entender por qué deja de hacerlo.',
    'hero.cta.projects': 'Ver proyectos',
    'hero.cta.cv': 'Descargar CV',
    'hero.cta.contact': 'Escribirme',
    'home.featured': 'Proyectos destacados',
    'home.featured.all': 'Todos los proyectos',
    'home.cases': 'Cómo resuelvo problemas',
    'home.cases.intro':
      'Cada caso sigue el mismo orden: contexto, problema, diagnóstico, solución y resultado. Son problemas reales que aparecieron en producción o durante el desarrollo.',
    'home.cases.all': 'Todos los casos',
    'home.stack': 'Con qué trabajo',
    'projects.title': 'Proyectos',
    'projects.intro':
      'Aplicaciones que he diseñado, construido y, en varios casos, desplegado y operado yo mismo.',
    'project.stack': 'Tecnologías',
    'project.highlights': 'Qué hace',
    'project.metrics': 'En números',
    'project.cases': 'Problemas resueltos en este proyecto',
    'project.links': 'Enlaces',
    'project.back': 'Volver a proyectos',
    'project.confidential': 'Proyecto privado de empresa: solo se describen el alcance y mi rol.',
    'project.demo': 'Demo en vivo disponible a solicitud.',
    'status.production': 'En producción',
    'status.development': 'En desarrollo',
    'status.private': 'Privado',
    'cases.title': 'Problemas resueltos',
    'cases.intro':
      'Problemas concretos, cómo los diagnostiqué y qué cambió después. Filtra por tecnología o abre cualquiera para ver el detalle.',
    'cases.filter.all': 'Todos',
    'case.project': 'Proyecto',
    'case.result': 'Resultado',
    'case.back': 'Volver a los casos',
    'about.title': 'Sobre mí',
    'contact.title': 'Hablemos',
    'contact.text':
      'Si tienes una vacante o un proyecto donde encaje este perfil, escríbeme. Respondo en español o en inglés.',
    'footer.selfhosted': 'Este sitio también corre en Docker en mi propio servidor',
    'footer.built': 'Hecho con Astro y Tailwind CSS',
    'footer.source': 'Código de este sitio',
    'common.readMore': 'Leer caso',
    'common.viewProject': 'Ver proyecto',
  },
  en: {
    'meta.description':
      'Full-stack software engineer: Laravel, Vue, .NET and Docker. Production projects and how I solved the real problems that came up.',
    'nav.projects': 'Projects',
    'nav.cases': 'Problems solved',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.switch': 'Español',
    'hero.role': 'Full-Stack Software Engineer',
    'hero.pitch':
      'I build complete web applications, from the database to deployment, and keep them running in production. I care as much about code that works as about understanding why it stops working.',
    'hero.cta.projects': 'See projects',
    'hero.cta.cv': 'Download resume',
    'hero.cta.contact': 'Get in touch',
    'home.featured': 'Featured projects',
    'home.featured.all': 'All projects',
    'home.cases': 'How I solve problems',
    'home.cases.intro':
      'Every case follows the same order: context, problem, diagnosis, solution and result. These are real problems that showed up in production or during development.',
    'home.cases.all': 'All cases',
    'home.stack': 'What I work with',
    'projects.title': 'Projects',
    'projects.intro':
      'Applications I designed and built and, in several cases, deployed and operate myself.',
    'project.stack': 'Technologies',
    'project.highlights': 'What it does',
    'project.metrics': 'By the numbers',
    'project.cases': 'Problems solved in this project',
    'project.links': 'Links',
    'project.back': 'Back to projects',
    'project.confidential': 'Private company project: only the scope and my role are described.',
    'project.demo': 'Live demo available on request.',
    'status.production': 'In production',
    'status.development': 'In development',
    'status.private': 'Private',
    'cases.title': 'Problems solved',
    'cases.intro':
      'Concrete problems, how I diagnosed them and what changed afterwards. Filter by technology or open any of them for the details.',
    'cases.filter.all': 'All',
    'case.project': 'Project',
    'case.result': 'Result',
    'case.back': 'Back to cases',
    'about.title': 'About me',
    'contact.title': "Let's talk",
    'contact.text':
      "If you have a role or a project where this profile fits, write to me. I answer in Spanish or English.",
    'footer.selfhosted': 'This site also runs in Docker on my own server',
    'footer.built': 'Built with Astro and Tailwind CSS',
    'footer.source': 'Source code',
    'common.readMore': 'Read case',
    'common.viewProject': 'View project',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function useT(lang: Lang) {
  return (key: UiKey) => ui[lang][key];
}
