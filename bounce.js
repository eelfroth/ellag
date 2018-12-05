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
            //play sound
            if(Math.abs(overlap) > 0.3) {
                var gain = Math.min((Math.abs(overlap)-0.3) / 10, 1);
                var pan = (this.x / window.innerWidth -0.5);
                switch (Math.floor(Math.random()*4)) {
                    case 0: playSound(sounds.tock1, gain, pan); break;
                    case 1: playSound(sounds.tock2, gain, pan); break;
                    case 2: playSound(sounds.tock3, gain, pan); break;
                    case 3: playSound(sounds.tock4, gain, pan); break;
                }
            }
        }
    }
}
