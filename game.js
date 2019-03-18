
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

//Sets the original position of the ball
var x = canvas.width/2;
var y = 50;

// Defines  values that will be added to the position of x and y values
// List of possible values for the x position
var x_options = [3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5];

var dx = x_options[Math.floor(Math.random() * x_options.length)];
var dy = 5;

var ballRadius = 10;

// Defines the height and width of the goal
var goal_height = 40;
var goal_width = 200

// Defines the height, width and position of goalie
var goalieHeight = 20;
var goalieWidth = 40;
var goalieX = (canvas.width-goalieWidth)/2;
var goalieY = (canvas.height - goal_height) - 30;

// Set to false by default
var rightPressed = false;
var leftPressed = false;

var goalkeeper_blocked = 0;
var goalkeeper_missed = 0;
var attempts_left = 5;

var attempt1 = true;
var attempt2 = false;
var attempt3 = false;
var attempt4=false;
var attempt5=false;

var footBall = {

    // is a shot in progress
    isShooting:false,

    // time when next shot will run
    nextShotTime:0,

    // delay until next shot will run
    delayUntilNextShot:4000,

    shapes : {
        ball: function (){
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        },

        goal : function (){
            ctx.beginPath();
            ctx.rect((canvas.width - goal_width) / 2 , canvas.height - goal_height, goal_width, goal_height);
            ctx.strokeStyle = "#000000";
            ctx.stroke();
            ctx.closePath();
        },

        goalie : function(){
            ctx.beginPath();
            ctx.rect(goalieX, goalieY, goalieWidth, goalieHeight);
            ctx.fillStyle = "#666666";
            ctx.fill();
            ctx.closePath();
        },

        score : function(){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Score: "+goalkeeper_blocked, 8, 20);
        },

        missed : function(){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Missed: "+goalkeeper_missed, 8, 40);
        },

        attempts : function(){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Attempts left: "+attempts_left, canvas.width-110, 20);
        }


    },

    controls : {
        keyDownHandler : function (e){
            if(e.keyCode == 39) {
                rightPressed = true;
            }
            else if(e.keyCode == 37) {
                leftPressed = true;
            }

        },

        keyUpHandler : function(e){
            if(e.keyCode == 39) {
                rightPressed = false;
            }
            else if(e.keyCode == 37) {
                leftPressed = false;
            }

        }

    },

    calculateScore : function(){
        if(goalkeeper_missed > goalkeeper_blocked){
            alert("GAME OVER! YOU HAVE LOST!");
            document.location.reload();

        } else {
            alert("GAME OVER! YOU HAVE WON!");
            document.location.reload();
        }
    },

    resetShapePositions : function(){
        //Sets the original position of the ball
        x = canvas.width/2;
        y = 50;

        // Sets a new shooting path
        dx = x_options[Math.floor(Math.random() * x_options.length)];
        dy = 5;

        // Resets the goalie to the middle
        goalieX = (canvas.width-goalieWidth)/2;

    },

    drawField: function(){
        // This ensures that the ball doesn't leave a trail
        // Clears the canvas of this shape each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draws shapes on the canvas
        footBall.shapes.ball();
        footBall.shapes.goal();
        footBall.shapes.goalie();
        footBall.shapes.score();
        footBall.shapes.missed();
        footBall.shapes.attempts();
    },

    draw : function(currentTime){

        //   makes paddle move left and right and only within the canvas
        if(rightPressed && goalieX < canvas.width-goalieWidth) {
            goalieX += 7;
        }
        else if(leftPressed && goalieX > 0) {
          goalieX -= 7;
        }

        // draw the scene
        footBall.drawField();

        // delay until next shot time is due
        if(!footBall.isShooting){
            // time has elapsed, let's shoot again
            if(currentTime>footBall.nextShotTime){
                footBall.isShooting=true;
            }else{
                // time has not elapsed, just request another loop
                requestAnimationFrame(footBall.draw);
                return;
            }
        }

        // adds values to the balls  x and y position every frame
        x += dx;
        y += dy;

        // Ball hits the goal
        if(y + dy > canvas.height - goal_height) {

            // end the shot
            footBall.isShooting=false;
            // delay the next shot
            footBall.nextShotTime=currentTime+footBall.delayUntilNextShot;

            attempts_left--;
            goalkeeper_missed++;
            if (!attempts_left){
                footBall.calculateScore();
            }
            else {
                footBall.resetShapePositions();
            }

        } // Ball saved by goalie
        else if (x  > goalieX && x  < goalieX + goalieWidth && y + dy > goalieY - ballRadius){

            // end the shot
            footBall.isShooting=false;
            // delay the next shot
            footBall.nextShotTime=currentTime+footBall.delayUntilNextShot;

            attempts_left--;
            goalkeeper_blocked++;

            if (!attempts_left){
                footBall.calculateScore();
            }
            else {
                footBall.resetShapePositions();

            }

        }

        requestAnimationFrame(footBall.draw);
    }

}

footBall.drawField();
footBall.nextShotTime=footBall.delayUntilNextShot;
requestAnimationFrame(footBall.draw);


// Defines what functions are fired when keydown or keyup event triggers
document.addEventListener("keydown", footBall.controls.keyDownHandler, false);
document.addEventListener("keyup", footBall.controls.keyUpHandler, false);
