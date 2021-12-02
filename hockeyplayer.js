

function HockeyPlayer(rink, color1, color2, role, home) {
    this.velX = 0;
    this.velY = 0;
    this.color1 = color1;
    this.color2 = color2;
    this.home = home;
    this.size = rink.width/30;
    this.role = role;
    switch(role){
      case 'c':
        this.x = rink.width/2;
        this.y = rink.heigth/2 + this.size * 2;
        break;
      case 'lf':
        this.x = rink.width/2 - this.size * 8;
        this.y = rink.heigth/2 + this.size * 2;
        break;
      case 'lb':
        this.x = rink.width/2 - this.size * 4;
        this.y = rink.heigth/2 + this.size * 8;
        break;
      case 'rf':
        this.x = rink.width/2 + this.size * 8;
        this.y = rink.heigth/2 + this.size * 2;
        break;
      case 'rb':
        this.x = rink.width/2 + this.size * 4;
        this.y = rink.heigth/2 + this.size * 8;
        break;
      case 'g':
        this.x = rink.width/2;
        this.y = rink.heigth - rink.behindGoalHeight - 1.1 * this.size;
        break;
    }
    if(!this.home){
      this.x = rink.width/2 - (this.x - rink.width/2);
      this.y = rink.heigth/2 - (this.y - rink.heigth/2);
    }
  }
  
HockeyPlayer.prototype.draw = function(ctx, rink) {
    pos = {x: rink.left + this.x, y: rink.top + this.y};
    ctx.beginPath();
    ctx.fillStyle = this.color1;
    ctx.strokeStyle = this.color2;
    ctx.lineWidth = 3;
    ctx.arc(pos.x, pos.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

HockeyPlayer.prototype.updatePosition = function(rink, pos){
  //TODO check if out of rink
  this.x = pos.x;
  this.y = pos.y;
}

HockeyPlayer.prototype.update = function(rink) {
    if ((this.x + this.size) >= rink.right) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= rink.left) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= rink.bottom) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= rink.top) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
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