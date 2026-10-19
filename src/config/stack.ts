type Item = string | { es: string; en: string };

// Tecnologias agrupadas para la portada. Solo lo que aparece en algun proyecto del portafolio:
// si un reclutador pregunta, hay codigo real detras de cada etiqueta.
export const stackGroups: { label: { es: string; en: string }; items: Item[] }[] = [
  {
    label: { es: 'Backend', en: 'Backend' },
    items: ['PHP 8.4', 'Laravel 12/13', 'Sanctum', 'C# / .NET 10', 'ASP.NET Core', 'EF Core', 'Node.js'],
  },
  {
    label: { es: 'Frontend', en: 'Frontend' },
    items: ['Vue 3', 'Pinia', 'Vuetify', 'Tailwind CSS', 'Vite', 'Ionic', 'Angular', 'Avalonia'],
  },
  {
    label: { es: 'Datos', en: 'Data' },
    items: ['MariaDB / MySQL', 'PostgreSQL', { es: 'Colas y jobs', en: 'Queues and jobs' }, { es: 'Migraciones', en: 'Migrations' }],
  },
  {
    label: { es: 'Calidad', en: 'Quality' },
    items: ['PHPUnit', 'Vitest', 'xUnit', 'Testcontainers', 'PHPStan / Larastan', 'NetArchTest'],
  },
  {
    label: { es: 'Infraestructura', en: 'Infrastructure' },
    items: ['Docker Compose', 'nginx', 'php-fpm', 'Linux (Ubuntu)', 'systemd', "Let's Encrypt", 'Git / GitHub'],
  },
  {
    label: { es: 'Seguridad', en: 'Security' },
    items: ['RBAC', { es: 'CSP y cabeceras', en: 'CSP and headers' }, 'Rate limiting', { es: 'Auditoría inmutable', en: 'Immutable audit log' }, { es: 'Respaldos cifrados', en: 'Encrypted backups' }],
  },
];
