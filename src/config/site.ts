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
  // Dominio publico, servido por GitHub Pages (public/CNAME debe decir lo mismo). astro.config.mjs
  // toma `url` de aqui.
  url: 'https://idmdev.net',
  // Copia en el servidor casero en Docker, enlazada en el pie como evidencia de DevOps. Vacio = no
  // se enlaza (mientras su vhost y su certificado no esten publicados).
  selfHostedUrl: '',
} as const;
