const AttackL = 1;
const AttackR = 2;
const Center = 0;
const DefendL = -1;
const DefendR = -2;
    
function HockeyTeam(rink, color1, color2, home) {
    this.color1 = color1;
    this.color2 = color2;
    this.home = home;
    this.players = {};
    var roles = ['g', 'c', 'lf', 'rf', 'lb', 'rb'];
    roles.forEach(role => 
        this.players[role] = new HockeyPlayer(rink, color1, color2, role, home)
    );

    this.currentZone = Center;
}
  
HockeyTeam.prototype.draw = function(ctx, rink) {
    for(var role in this.players){
        this.players[role].draw(ctx, rink);
    }
}

HockeyTeam.prototype.update = function(rink, puck) {
    for(var role in this.players){
        this.players[role].update(rink, puck);
    }
}

HockeyTeam.prototype.determineZone = function(rink, puck){
    var zone = Center;
    if(puck.x > rink.width/3 && puck.x < rink.width*2/3 &&
        puck.y > rink.attackBlueLine/2 & puck.y < rink.heigth - rink.behindGoalHeight * 2)
        zone = Center;
    else{
        if(puck.y < rink.heigth/2){
            if(puck.x < rink.width/2)
                zone = AttackL;
            else
                zone = AttackR;
        }
        else{
            if(puck.x < rink.width/2)
                zone = DefendL;
            else
                zone = DefendR;
        }

    }
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

HockeyTeam.prototype.checkTeamSide = function(rink){
    for(var role in this.players){
        this.players[role].target = this.checkSide(rink, this.players[role].target);
    }
}

HockeyTeam.prototype.flip = function(rink, pos){
    var flipped = pos;
    flipped.x = rink.width/2 + rink.width/2 - pos.x;
    return flipped;
}

HockeyTeam.prototype.flipTeam = function(rink){
    var tmp = {x:this.players['lf'].target.x, y:this.players['lf'].target.y};
    this.players['lf'].updateTarget(rink, this.flip(rink, this.players['rf'].target));
    this.players['rf'].updateTarget(rink, this.flip(rink, tmp));
    
    tmp = {x:this.players['lb'].target.x, y:this.players['lb'].target.y};
    this.players['lb'].updateTarget(rink, this.flip(rink, this.players['rb'].target));
    this.players['rb'].updateTarget(rink, this.flip(rink, tmp));

    this.players['c'].updateTarget(rink, this.flip(rink, this.players['c'].target));
    this.players['g'].updateTarget(rink, this.flip(rink, this.players['g'].target));
}

HockeyTeam.prototype.updateTarget = function(rink, puck) {
    var puckPos = this.checkSide(rink, {x:puck.x, y:puck.y});
    this.currentZone = this.determineZone(rink, puckPos);

    this.setGoalieTarget(rink, puckPos);

    switch(this.currentZone){
        case AttackL:
            this.setTargetAttackLeft(rink, puckPos);
            break;
        case AttackR:
            this.setTargetAttackRight(rink, puckPos);
            break;
        case Center:
            this.setTargetCenter(rink, puckPos);
            break;
        case DefendL:
            this.setTargetDefendLeft(rink, puckPos);
            break;
        case DefendR:
            this.setTargetDefendRight(rink, puckPos);
            break;
    }
}

HockeyTeam.prototype.setGoalieTarget = function(rink, puck){
    var p = this.players['g'];
    var defendPos = {x:rink.width/2, y:rink.bottom - rink.behindGoalHeight}
    defendPos = this.checkSide(rink, defendPos);
    currentPos = this.checkSide(rink, p.pos);
    var puckPos = this.checkSide(rink, puck);
    if(puckPos.y < rink.defenseBlueLine)
        var nextPos = {x:rink.center.x, y:currentPos.y};
    else
        var nextPos = {x:defendPos.x/2 + puckPos.x/2, y:currentPos.y};
    if(nextPos.x - defendPos.x > rink.goalWidth/2)
        nextPos.x = defendPos.x + rink.goalWidth/2;
    else if(defendPos.x - nextPos.x > rink.goalWidth/2)
        nextPos.x = defendPos.x - rink.goalWidth/2;

    nextPos = this.checkSide(rink, nextPos);
    p.updateTarget(rink, nextPos);
}

HockeyTeam.prototype.checkLines = function(rink, puck, pos){
    var goodPos = pos;
    if(puck.y > rink.defenseBlueLine && pos.y < rink.heigth/2 + this.players['c'].size)
        goodPos.y = rink.heigth/2 + this.players['c'].size;
    else if(puck.y > rink.attackBlueLine && pos.y < rink.attackBlueLine + this.players['c'].size)
        goodPos.y = rink.attackBlueLine + this.players['c'].size;
    return goodPos;
}

HockeyTeam.prototype.setTargetAttackLeft = function(rink, puck){
    var p = this.players['lf'];
    var newPos = {x:puck.x - p.size/2, y:puck.y + p.size * 2};
    p.updateTarget(rink, this.checkSide(rink, newPos));

    p = this.players['rf'];
    newPos = {x: rink.width - this.players['lf'].target.x, y:this.players['lf'].target.y*3/4 + rink.behindGoalHeight*1/4}
    if(newPos.x - this.players['lf'].target.x < p.size*6)
        newPos.x = this.players['lf'].target.x + p.size * 6;
    p.updateTarget(rink, this.checkLines(rink, puck, newPos));

    p = this.players['c'];
    newPos = {x: (this.players['lf'].target.x + this.players['rf'].target.x)/2, y:this.players['lf'].target.y + p.size*3}
    if(newPos.y - this.players['lf'].target.y < p.size*6)
        newPos.y = this.players['lf'].target.y + p.size * 6;
    p.updateTarget(rink, this.checkLines(rink, puck, newPos));

    p = this.players['lb'];
    if(this.players['lf'].target.x <= rink.width/4)
        newPos = {x: (rink.width/2 + this.players['lf'].target.x)/2, y:this.players['lf'].target.y + p.size*10}
    else
        newPos = {x: this.players['lf'].target.x/2, y:this.players['lf'].target.y + p.size*10}
    p.updateTarget(rink, this.checkLines(rink, puck, newPos));

    p = this.players['rb'];
    if(this.players['rf'].target.x >= rink.width*3/4)
        newPos = {x: (this.players['rf'].target.x + this.players['c'].target.x)/2, y:this.players['lf'].target.y + p.size*10}
    else
        newPos = {x: (rink.width + this.players['rf'].target.x)/2, y:this.players['lf'].target.y + p.size*10}
    p.updateTarget(rink, this.checkLines(rink, puck, newPos));
}

HockeyTeam.prototype.setTargetCenter = function(rink, puck){
    var puckPos = this.checkSide(rink, puck);
    
    var p = this.players['c'];
    var newPos = {x:puckPos.x, y:puckPos.y + p.size*2};
    p.updateTarget(rink, newPos);

    p = this.players['lf'];
    newPos = {x:this.players['c'].target.x*1/4, y:this.players['c'].target.y - p.size*5};
    p.updateTarget(rink, this.checkLines(rink, puckPos, newPos));

    p = this.players['rf'];
    vanewPos = {x:rink.width - this.players['c'].target.x/4, y:this.players['c'].target.y - p.size*5};
    p.updateTarget(rink, this.checkLines(rink, puckPos, newPos));

    p = this.players['lb'];
    newPos = {x:this.players['c'].target.x/2, y:this.players['c'].target.y + p.size*7};
    p.updateTarget(rink, this.checkLines(rink, puckPos, newPos));

    p = this.players['rb'];
    newPos = {x:this.players['c'].target.x + (rink.width - this.players['c'].target.x)/2, y:this.players['c'].target.y + p.size*7};
    p.updateTarget(rink, this.checkLines(rink, puckPos, newPos));

    this.checkTeamSide(rink);
}

HockeyTeam.prototype.setTargetDefendLeft = function(rink, puck){
}

HockeyTeam.prototype.setTargetAttackRight = function(rink, puck){
    var puckFlipped = this.flip(rink, {x: puck.x, y:puck.y});
    this.setTargetAttackLeft(rink, puckFlipped);
    this.flipTeam(rink);
}

HockeyTeam.prototype.setTargetDefendRight = function(rink, puck){
    var puckFlipped = this.flip(rink, {x: puck.x, y:puck.y});
    this.setTargetdefendLeft(rink, puckFlipped);
    this.flipTeam(rink);
}
