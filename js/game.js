// --- MAIN GAME CLASS ---
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.ctx.scale(SCALE, SCALE);
        this.ctx.imageSmoothingEnabled = false;

        this.input = new Input();
        this.renderer = new Renderer(this.ctx);
        this.camera = new Camera(LOGICAL_W, LOGICAL_H);
        this.player = new Player(10, 10);
        this.audio = new AudioManager();

        // Mobile audio unlock: init on first interaction
        this.input.onFirstInteraction = () => this.audio.init();

        this.ui = {
            setMessage: (msg) => {
                document.getElementById('message-box').innerText = msg;
            },
            setHUD: (msg) => {
                document.getElementById('hud').innerText = msg;
            }
        };

        this.currentStage = new StageIntro(this);
        this.currentStage.enter();

        this.lastTime = 0;
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    changeStage(newStage) {
        this.currentStage.exit();
        this.currentStage = newStage;
        this.currentStage.enter();
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Track previous position for footstep sounds
        const prevX = this.player.x;
        const prevY = this.player.y;

        this.currentStage.update();
        this.player.update(this.input, this.currentStage.solids, this.currentStage.mapW, this.currentStage.mapH);
        this.camera.follow(this.player, this.currentStage.mapW, this.currentStage.mapH);
        this.renderer.setCamera(this.camera);
        this.input.update();

        // Play footstep sounds when moving (throttled)
        if (this.currentStage.showPlayer) {
            const moved = Math.abs(this.player.x - prevX) > 0.1 || Math.abs(this.player.y - prevY) > 0.1;
            if (moved) {
                this.footstepCounter = (this.footstepCounter || 0) + 1;
                if (this.footstepCounter % 12 === 0) { // Every 12 frames (~5 footsteps per second)
                    this.audio.playFootstep();
                }
            }
        }

        this.currentStage.draw(this.renderer);
        if (this.currentStage.showPlayer) {
            this.renderer.drawPlayer(this.player.x, this.player.y, this.player.isIhram, this.player.isHairCut, this.player.pose);
        }

        requestAnimationFrame(this.loop);
    }
}
