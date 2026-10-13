// Dientes de conejo (proyecto de Khan Academy adaptado a p5.js)
function setup() {
  createCanvas(400, 400).parent("lienzo");
  background(255); // fondo blanco, como el lienzo de Khan Academy

  var ojos = 20;
  var dientes = 11;

  ellipse(150, 70, 60, 120); // left ear
  ellipse(240, 70, 60, 120); // right ear

  ellipse(200, 170, 150, 150); // face

  fill(0, 0, 0);
  ellipse(170, 150, ojos, ojos); // left eye
  ellipse(230, 150, ojos, ojos); // right eye

  line(150, 200, 250, 200); // mouth

  noFill();
  rect(185, 200, 15, dientes); // left tooth
  rect(200, 200, 15, dientes); // right tooth

  noLoop(); // dibujo estático
}
