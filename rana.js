// Rana (proyecto de Khan Academy adaptado a p5.js)
// En p5.js el dibujo va dentro de setup(); createCanvas() crea el <canvas> en la página.
function setup() {
  createCanvas(400, 400).parent("lienzo");
  background(255); // fondo blanco, como el lienzo de Khan Academy

  var x = 200;
  var y = 250;

  noStroke();
  fill(30, 204, 91); // un buen verde ranita

  ellipse(x, y, 200, 100); // cara
  ellipse(x - 50, y - 50, 40, 40); // cuenca del ojo izquierdo
  ellipse(x + 50, y - 50, 40, 40); // cuenca del ojo derecho

  fill(255, 255, 255); // blanco de los ojos
  ellipse(x - 50, y - 50, 30, 30); // ojo izquierdo
  ellipse(x + 50, y - 50, 30, 30); // ojo derecho

  fill(10, 9, 9);
  ellipse(x, y, 122, 55); // boca

  rect(x - 54, y - 55, 15, 16); // pupila izquierda

  rect(x + 47, y - 55, 15, 16); // pupila derecha

  noLoop(); // es un dibujo estático, no necesita redibujarse
}
