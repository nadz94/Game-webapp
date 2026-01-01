// --- GAME ENTITIES ---
class Sign {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.w = 16;
        this.h = 20;
    }
    draw(renderer) {
        renderer.drawSign(this.x, this.y, this.text);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.speed = 1.5;
        this.isIhram = false;
        this.isHairCut = false;
        this.pose = 'stand';
    }

    update(input, solids, mapW, mapH) {
        if (this.pose === 'pray' || this.pose === 'sleep') return;

        let dx = 0;
        let dy = 0;

        if (input.isDown('ArrowUp')) dy -= this.speed;
        if (input.isDown('ArrowDown')) dy += this.speed;
        if (input.isDown('ArrowLeft')) dx -= this.speed;
        if (input.isDown('ArrowRight')) dx += this.speed;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        this.x += dx;
        if (this.checkCollision(solids)) this.x -= dx;

        this.y += dy;
        if (this.checkCollision(solids)) this.y -= dy;

        this.x = Math.max(0, Math.min(this.x, mapW - this.w));
        this.y = Math.max(0, Math.min(this.y, mapH - this.h));
    }

    checkCollision(solids) {
        for (let s of solids) {
            if (this.x < s.x + s.w &&
                this.x + this.w > s.x &&
                this.y < s.y + s.h &&
                this.y + this.h > s.y) {
                return true;
            }
        }
        return false;
    }
}
