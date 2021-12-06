

function HockeyPlayer(rink, color1, color2, role, home) {
    this.velX = 0;
    this.velY = 0;
    this.color1 = color1;
    this.color2 = color2;
    this.home = home;
    this.size = rink.width/30;
    this.role = role;
    this.pos = {};
    this.target = {};
    switch(role){
      case 'c':
        this.pos.x = rink.width/2;
        this.pos.y = rink.heigth/2 + this.size * 2;
        break;
      case 'lf':
        this.pos.x = rink.width/2 - this.size * 8;
        this.pos.y = rink.heigth/2 + this.size * 2;
        break;
      case 'lb':
        this.pos.x = rink.width/2 - this.size * 4;
        this.pos.y = rink.heigth/2 + this.size * 8;
        break;
      case 'rf':
        this.pos.x = rink.width/2 + this.size * 8;
        this.pos.y = rink.heigth/2 + this.size * 2;
        break;
      case 'rb':
        this.pos.x = rink.width/2 + this.size * 4;
        this.pos.y = rink.heigth/2 + this.size * 8;
        break;
      case 'g':
        this.pos.x = rink.width/2;
        this.pos.y = rink.heigth - rink.behindGoalHeight - 1.1 * this.size;
        break;
    }
    if(!this.home){
      this.pos.x = rink.width/2 - (this.pos.x - rink.width/2);
      this.pos.y = rink.heigth/2 - (this.pos.y - rink.heigth/2);
    }
    this.target.x = this.pos.x;
    this.target.y = this.pos.y;
  }
  
HockeyPlayer.prototype.draw = function(ctx, rink) {
    pos = {x: rink.left + this.pos.x, y: rink.top + this.pos.y};
    ctx.beginPath();
    ctx.fillStyle = this.color1;
    ctx.strokeStyle = this.color2;
    ctx.lineWidth = 3;
    ctx.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

HockeyPlayer.prototype.updateTarget = function(rink, newPos){
  //TODO check if out of rink
  this.target.x = newPos.x;
  this.target.y = newPos.y;
  var deltaX = this.target.x - this.pos.x;
  var deltaY = this.target.y - this.pos.y;
  this.velX = Math.abs(deltaX) > this.size ? Math.sign(deltaX) * 1 : 0;
  this.velY = Math.abs(deltaY) > this.size ? Math.sign(deltaY) * 1 : 0;
  if(Math.abs(deltaX) > Math.abs(deltaY))
    this.velY /= Math.abs(deltaX/deltaY);
  else
    this.velX /= Math.abs(deltaY/deltaX);
  if(this.velX !=0 || this.velY != 0)
    this.update(rink);
}

HockeyPlayer.prototype.update = function(rink, puck) {
    if ((this.pos.x + this.size) >= rink.width) {
      this.pos.x = rink.width - this.size;
      this.velX = 0;
    }
  
    if ((this.pos.x - this.size) <= 0) {
      this.pos.x = this.size;
      this.velX = 0;
    }
  
    if ((this.pos.y + this.size) >= rink.heigth) {
      this.pos.y = rink.heigth - this.size;
      this.velY = 0;
    }
  
    if ((this.pos.y - this.size) <= 0) {
      this.pos.y = this.size;
      this.velY = 0;
    }
  
    this.pos.x += this.velX;
    this.pos.y += this.velY;
    if(Math.abs(this.pos.x - this.target.x) < this.size)
      this.velX = 0;
    if(Math.abs(this.pos.y - this.target.y) < this.size)
      this.velY = 0;
}

HockeyPlayer.prototype.collisionDetect = function(team) {
    for (let j = 0; j < team.length; j++) {
      if (!(this === team[j])) {
        const dx = this.x - team[j].x;
        const dy = this.y - team[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + team[j].size) {
          team[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
}