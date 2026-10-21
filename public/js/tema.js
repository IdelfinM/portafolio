// Tema claro/oscuro. Se carga en <head> sin defer a proposito: pone la clase .dark antes de pintar,
// asi no hay un destello del tema equivocado. Fichero propio y no <script> en linea por la CSP.
(() => {
  const CLAVE = 'portafolio.tema';
  const raiz = document.documentElement;
  const sistema = window.matchMedia('(prefers-color-scheme: dark)');

  function guardado() {
    try {
      return localStorage.getItem(CLAVE);
    } catch {
      return null; // almacenamiento bloqueado: se sigue al sistema
    }
  }

  function aplicar(tema) {
    raiz.classList.toggle('dark', tema === 'dark');
    document.querySelectorAll('[data-tema-boton]').forEach((b) => {
      b.setAttribute('aria-pressed', String(tema === 'dark'));
    });
  }

  const actual = () => guardado() ?? (sistema.matches ? 'dark' : 'light');
  aplicar(actual());

  // Si la persona nunca eligio, el sitio acompana los cambios del sistema.
  sistema.addEventListener('change', () => {
    if (!guardado()) aplicar(actual());
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tema-boton]').forEach((boton) => {
      boton.hidden = false;
      boton.addEventListener('click', () => {
        const nuevo = raiz.classList.contains('dark') ? 'light' : 'dark';
        try {
          localStorage.setItem(CLAVE, nuevo);
        } catch {
          // sin almacenamiento el cambio dura hasta recargar
        }
        aplicar(nuevo);
      });
    });
    aplicar(actual());
  });
})();
