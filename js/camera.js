// --- CAMERA ---
class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }

    follow(target, mapW, mapH) {
        this.x = target.x - this.width / 2 + target.w / 2;
        this.y = target.y - this.height / 2 + target.h / 2;
        this.x = Math.max(0, Math.min(this.x, mapW - this.width));
        this.y = Math.max(0, Math.min(this.y, mapH - this.height));
    }
}
