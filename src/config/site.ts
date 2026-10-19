// Datos personales del portafolio.
// Nada de aqui debe delatar la infraestructura: ni IPs, ni el hostname DDNS, ni rutas del servidor.

export const site = {
  name: 'Idelfin Montas Espinal',
  initials: 'IM',
  email: 'idemosp@gmail.com',
  github: 'https://github.com/IdelfinM',
  linkedin: 'https://www.linkedin.com/in/idelfin-montas',
  location: { es: 'República Dominicana', en: 'Dominican Republic' },
  // CV en public/cv/. Si el archivo no existe, el boton no se muestra (ver src/views/HomeView.astro).
  cv: { es: '/cv/cv-es.pdf', en: '/cv/cv-en.pdf' },
  // Repositorio del propio sitio: se enlaza en el pie para quien quiera ver como esta hecho.
  repo: 'https://github.com/IdelfinM/portafolio',
  // Dominio publico (espejo en Cloudflare Pages) y la copia del servidor casero en Docker, que se
  // enlaza en el pie como evidencia de DevOps. astro.config.mjs toma `url` de aqui.
  // PENDIENTE: sin dominio comprado todavia; verificar-dist.mjs bloquea publicar con example.dev.
  url: 'https://example.dev',
  selfHostedUrl: 'https://home.example.dev/',
} as const;
