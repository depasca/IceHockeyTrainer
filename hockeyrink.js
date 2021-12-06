function HockeyRink(offsetx, offsety, w, h) {
        //anchors
        this.left = offsetx;
        this.top = offsety;
        
        //dimensions
        this.width = 98;
        this.heigth = 200;
        this.circleRadius = 15;
        this.cornerRadius = 28;
        this.goalWidth = 6;
        this.goalLineOffsetH = this.width * 0.05;
        this.behindGoalHeight = 13;
        this.borderToBullyW = 24;
        this.borderToBullyH = 35;
        this.bottom = this.top + this.heigth;
        this.right = this.left + this.width;
        this.center = {x:this.width/2, y:this.heigth/2};
        this.middle = {x:this.left + this.center.x, y:this.top+this.center.y};
        this.defenseBlueLine = this.center.y + 2 * this.circleRadius;
        this.attackBlueLine = this.center.y - 2 * this.circleRadius;
        this.scale(w, h);
}

HockeyRink.prototype.scale = function(w, h){
        let factor = 1;
        if(w/h > 85/200)
                factor = h/200;
        else
                factor = w/98;

        this.width = Math.floor(this.width * factor);
        this.heigth = Math.floor(this.heigth * factor);
        this.circleRadius = Math.floor(this.circleRadius * factor);
        this.cornerRadius = Math.floor(this.cornerRadius * factor);
        this.goalWidth = Math.floor(this.goalWidth * factor);
        this.behindGoalHeight = Math.floor(this.behindGoalHeight * factor);
        this.borderToBullyW = Math.floor(this.borderToBullyW * factor);
        this.borderToBullyH = Math.floor(this.borderToBullyH * factor);
        this.goalLineOffsetH = Math.ceil(this.goalLineOffsetH * factor);
        
        this.bottom = this.top + this.heigth;
        this.right = this.left + this.width;
        this.center = {x:this.width/2, y:this.heigth/2};
        this.middle = {x:this.left + this.center.x, y:this.top+this.center.y};
        this.defenseBlueLine = this.center.y + 2 * this.circleRadius;
        this.attackBlueLine = this.center.y - 2 * this.circleRadius;
}

HockeyRink.prototype.draw = function(ctx, w, h) {
        ctx.globalAlpha = 0.3;
        //red middle line
        ctx.lineWidth = "5";
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(this.left, this.middle.y);
        ctx.lineTo(this.right, this.middle.y);
        ctx.stroke();

        //blue lines
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.moveTo(this.left, this.top + this.attackBlueLine);
        ctx.lineTo(this.right, this.top + this.attackBlueLine);
        ctx.moveTo(this.left, this.top + this.defenseBlueLine);
        ctx.lineTo(this.right, this.top + this.defenseBlueLine);
        ctx.stroke();

        //goal lines
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.left + this.goalLineOffsetH, this.top + this.behindGoalHeight);
        ctx.lineTo(this.right - this.goalLineOffsetH, this.top + this.behindGoalHeight);
        ctx.moveTo(this.left + this.goalLineOffsetH, this.bottom - this.behindGoalHeight);
        ctx.lineTo(this.right - this.goalLineOffsetH, this.bottom - this.behindGoalHeight);
        ctx.stroke();

        //circles
        ctx.beginPath();
        ctx.arc(this.middle.x, this.middle.y, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.top + this.borderToBullyH, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.top + this.borderToBullyH, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.bottom - this.borderToBullyH, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.bottom -  this.borderToBullyH, this.circleRadius, 0, 2 * Math.PI);
        ctx.stroke();

        //bully centers
        ctx.beginPath();
        ctx.arc(this.middle.x, this.middle.y, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.top + this.borderToBullyH, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.top + this.attackBlueLine + this.circleRadius/3, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.top + this.borderToBullyH, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.top + this.attackBlueLine + this.circleRadius/3, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.bottom - this.borderToBullyH, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.borderToBullyW, this.bottom - this.attackBlueLine - this.circleRadius/3, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.bottom - this.borderToBullyH, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.borderToBullyW, this.bottom - this.attackBlueLine - this.circleRadius/3, 4, 0, 2 * Math.PI);
        ctx.stroke();

        //goals
        ctx.beginPath();
        ctx.arc(this.middle.x, this.top + this.behindGoalHeight, this.goalWidth, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.middle.x, this.bottom - this.behindGoalHeight, this.goalWidth, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(this.middle - this.goalWidth/2, this.top + this.behindGoalHeight - this.goalWidth/3, this.goalWidth, this.goalWidth/3);
        ctx.stroke();


        ctx.globalAlpha = 1;

        //outer border
        ctx.lineWidth = "5";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.left, this.top + this.cornerRadius);
        ctx.lineTo(this.left, this.bottom - this.cornerRadius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.right, this.top + this.cornerRadius);
        ctx.lineTo(this.right, this.bottom - this.cornerRadius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.left + this.cornerRadius, this.top);
        ctx.lineTo(this.right - this.cornerRadius, this.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.left + this.cornerRadius, this.bottom);
        ctx.lineTo(this.right - this.cornerRadius, this.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.left + this.cornerRadius, this.top + this.cornerRadius, this.cornerRadius, Math.PI, 3*Math.PI/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.cornerRadius, this.top + this.cornerRadius, this.cornerRadius, 3*Math.PI/2, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.left + this.cornerRadius, this.bottom - this.cornerRadius, this.cornerRadius, Math.PI/2, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.right - this.cornerRadius, this.bottom - this.cornerRadius, this.cornerRadius, 0, Math.PI/2);
        ctx.stroke();

}
    