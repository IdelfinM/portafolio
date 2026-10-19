// Filtro de casos por tecnologia. Mejora progresiva: sin este script la pagina muestra todos.
(() => {
  const filtro = document.getElementById('filtro-casos');
  const tarjetas = document.querySelectorAll('#lista-casos [data-tags]');
  if (!filtro || tarjetas.length === 0) return;

  const botones = filtro.querySelectorAll('button[data-tag]');
  filtro.classList.remove('hidden');
  filtro.classList.add('flex');

  function aplicar(tag) {
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tag === tag)));
    tarjetas.forEach((t) => {
      t.hidden = tag !== '' && !t.dataset.tags.split('|').includes(tag);
    });
  }

  filtro.addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-tag]');
    if (boton) aplicar(boton.dataset.tag);
  });
})();
