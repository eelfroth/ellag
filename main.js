var player;
var bouncies;
var mouseX;
var mouseY;
var grav = 0.5;
var score = 0;

document.onmousemove = mousemove;

function mousemove(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function setup() {
    player = new BouncyBounce(window.innerWidth/2, window.innerHeight/2, 50, 100);
    mouseX = window.innerWidth/2;
    mouseY = window.innerHeight/1.5;
    bouncies = new Array();
    bouncies.push(player);
    bouncies.push(new BouncyBounce(window.innerWidth/2, 20, 20, 10));
}

function update() {
    player.vx = (player.vx + (mouseX - player.x)*.5)/2;
    player.vy = (player.vy + (mouseY - player.y)*.5)/2 - grav;

    for (var i=0; i<bouncies.length; i++) {
        bouncies[i].update();
    }
}

class BouncyBounce {
    constructor(x, y, r, m) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.r = r;
        this.m = m;

        this.e = document.createElement('circle');
        this.e.style.width = r*2 +"px";
        this.e.style.height = r*2 +"px";
        document.body.appendChild(this.e);
    }

    update() {
        this.vy += grav;
        this.x += this.vx;
        this.y += this.vy;
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

setup();
setInterval(update, 16);
