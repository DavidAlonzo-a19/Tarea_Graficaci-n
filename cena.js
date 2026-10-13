// ¿Qué hay de cena? (proyecto de Khan Academy adaptado a p5.js, con mejoras pequeñas)
// Las posiciones y colores originales se conservan; lo marcado como "mejora" es nuevo.
function setup() {
  createCanvas(400, 400).parent("lienzo");

  background(186, 145, 20); // wooden table

  // mejora: vetas de la madera
  stroke(160, 120, 10);
  strokeWeight(2);
  for (var yv = 20; yv < 400; yv += 40) {
    line(0, yv, 400, yv);
  }

  // mejora: sombra del plato
  noStroke();
  fill(0, 0, 0, 50);
  ellipse(208, 208, 350, 350);

  // plate
  stroke(120);
  strokeWeight(2);
  fill(255);
  ellipse(200, 200, 350, 350);
  fill(240); // mejora: el centro del plato un poco más gris
  ellipse(200, 200, 300, 300);

  // Huevo 1 (clara)
  noStroke();
  fill(255, 253, 250);
  ellipse(247, 120, 150, 130);

  // Tocino / pan (rectángulo naranja)
  fill(250, 148, 15);
  rect(187, 200, 152, 47, 10); // mejora: esquinas redondeadas

  // Huevo 2 (clara)
  fill(252, 251, 249);
  ellipse(123, 177, 150, 130);

  // Yemas
  fill(242, 250, 10);
  ellipse(233, 117, 88, 77);
  ellipse(112, 180, 88, 77);

  // mejora: brillo en las yemas y pimienta
  fill(255, 255, 255, 170);
  ellipse(218, 102, 18, 12);
  ellipse(97, 165, 18, 12);
  fill(60);
  ellipse(260, 150, 3, 3);
  ellipse(285, 135, 3, 3);
  ellipse(150, 210, 3, 3);
  ellipse(80, 200, 3, 3);

  noLoop(); // dibujo estático
}
