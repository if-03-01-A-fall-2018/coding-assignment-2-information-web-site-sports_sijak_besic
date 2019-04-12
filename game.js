window.onload = function() {
  footBall.drawField();
}

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = 50;

var x_options = [3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5];

var dx = x_options[Math.floor(Math.random() * x_options.length)];
var dy = 5;

var ballRadius = 15;

var goal_height = 60;
var goal_width = 300;

var goalieHeight = 22;
var goalieWidth = 63;
var goalieX = (canvas.width-goalieWidth)/2;
var goalieY = (canvas.height - goal_height) - 30;

var goalkeeper_blocked = 0;
var goalkeeper_missed = 0;
var attempts_left = 5;

var attempt1 = true;
var attempt2 = false;
var attempt3 = false;
var attempt4=false;
var attempt5=false;

var footBall = {

    isShooting:false,

    nextShotTime:0,

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

    drawField: function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        footBall.shapes.ball();
        footBall.shapes.goal();
        footBall.shapes.goalie();
        footBall.shapes.score();
        footBall.shapes.missed();
        footBall.shapes.attempts();
    },

}
