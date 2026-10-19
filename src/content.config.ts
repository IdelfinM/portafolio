import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada proyecto y cada caso existe una vez por idioma: <coleccion>/<lang>/<slug>.md.
// El slug debe ser el mismo en es/ y en/ para que el selector de idioma encuentre la pareja.

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    status: z.enum(['production', 'development', 'private']),
    role: z.string().optional(),
    period: z.string().optional(),
    stack: z.array(z.string()).min(1),
    highlights: z.array(z.string()),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    demoOnRequest: z.boolean().default(false),
    // Proyectos de empleador: sin codigo, sin capturas, solo alcance y rol.
    confidential: z.boolean().default(false),
    featured: z.boolean().default(false),
    // Borrador: no se publica. Actinio espera el visto bueno del empleador.
    draft: z.boolean().default(false),
    order: z.number(),
  }),
});

const cases = defineCollection({
  loader: glob({ base: './src/content/cases', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    project: z.string(),
    summary: z.string(),
    result: z.string(),
    tags: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { projects, cases };
