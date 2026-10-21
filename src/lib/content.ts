import { getCollection, type CollectionEntry } from 'astro:content';
import { langOf, slugOf, type Lang } from '../i18n/ui';

export async function getProjects(lang: Lang) {
  const all = await getCollection('projects', ({ id, data }) => langOf(id) === lang && !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getCases(lang: Lang) {
  const all = await getCollection('cases', ({ id }) => langOf(id) === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

// Suma de las metricas de pruebas de los proyectos ("282", "600+"...): el "+" y los separadores se
// descartan, asi que el total nunca supera lo que dice cada proyecto.
export function totalTests(projects: CollectionEntry<'projects'>[]) {
  return projects
    .flatMap((p) => p.data.metrics)
    .filter((m) => /prueba|test/i.test(m.label))
    .reduce((sum, m) => sum + (Number.parseInt(m.value.replace(/[^\d]/g, ''), 10) || 0), 0);
}

// slug del proyecto -> titulo, para rotular cada caso sin buscar el proyecto en cada tarjeta.
export function projectTitles(projects: CollectionEntry<'projects'>[]) {
  return new Map(projects.map((p) => [slugOf(p.id), p.data.title]));
}

// Etiquetas ordenadas por frecuencia: las mas usadas primero en el filtro. Una etiqueta de un
// solo caso no filtra nada util y alarga la fila de botones, por eso el minimo es 2.
export function tagsByFrequency(cases: CollectionEntry<'cases'>[], min = 2) {
  const counts = new Map<string, number>();
  for (const c of cases) for (const tag of c.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .filter(([, n]) => n >= min)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}
