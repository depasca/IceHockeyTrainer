// setup canvas
const canvas = document.getElementById('icehockeyrink');
const ctx = canvas.getContext('2d');
const width = canvas.width = Math.min(500, window.innerWidth);
const height = canvas.height = Math.min(1000,window.innerHeight);

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}
function randomColor(){
  return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
}

var rink;
var puck;
var ownTeam;
var opponentTeam;

function resetWorld(){
  rink = new HockeyRink(0, 0, width - 0, height - 0); 
  puck = new Puck(rink);
  ownTeam = new HockeyTeam(rink, 'orange', 'blue', true);
  opponentTeam = new HockeyTeam(rink, 'lightblue', 'green', false);
}

background = 'white';
function loop() {
  drawWorld();
}

function drawWorld(){
    ownTeam.update(rink, puck);
    opponentTeam.update(rink, puck);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    rink.draw(ctx, width, height);
    puck.draw(ctx, rink);
    ownTeam.draw(ctx, rink);
    opponentTeam.draw(ctx, rink);
    requestAnimationFrame(drawWorld);
  }

  function learnGoodPos(){
    set = {'puck.x': puck.x, 'puck.y': puck.y};
    for(role in opponentTeam.players){
      set['opp ' + role+'.x'] = Math.floor(opponentTeam.players[role].pos.x);
      set['opp ' + role+'.y'] = Math.floor(opponentTeam.players[role].pos.y);
    }
    for(role in ownTeam.players){
      set['own ' + role+'.x'] = Math.floor(ownTeam.players[role].pos.x);
      set['own ' + role+'.y'] = Math.floor(ownTeam.players[role].pos.y);
    }
    addToTrainingSet(set);
  }
  
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function downloadTrainingSet(){
  var text = document.getElementById('trainingset');
  text.innerHTML = JSON.stringify(trainingSet);
  download(JSON.stringify(trainingSet), 'trainingset.json', 'text/plain');
}

function train(){
  trainWithPuck(rink);
}

var dragging = false;
var selectedPlayer = null;

canvas.addEventListener("click", function(event){
  if(dragging)
    dragging = false;
  else{
    console.log([event.pageX, event.pageY]);
    puck.updatePosition(rink, {x:event.pageX - rink.left, y:event.pageY - rink.top});
    ownTeam.updateTarget(rink, puck);
    opponentTeam.updateTarget(rink, puck);
  }
})

canvas.addEventListener("mousedown", function(event){
  selectedPlayer = ownTeam.select(rink, {x:event.pageX - rink.left, y:event.pageY - rink.top});
  if(selectedPlayer == null)
    selectedPlayer = opponentTeam.select(rink, {x:event.pageX - rink.left, y:event.pageY - rink.top});
  if(selectedPlayer != null){
    //player.color2="red";
    dragging = true;
  }
  else
    dragging = false;
})

canvas.addEventListener("mousemove", function(event){
  if(dragging && (selectedPlayer != null))
    selectedPlayer.updatePosition(rink, {x:event.pageX - rink.left, y:event.pageY - rink.top})
})



resetWorld();
loop();