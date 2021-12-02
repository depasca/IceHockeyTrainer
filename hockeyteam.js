const AttackTopL = 1;
const AttackTopR = 2;
const AttackCenterL = 3;
const AttackCenterR = 6;
const DefendCenterL = -3;
const DefendCenterR = -6;
const DefendBottomL = -1;
const DefendBottomR = -2;
    
function HockeyTeam(rink, color1, color2, home) {
    this.color1 = color1;
    this.color2 = color2;
    this.home = home;
    this.players = {};
    var roles = ['g', 'c', 'lf', 'rf', 'lb', 'rb'];
    roles.forEach(role => 
        this.players[role] = new HockeyPlayer(rink, color1, color2, role, home)
    );

    this.currentZone = DefendCenterL;
}
  
HockeyTeam.prototype.draw = function(ctx, rink) {
    for(var role in this.players){
        this.players[role].draw(ctx, rink);
    }
}

HockeyTeam.prototype.determineZone = function(rink, puck){
    var zone = 0;
    if(puck.y <=  rink.behindGoalHeight)
        zone = AttackTopL;
    else if(puck.y <=  rink.center.y)
        zone = AttackCenterL;
    else if(puck.y <= rink.heigth - rink.behindGoalHeight)
        zone = DefendCenterL;
    else
        zone = DefendBottomL;

    if(puck.x > rink.width/2)
        zone *= 2;
    return zone;
}

HockeyTeam.prototype.checkSide = function(rink, pos){
    if(this.home)
        return pos;
    else{
        var flipped = pos;
        flipped.x = rink.center.x - (flipped.x - rink.center.x);
        flipped.y = rink.center.y - (flipped.y - rink.center.y);
        return flipped;
    }
}

HockeyTeam.prototype.updatePosition = function(rink, puck) {
    var puckPos = this.checkSide(rink, {x:puck.x, y:puck.y});
    this.currentZone = this.determineZone(rink, puckPos);

    console.log(this.home + ':' + this.currentZone);

    this.positionGoalie(rink, puckPos);

    switch(this.currentZone){
        case AttackTopL:
            this.attackTopLeft(rink, puckPos);
        break;
        case AttackTopR:
            this.attackTopRight(rink, puckPos);
        break;
        case AttackCenterL:
            this.attackCenterLeft(rink, puckPos);
            break;
        case AttackCenterR:
            this.attackCenterRight(rink, puckPos);
            break;
        case DefendCenterL:
            this.defendCenterLeft(rink, puckPos);
            break;
        case DefendCenterR:
            this.defendCenterRight(rink, puckPos);
            break;
        case DefendBottomL:
            this.defendBottomLeft(rink, puckPos);
            break;
        case DefendBottomR:
            this.defendBottomRight(rink, puckPos);
            break;
    }
}

HockeyTeam.prototype.positionGoalie = function(rink, puck){
    var p = this.players['g'];
    var defendPos = {x:rink.width/2, y:rink.bottom - rink.behindGoalHeight}
    defendPos = this.checkSide(rink, defendPos);
    currentPos = this.checkSide(rink, {x:p.x, y:p.y});
    if(puck.y < rink.defenseBlueLine)
        var nextPos = {x:rink.center.x, y:currentPos.y};
    else
        var nextPos = {x:defendPos.x/2 + puck.x/2, y:currentPos.y};
    if(nextPos.x - defendPos.x > rink.goalWidth/2)
        nextPos.x = defendPos.x + rink.goalWidth/2;
    else if(defendPos.x - nextPos.x > rink.goalWidth/2)
        nextPos.x = defendPos.x - rink.goalWidth/2;

    nextPos = this.checkSide(rink, nextPos);
    p.updatePosition(rink, nextPos);
}

HockeyTeam.prototype.attackTopLeft = function(rink, puck){
}

HockeyTeam.prototype.attackTopRight = function(rink, puck){
}

HockeyTeam.prototype.attackCenterLeft = function(rink, puck){
    var goal = {x:rink.width/2, y:rink.behindGoalHeight};

    var p = this.players['lf'];
    var newPos = {x:puck.x - p.size/2, y:puck.y + p.size * 2};
    p.updatePosition(rink, this.checkSide(rink, newPos));

    p = this.players['rf'];
    if(puck.y > rink.attackBlueLine)
        newPos = {x: rink.width * 4/5, y:rink.attackBlueLine + p.size}
    else
        newPos = {x: rink.width - this.players['lf'].x, y:this.players['lf'].y*3/4 + rink.behindGoalHeight*1/4}
    p.updatePosition(rink, newPos);

    p = this.players['c'];
    newPos = {x: this.players['lf'].x/2 + this.players['rf'].x/2, y:this.players['lf'].y + p.size*3}
    p.updatePosition(rink, newPos);

    p = this.players['lb'];
    newPos = {x: this.players['lf'].x*2/3 + this.players['c'].x/3, y:this.players['lf'].y + p.size*10}
    p.updatePosition(rink, newPos);

    p = this.players['rb'];
    newPos = {x: this.players['rf'].x, y:this.players['lf'].y + p.size*7}
    p.updatePosition(rink, newPos);
}

HockeyTeam.prototype.attackCenterRight = function(rink, puck){
}

HockeyTeam.prototype.defendCenterLeft = function(rink, puck){
}

HockeyTeam.prototype.defendCenterRight = function(rink, puck){
    var p = this.players['c'];
    var newPos = {x:puck.x, y:puck.y + this.players['c'].size * 2};
    newPos = this.checkSide(rink, newPos);
    p.updatePosition(rink, newPos);
}

HockeyTeam.prototype.defendBottomLeft = function(rink, puck){
}

HockeyTeam.prototype.defendBottomRight = function(rink, puck){
}