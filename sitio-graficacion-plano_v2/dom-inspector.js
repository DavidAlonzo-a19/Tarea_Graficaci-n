// Inspector del DOM: dibuja el árbol de etiquetas de cada página del sitio.
//
// Cómo obtiene el árbol:
//  1. Carga la página en un <iframe> oculto y lee su DOM ya construido (con el menú,
//     el pie y el <canvas> que agregan nav.js y p5.js). Esto funciona cuando el sitio
//     está publicado (GitHub Pages) o se abre desde un servidor.
//  2. Si el navegador no deja leer el iframe (por ejemplo al abrir el archivo
//     directamente desde la carpeta), usa la captura guardada en dom-data.js.

(function () {
  // Dentro del iframe de otra página no hacemos nada (evita cargarse a sí mismo).
  if (window.top !== window) return;

  const PAGINAS = [
    ["index.html", "Inicio"],
    ["canvas.html", "canvas"],
    ["p5js.html", "p5.js"],
    ["rana.html", "Rana"],
    ["conejo.html", "Conejo"],
    ["cena.html", "Cena"],
    ["nevado.html", "Día nevado"],
    ["muneco.html", "Muñeco"],
    ["dom-inspector.html", "Inspector DOM"],
  ];

  const SEMANTICOS = ["header", "main", "nav", "section", "article", "aside", "footer"];
  const ESTRUCTURA = ["html", "head", "body"];

  const visor = document.getElementById("visor");
  const selector = document.getElementById("selector");
  const estado = document.getElementById("estado");
  const nota = document.getElementById("nota");

  const cache = new Map();
  let paginaActual = null;
  let escala = 1;

  // ---------- Convertir un elemento del DOM a un objeto simple ----------

  function nombreArchivo(ruta) {
    return (ruta || "").split("?")[0].split("/").pop();
  }

  function detalle(el, tag) {
    // Texto gris que se muestra debajo de la etiqueta
    const partes = [];
    if (el.id) partes.push("#" + el.id);
    const clase = (el.getAttribute("class") || "").trim();
    if (clase) partes.push("." + clase.split(/\s+/).join("."));
    if (tag === "script" && el.getAttribute("src")) partes.push(nombreArchivo(el.getAttribute("src")));
    if (tag === "link" && el.getAttribute("href")) partes.push(nombreArchivo(el.getAttribute("href")));
    if (tag === "canvas" && el.width) {
      // p5.js duplica los píxeles en pantallas retina; el tamaño real del dibujo está en el estilo.
      const ancho = parseInt(el.style.width, 10) || el.width;
      const alto = parseInt(el.style.height, 10) || el.height;
      partes.push(ancho + "×" + alto);
    }
    if (tag === "meta") {
      const n = el.getAttribute("name") || (el.hasAttribute("charset") ? "charset" : "");
      if (n) partes.push(n);
    }
    return partes.join(" ");
  }

  function aNodo(el) {
    const tag = el.tagName.toLowerCase();
    return {
      tag: tag,
      detalle: detalle(el, tag),
      hijos: Array.from(el.children).map(aNodo),
    };
  }

  // ---------- Leer el DOM real de una página ----------

  function cargarVivo(pagina) {
    return new Promise(function (resolver, rechazar) {
      const marco = document.createElement("iframe");
      marco.setAttribute("aria-hidden", "true");
      marco.tabIndex = -1;
      marco.style.cssText =
        "position:absolute;left:-9999px;top:0;width:1000px;height:800px;border:0;visibility:hidden";
      let terminado = false;

      function limpiar() {
        if (marco.parentNode) marco.parentNode.removeChild(marco);
      }
      function fallar(e) {
        if (terminado) return;
        terminado = true;
        limpiar();
        rechazar(e);
      }

      const limite = setTimeout(function () { fallar(new Error("tiempo agotado")); }, 8000);

      marco.addEventListener("load", function () {
        let doc;
        try {
          doc = marco.contentDocument;
          if (!doc || !doc.documentElement) throw new Error("sin acceso");
        } catch (e) {
          clearTimeout(limite);
          return fallar(e);
        }

        // p5.js crea el <canvas> justo después de "load": esperamos a que aparezca.
        let intentos = 0;
        (function esperar() {
          const hayLienzo = doc.getElementById("lienzo");
          const listo = !hayLienzo || hayLienzo.querySelector("canvas") || intentos >= 30;
          if (!listo) {
            intentos++;
            return setTimeout(esperar, 100);
          }
          if (terminado) return;
          terminado = true;
          clearTimeout(limite);
          try {
            const arbol = aNodo(doc.documentElement);
            limpiar();
            resolver(arbol);
          } catch (e) {
            limpiar();
            rechazar(e);
          }
        })();
      });

      marco.addEventListener("error", function () { clearTimeout(limite); fallar(new Error("error de carga")); });
      marco.src = pagina;
      document.body.appendChild(marco);
    });
  }

  async function obtenerArbol(pagina) {
    if (cache.has(pagina)) return cache.get(pagina);
    let resultado;
    try {
      resultado = { arbol: await cargarVivo(pagina), vivo: true };
    } catch (e) {
      const guardado = window.DOM_SNAPSHOT && window.DOM_SNAPSHOT[pagina];
      if (!guardado) throw e;
      resultado = { arbol: guardado, vivo: false };
    }
    cache.set(pagina, resultado);
    return resultado;
  }

  // Para generar la captura guardada (dom-data.js) con una herramienta externa.
  window.__obtenerArbolVivo = cargarVivo;

  // ---------- Agrupar hermanos idénticos ----------

  function firma(n) {
    return n.tag + "|" + n.detalle + "|" + n.hijos.map(firma).join(",");
  }

  function agrupar(nodos) {
    const salida = [];
    nodos.forEach(function (n) {
      const f = firma(n);
      const ultimo = salida[salida.length - 1];
      if (ultimo && ultimo.firma === f) {
        ultimo.cantidad++;
      } else {
        salida.push({ nodo: n, firma: f, cantidad: 1 });
      }
    });
    return salida;
  }

  // ---------- Dibujar el árbol ----------

  function clasePorTag(tag) {
    if (ESTRUCTURA.indexOf(tag) >= 0) return "base";
    if (SEMANTICOS.indexOf(tag) >= 0) return "semantico";
    if (tag === "canvas") return "lienzo";
    return "normal";
  }

  function crearLi(nodo, cantidad) {
    const li = document.createElement("li");
    const tieneHijos = nodo.hijos.length > 0;

    const caja = document.createElement(tieneHijos ? "button" : "div");
    caja.className = "nodo " + clasePorTag(nodo.tag);
    if (tieneHijos) {
      caja.type = "button";
      caja.setAttribute("aria-expanded", "true");
      caja.title = "Clic para ocultar o mostrar los hijos";
    }

    const etiqueta = document.createElement("span");
    etiqueta.className = "etq";
    etiqueta.textContent = "<" + nodo.tag + ">";
    caja.appendChild(etiqueta);

    if (nodo.detalle) {
      const sub = document.createElement("span");
      sub.className = "sub";
      sub.textContent = nodo.detalle;
      caja.appendChild(sub);
    }
    if (cantidad > 1) {
      const ins = document.createElement("span");
      ins.className = "insignia";
      ins.textContent = "×" + cantidad;
      caja.appendChild(ins);
    }
    li.appendChild(caja);

    if (tieneHijos) {
      const ul = document.createElement("ul");
      agrupar(nodo.hijos).forEach(function (g) {
        ul.appendChild(crearLi(g.nodo, g.cantidad));
      });
      li.appendChild(ul);

      const contador = document.createElement("span");
      contador.className = "ocultos";
      contador.textContent = "+" + nodo.hijos.length;
      caja.appendChild(contador);

      caja.addEventListener("click", function () {
        const cerrado = li.classList.toggle("colapsado");
        caja.setAttribute("aria-expanded", String(!cerrado));
      });
    }
    return li;
  }

  function contar(n) {
    let total = 1;
    let profundidad = 1;
    n.hijos.forEach(function (h) {
      const r = contar(h);
      total += r.total;
      profundidad = Math.max(profundidad, r.profundidad + 1);
    });
    return { total: total, profundidad: profundidad };
  }

  function dibujar(arbol) {
    visor.textContent = "";
    const ul = document.createElement("ul");
    ul.className = "arbol";
    ul.appendChild(crearLi(arbol, 1));
    visor.appendChild(ul);
    aplicarEscala();
  }

  function aplicarEscala() {
    const ul = visor.querySelector(".arbol");
    if (ul) ul.style.zoom = String(escala);
  }

  // ---------- Controles ----------

  async function mostrar(pagina) {
    paginaActual = pagina;
    Array.from(selector.children).forEach(function (b) {
      const activo = b.dataset.pagina === pagina;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-selected", String(activo));
    });
    try { history.replaceState(null, "", "#" + pagina); } catch (e) { /* sin historial en file:// */ }
    visor.textContent = "";
    estado.textContent = "Leyendo " + pagina + "…";
    nota.textContent = "";

    try {
      const r = await obtenerArbol(pagina);
      if (pagina !== paginaActual) return; // el usuario ya cambió de página
      dibujar(r.arbol);
      const c = contar(r.arbol);
      estado.textContent = pagina + " · " + c.total + " elementos · " + c.profundidad + " niveles de profundidad";
      nota.textContent = r.vivo
        ? "Árbol leído en este momento desde la página cargada, con el menú, el pie y el canvas que agregan nav.js y p5.js."
        : "Se muestra la captura guardada del árbol (el navegador no permitió leer la página en vivo, como cuando se abre el archivo desde la carpeta).";
    } catch (e) {
      estado.textContent = "";
      nota.textContent = "No se pudo leer " + pagina + ".";
    }
  }

  function colapsarTodo(cerrar) {
    visor.querySelectorAll("li").forEach(function (li) {
      const caja = li.firstElementChild;
      if (!li.querySelector(":scope > ul")) return;
      // La raíz (<html>) se deja abierta para que siempre se vea algo.
      const esRaiz = li.parentElement.classList.contains("arbol");
      const colapsar = cerrar && !esRaiz;
      li.classList.toggle("colapsado", colapsar);
      caja.setAttribute("aria-expanded", String(!colapsar));
    });
  }

  PAGINAS.forEach(function (p) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pestana";
    b.setAttribute("role", "tab");
    b.dataset.pagina = p[0];
    b.textContent = p[0];
    b.title = p[1];
    b.addEventListener("click", function () { mostrar(p[0]); });
    selector.appendChild(b);
  });

  document.getElementById("btn-expandir").addEventListener("click", function () { colapsarTodo(false); });
  document.getElementById("btn-colapsar").addEventListener("click", function () { colapsarTodo(true); });
  document.getElementById("btn-mas").addEventListener("click", function () {
    escala = Math.min(1.6, +(escala + 0.1).toFixed(2));
    aplicarEscala();
  });
  document.getElementById("btn-menos").addEventListener("click", function () {
    escala = Math.max(0.4, +(escala - 0.1).toFixed(2));
    aplicarEscala();
  });

  // Permite abrir una página directo: dom-inspector.html#rana.html
  function paginaDelHash() {
    const h = location.hash.slice(1);
    return PAGINAS.some(function (p) { return p[0] === h; }) ? h : null;
  }
  window.addEventListener("hashchange", function () {
    const h = paginaDelHash();
    if (h && h !== paginaActual) mostrar(h);
  });
  mostrar(paginaDelHash() || "index.html");
})();
