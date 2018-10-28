var player;
var bouncies;

let grav = 0.5;

function setup() {
    createCanvas(450, 800);
    player = new BouncyBounce(width/2, height/2, 50);
    bouncies = new Array();
    bouncies.push(player);
    bouncies.push(new BouncyBounce(width/2, 0, 20));
}

function draw() {
    player.vx = (mouseX - player.x);
    player.vy = (mouseY - player.y) - grav;

    fill(0, 48);
    stroke(255);
    strokeWeight(2);

    rect(0, 0, width-1, height-1);

    for (var i=0; i<bouncies.length; i++) {
        bouncies[i].update();
        bouncies[i].display();
    }

    fill(0);
    strokeWeight(0);
    rect(14, 5, 60, 30);
    fill(255);
    text("fR: "+round(frameRate()), 20, 20);
}


class BouncyBounce {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0;
        this.vy = 0;
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
    }

    display() {
        ellipse(this.x, this.y, this.radius*2, this.radius*2);
    }
    
    collide(other) {
        if (dist(this.x, this.y, other.x, other.y) < this.radius + other.radius) {
            this.vx = (this.x - other.x)/3;
            this.vy = (this.y - other.y)/3;
        }
    }
}
