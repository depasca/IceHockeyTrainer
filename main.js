// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
function randomColor(){
  return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
}

let rink = new HockeyRink(50, 50, width - 100, height - 100);
let puck = new Puck(rink);
let ownTeam = new HockeyTeam(rink, 'orange', 'blue', true);
let opponentTeam = new HockeyTeam(rink, 'lightblue', 'green', false);

background = 'white';
function loop() {
  drawWorld();
}

function drawWorld(){
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    rink.draw(ctx, width, height);
    puck.draw(ctx, rink);
    ownTeam.draw(ctx, rink);
    //opponentTeam.draw(ctx, rink);
    requestAnimationFrame(loop);
  }

canvas.addEventListener("click", function(event){
  puck.updatePosition(rink, {x:event.pageX - rink.left, y:event.pageY - rink.top});
  ownTeam.updatePosition(rink, puck);
  opponentTeam.updatePosition(rink, puck);
  drawWorld();
})

loop();