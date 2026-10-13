// Menú de navegación y pie de página compartidos por todas las páginas.
(function () {
  const enlaces = [
    ["index.html", "Inicio"],
    ["canvas.html", "El elemento canvas"],
    ["p5js.html", "Fundamentos de p5.js"],
    ["rana.html", "Rana"],
    ["conejo.html", "Dientes de conejo"],
    ["cena.html", "¿Qué hay de cena?"],
    ["nevado.html", "Día nevado soleado"],
    ["muneco.html", "Muñeco de nieve"],
  ];
  const actual = location.pathname.split("/").pop() || "index.html";

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Menú principal");
  enlaces.forEach(([href, texto]) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = texto;
    if (href === actual) a.className = "activo";
    nav.appendChild(a);
  });
  document.body.insertBefore(nav, document.body.firstChild);

  const pie = document.createElement("footer");
  pie.textContent = "Graficación · Instituto Tecnológico de Matehuala · Hecho con HTML, CSS, JavaScript y p5.js";
  document.body.appendChild(pie);
})();
