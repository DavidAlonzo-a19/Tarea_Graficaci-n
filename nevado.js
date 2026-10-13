// Día nevado soleado (proyecto de Khan Academy adaptado a p5.js)
function setup() {
  createCanvas(400, 400).parent("lienzo");

  // The ground
  background(32, 247, 218);
  fill(14, 199, 20);
  rect(0, 300, 400, 100);

  // The sun
  fill(255, 191, 0);
  ellipse(80, 64, 100, 100);

  // The snowman
  fill(245, 250, 249);
  ellipse(200, 300, 150, 150);
  ellipse(200, 200, 100, 100);
  ellipse(200, 120, 75, 75);

  noLoop(); // dibujo estático
}
