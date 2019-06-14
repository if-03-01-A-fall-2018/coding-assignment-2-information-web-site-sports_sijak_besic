
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

var goalieHeight = 20;
var goalieWidth = 70;
var goalieX = (canvas.width-goalieWidth)/2;
var goalieY = (canvas.height - goal_height) - 30;

var rightPressed = false;
var leftPressed = false;

var goalkeeper_blocked = 0;
var goalkeeper_missed = 0;
var attempts_left = 5;

var points=0;
var delayNextShot=4000;
var playerName;

var footBall = {

    isShooting:false,

    nextShotTime:0,

    shapes : {
        ball: function (){
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        },

        goal : function (){
            ctx.beginPath();
            ctx.rect((canvas.width - goal_width) / 2 , canvas.height - goal_height, goal_width, goal_height);
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
        },

        goalie : function(){
            ctx.beginPath();
            ctx.rect(goalieX, goalieY, goalieWidth, goalieHeight);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        },

        score : function(){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Kept: "+goalkeeper_blocked, 8, 20);
        },

        missed : function(){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Conceded: "+goalkeeper_missed, 8, 40);
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
        points=points+(goalkeeper_blocked*2-goalkeeper_missed);
        footBall.resetShapePositions();
        if(goalkeeper_missed > goalkeeper_blocked){
            SavePlayer(playerName,points);
            alert("GAME OVER! YOU HAVE LOST!, "+playerName+" POINTS: "+points);
            window.location.replace("main.html");
        }
        else
        {
            if(delayNextShot<600)
            {
              SavePlayer(playerName,points);
              alert("YOU ARE FINISHED! CONGRATULATIONS "+playerName+ "! TOTAL POINTS: "+points);
              delayNextShot=4000;
              window.location.replace("main.html");
            }
            else
            {

              delayNextShot=delayNextShot-500;
              alert("YOU HAVE WON!, "+playerName+ " NOW ITS GETTING HARDER! POINTS: "+points);

              attempts_left=5;
              goalkeeper_blocked = 0;
              goalkeeper_missed = 0;
              rightPressed = false;
              leftPressed = false;
          }
        }
    },

    resetShapePositions : function(){
        x = canvas.width/2;
        y = 50;

        dx = x_options[Math.floor(Math.random() * x_options.length)];
        dy = 5;

        goalieX = (canvas.width-goalieWidth)/2;

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

    draw : function(currentTime){
        if(rightPressed && goalieX < canvas.width-goalieWidth) {
            goalieX += 7;
        }
        else if(leftPressed && goalieX > 0) {
          goalieX -= 7;
        }

        footBall.drawField();

        if(!footBall.isShooting){
            if(currentTime>footBall.nextShotTime){
                footBall.isShooting=true;
            }else{
                requestAnimationFrame(footBall.draw);
                return;
            }
        }

        x += dx;
        y += dy;
        if(y + dy > canvas.height - goal_height) {

            footBall.isShooting=false;
            footBall.nextShotTime=currentTime+delayNextShot;

            attempts_left--;
            goalkeeper_missed++;
            if (!attempts_left){
                footBall.calculateScore();
            }
            else {
                footBall.resetShapePositions();
            }

        }
        else if (x  > goalieX && x  < goalieX + goalieWidth && y + dy > goalieY - ballRadius){

            footBall.isShooting=false;
            footBall.nextShotTime=currentTime+delayNextShot;

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

function SavePlayer(playername,points){
  var data={"name":playername,"points":points};

  fetch('http://localhost:3000/scores',{
    method:'POST',
    body:JSON.stringify(data),
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json'
    }
  }).then(res=>res.json())
  .then(response=>console.log('Sucess:',JSON.stringify(data)))
  .catch(error=>console.error('Error:',error));
}

playerName=prompt("Enter your name!");
footBall.drawField();
footBall.nextShotTime=delayNextShot;
requestAnimationFrame(footBall.draw);


document.addEventListener("keydown", footBall.controls.keyDownHandler, false);
document.addEventListener("keyup", footBall.controls.keyUpHandler, false);
