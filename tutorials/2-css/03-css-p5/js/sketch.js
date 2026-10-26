
let canvas; 
let xPos = 0;
let yPos = 0;
let easing = 0.05;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    // canvas.style("z-index", -2);
   
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    clear();

    xPos = xPos + ((mouseX - xPos) * easing);
    yPos = yPos + ((mouseY - yPos) * easing);

   drawthing(xPos, yPos);

}


function drawthing(_x, _y) {

    // draw eyeballs
    fill(255);
    ellipse(_x, _y, 30, 30);
    ellipse(_x - 20, _y + 5, 30, 30);

    //draw pupil    
    fill(0);
    ellipse(_x + 10, _y, 5, 5);
    ellipse(_x - 10, _y + 5, 5, 5);

  

   }