var player;
var ball;
var bouncies = [];
var mouseX = window.innerWidth/2;
var mouseY = window.innerHeight/1.5;
var grav = 0.5;

var time = 0;
var best = 0;
var alltime = 0;
if (localStorage && 'alltime' in localStorage) {
    alltime = parseFloat(localStorage.alltime);
}

var gameloop = "done";

//scoreboard
var menu = document.createElement("menu");
var slab = document.createElement("slab");
slab.innerHTML = "<span>∃ </span><br/>";
slab.onclick = setup;
var scorecurrent = document.createElement("score");
var scorebest = document.createElement("score");
var scorealltime = document.createElement("score");
scorecurrent.innerHTML = time.toFixed(3);;
scorealltime.innerHTML = alltime.toFixed(3);
scorebest.innerHTML = best.toFixed(3);
scorecurrent.classList.add("lb");
scorebest.classList.add("rb");
scorealltime.classList.add("rt");
slab.appendChild(scorecurrent);
slab.appendChild(scorebest);
slab.appendChild(scorealltime);
menu.appendChild(slab);
document.body.appendChild(menu);

//cursor position
document.onmousemove = mousemove;
function mousemove(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}
document.ontouchmove = touchmove;
function touchmove(e) {
    mouseX = e.touches[0].pageX;
    mouseY = e.touches[0].pageY;
}

//sound effects
loadSound("highscore", "./audio/highscore.wav");
loadSound("gameover", "./audio/gameover.wav");
loadSound("tock1", "./audio/tock1.wav");
loadSound("tock2", "./audio/tock2.wav");
loadSound("tock3", "./audio/tock3.wav");
loadSound("tock4", "./audio/tock4.wav");

function setup() {
    if (gameloop !== "done") return;

    menu.classList.add("inactive");
    document.body.style.cursor = "none";
    scorebest.classList.remove("new");
    scorealltime.classList.remove("new");

    player = new BouncyBounce(mouseX, mouseY, 80);
    ball = new BouncyBounce(window.innerWidth/2, 20, 32);
    ball.vx = Math.random() * 6 - 3;
    bouncies.push(player);
    bouncies.push(ball);

    time = 0;

    gameloop = setInterval(update, 16);
}

function update() {
    player.vx = (player.vx + (mouseX - player.x)*.5)/2;
    player.vy = (player.vy + (mouseY - player.y - player.r/2)*.5)/2 - grav;

    //shrinking
    player.r = Math.max(player.r - 16/1000, 16);
    ball.r = Math.max(ball.r - 8/1000, 8);
    player.e.style.width = player.r*2 +"px";
    player.e.style.height = player.r*2 +"px";
    ball.e.style.width = ball.r*2 +"px";
    ball.e.style.height = ball.r*2 +"px";

    for (var i=0; i<bouncies.length; i++) {
        bouncies[i].update();
    }

    if (gameloop !== "done") {
        time += 16/1000;
        scorecurrent.innerHTML = time.toFixed(3);
    }
}

function gameover() {
    window.clearInterval(gameloop);
    gameloop = "done";
    playSound(sounds.gameover);

    //update highscores
    if (time > best) {
        best = time;
        scorebest.innerHTML = best.toFixed(3);
        scorebest.classList.add("new");
        playSound(sounds.highscore);
        if (time > alltime) {
            alltime = time;
            scorealltime.innerHTML = alltime.toFixed(3);
            localStorage && (localStorage.alltime = alltime);
            scorealltime.classList.add("new");
            scorebest.classList.remove("new");
        }
    }

    menu.classList.remove("inactive");
    document.body.style.cursor = "auto";
    
    for (var i=0; i<bouncies.length; i++) {
        bouncies[i].destroy();
    }
    bouncies = [];
}
