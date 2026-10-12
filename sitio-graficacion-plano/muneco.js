// Muñeco de nieve (proyecto de Khan Academy adaptado a p5.js)
function setup() {
  createCanvas(400, 400).parent("lienzo");
  background(255); // fondo blanco, como el lienzo de Khan Academy

  rect(1, 240, 397, 195);
  ellipse(200, 300, 150, 150);
  ellipse(200, 200, 100, 100);
  ellipse(200, 120, 75, 75);
  line(160, 200, 250, 150);
  line(240, 200, 350, 150);

  noLoop(); // dibujo estático
}
