function Puck(rink) {
    this.x = rink.center.x;
    this.y = rink.center.y;
    this.velX = 0;
    this.velY = 0;
    this.color = "black";
    this.size = rink.width/100;
  }
  
Puck.prototype.draw = function(ctx, rink) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(rink.left + this.x, rink.top + this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Puck.prototype.updatePosition = function(rink, pos){
  //TODO check if out of rink
  this.x = pos.x;
  this.y = pos.y;
}

Puck.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
}