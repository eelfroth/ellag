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

var gameloop;

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

function setup() {
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

    //update highscores
    if (time > best) {
        best = time;
        scorebest.innerHTML = best.toFixed(3);
        scorebest.classList.add("new");
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

class BouncyBounce {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.r = r;

        this.e = document.createElement('circle');
        this.e.style.width = r*2 +"px";
        this.e.style.height = r*2 +"px";
        this.e.style.left = x - r +"px";
        this.e.style.top = y - r +"px";
        document.body.appendChild(this.e);
    }
    
    destroy() {
        document.body.removeChild(this.e);
    }

    update() {
        this.vy += grav;
        this.x += this.vx;
        this.y += this.vy;

        //out of screen
        if (this.y-100 > window.innerHeight
         || this.y+3000 < 0
         || this.x-100 > window.innerWidth
         || this.x+100 < 0) {
            gameover();
        }

        for (var i=0; i<bouncies.length; i++) {
            if (bouncies[i] != this) {
                this.collide(bouncies[i]);
            }
        }

        this.e.style.left = this.x - this.r +"px";
        this.e.style.top = this.y - this.r +"px";
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    collide(o) {
        var d = this.dist(this.x, this.y, o.x, o.y);
        if (d <= this.r + o.r) {
            var overlap = (d - this.r - o.r) / 2;
            var nx = (o.x - this.x) / d;
            var ny = (o.y - this.y) / d;
            var p = 2 * (this.vx * nx + this.vy * ny - o.vx * nx - o.vy * ny) / (this.r + o.r);
            //move out of contact
            this.x -= overlap * (this.x - o.x) / d;
            this.y -= overlap * (this.y - o.y) / d;
            o.x -= overlap * (o.x - this.x) / d;
            o.y -= overlap * (o.y - this.y) / d;
            //bounce
            this.vx = this.vx - p * o.r * nx;
            this.vy = this.vy - p * o.r * ny;
            o.vx = o.vx + p * this.r * nx;
            o.vy = o.vy + p * this.r * ny;
        }
    }
}
