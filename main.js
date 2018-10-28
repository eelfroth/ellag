var player;
var bouncies = [];
var mouseX = window.innerWidth/2;
var mouseY = window.innerHeight/1.5;
var grav = 0.5;
var score = 0;

var gameloop;

var menu = document.createElement("menu");
var respawn = document.createElement("menubutton");
respawn.innerHTML = "∃  ";
respawn.onclick = setup;
menu.appendChild(respawn);
document.body.appendChild(menu);

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

    player = new BouncyBounce(mouseX, mouseY, 64);
    var ball = new BouncyBounce(window.innerWidth/2, 20, 32);
    ball.vx = Math.random() * 6 - 3;
    bouncies.push(player);
    bouncies.push(ball);

    gameloop = setInterval(update, 16);
}

function update() {
    player.vx = (player.vx + (mouseX - player.x)*.5)/2;
    player.vy = (player.vy + (mouseY - player.y)*.5)/2 - grav;

    for (var i=0; i<bouncies.length; i++) {
        bouncies[i].update();
    }
}

function gameover() {
    window.clearInterval(gameloop);

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
        if (this.y-100 > window.innerHeight) {
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
        if (d < this.r + o.r) {
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
