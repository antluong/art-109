
let canvas; 

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", -2);
   
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
   drawthing(mouseX, mouseY);
}

// function mouseMoved() {
  
//   drawthing(mouseX - 50, mouseY + 75);
// }

function drawthing(_x, _y) {

    // draw eyeballs
    fill(255);
    ellipse(_x, _y, 30, 30);
    ellipse(_x - 20, _y +5, 30, 30);

    //draw pupil    
    fill(0);
    ellipse(_x + 10, _y, 5, 5);
    ellipse(_x - 10, _y - 5, 5, 5);

  

   }