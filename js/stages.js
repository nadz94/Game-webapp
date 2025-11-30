// --- STAGES ---
class Stage {
    constructor(game) {
        this.game = game;
        this.solids = [];
        this.mapW = LOGICAL_W;
        this.mapH = LOGICAL_H;
        this.showPlayer = true;
    }
    enter() { }
    update() { }
    draw(renderer) { }
    exit() { }
}

class StageIntro extends Stage {
    constructor(game) {
        super(game);
        this.showPlayer = false;
    }
    enter() {
        this.game.ui.setMessage("Welcome. Press SPACE to begin your journey.");
        this.game.ui.setHUD("");
    }
    update() {
        if (this.game.input.isJustPressed('Space')) {
            this.game.changeStage(new StageMeeqat(this.game));
        }
    }
    draw(renderer) {
        renderer.clear('#000');
        renderer.ctx.fillStyle = '#fff';
        renderer.ctx.textAlign = 'center';

        // Title
        renderer.ctx.font = '6px "Press Start 2P"';
        renderer.ctx.fillText("THE PIXEL HAJJ JOURNEY", LOGICAL_W / 2, 40);

        // Subtitle
        renderer.ctx.font = '4px "Press Start 2P"';
        renderer.ctx.fillStyle = '#ffd700';
        renderer.ctx.fillText("Hajj al-Tamattu'", LOGICAL_W / 2, 55);

        // Context Text
        renderer.ctx.font = '3.5px "Press Start 2P"';
        renderer.ctx.fillStyle = '#aaa';
        renderer.ctx.fillText("You have already completed your Umrah.", LOGICAL_W / 2, 70);
        renderer.ctx.fillText("Now, you are about to begin your Hajj.", LOGICAL_W / 2, 80);

        // Prompt
        renderer.ctx.fillStyle = '#fff';
        renderer.ctx.font = '3.5px "Press Start 2P"';
        renderer.ctx.fillText("[PRESS SPACE TO START]", LOGICAL_W / 2, 100);

        renderer.ctx.textAlign = 'left'; // Reset
    }
}

class StageMeeqat extends Stage {
    constructor(game) {
        super(game);
        this.rug = { x: 60, y: 60, w: 20, h: 30 };
    }
    enter() {
        this.game.player.x = 20;
        this.game.player.y = 60;
        this.game.ui.setMessage("Stage 1: The Meeqat. Walk to the rug and press SPACE to make Niyyah.");
        this.game.ui.setHUD("");
    }
    update() {
        if (this.game.input.isJustPressed('Space')) {
            const p = this.game.player;
            const r = this.rug;
            if (p.x < r.x + r.w + 10 && p.x + p.w > r.x - 10 &&
                p.y < r.y + r.h + 10 && p.y + p.h > r.y - 10) {
                this.game.player.isIhram = true;
                this.game.ui.setMessage("Labbayka Hajjan! (Here I am for Hajj)");
                setTimeout(() => {
                    this.game.ui.setMessage("Ihram donned. Intention made. Go forth!");
                }, 1500);
                setTimeout(() => { this.game.changeStage(new StageMina(this.game)); }, 3500);
            }
        }
    }
    draw(renderer) {
        // 1. Floor (Carpet)
        renderer.clear(COLORS.CARPET_RED);
        // Carpet rows (Saff)
        for (let y = 50; y < this.mapH; y += 20) {
            renderer.rect(0, y, this.mapW, 2, COLORS.CARPET_PATTERN);
        }

        // 2. Walls
        // Back wall
        renderer.rect(0, 0, this.mapW, 40, COLORS.WALL_CREAM);
        // Decorative stripe on wall
        renderer.rect(0, 30, this.mapW, 2, '#d4c5b0');

        // Mihrab (Niche) - Centered
        const mx = this.mapW / 2 - 12;
        const my = 10;
        renderer.rect(mx, my, 24, 30, '#d4c5b0'); // Outline
        renderer.rect(mx + 2, my + 4, 20, 26, '#e0d0b0'); // Inner
        renderer.rect(mx + 4, my + 8, 16, 22, '#c0b090'); // Deep niche
        // Arch top for Mihrab
        renderer.rect(mx + 4, my + 8, 2, 2, '#a09070');
        renderer.rect(mx + 18, my + 8, 2, 2, '#a09070');
        renderer.rect(mx + 6, my + 6, 12, 2, '#a09070');

        // Windows/Arches on back wall (Skip center for Mihrab)
        for (let i = 10; i < this.mapW; i += 40) {
            if (Math.abs(i - (this.mapW / 2 - 10)) < 30) continue; // Skip if near Mihrab
            renderer.rect(i, 5, 20, 25, '#d4c5b0'); // Arch outline
            renderer.rect(i + 2, 7, 16, 23, COLORS.WINDOW_BLUE); // Window pane
            renderer.rect(i + 10, 7, 1, 23, '#334455'); // Bar V
            renderer.rect(i + 2, 18, 16, 1, '#334455'); // Bar H
        }

        // 3. Pillars
        const pillarY = 35;
        for (let i = 30; i < this.mapW; i += 60) {
            if (Math.abs(i - (this.mapW / 2)) < 20) continue; // Don't block Mihrab view
            // Base
            renderer.rect(i - 4, pillarY + 80, 16, 8, '#c0c0c0');
            // Shaft
            renderer.rect(i, 0, 8, pillarY + 80, COLORS.PILLAR_MARBLE);
            // Detail lines
            renderer.rect(i + 2, 0, 1, pillarY + 80, '#f0f0f0');
            renderer.rect(i + 5, 0, 1, pillarY + 80, '#cccccc');
        }

        // 4. Interaction Rug (The specific one for Niyyah)
        // Fringes
        renderer.rect(this.rug.x, this.rug.y - 2, this.rug.w, 2, COLORS.RUG_GOLD);
        renderer.rect(this.rug.x, this.rug.y + this.rug.h, this.rug.w, 2, COLORS.RUG_GOLD);

        // Base
        renderer.rect(this.rug.x, this.rug.y, this.rug.w, this.rug.h, COLORS.RUG_GREEN);

        // Inner Arch Design
        renderer.rect(this.rug.x + 3, this.rug.y + 3, 2, this.rug.h - 6, '#008000'); // Left border
        renderer.rect(this.rug.x + this.rug.w - 5, this.rug.y + 3, 2, this.rug.h - 6, '#008000'); // Right border
        renderer.rect(this.rug.x + 3, this.rug.y + 3, this.rug.w - 6, 2, '#008000'); // Top border
        renderer.rect(this.rug.x + 3, this.rug.y + this.rug.h - 5, this.rug.w - 6, 2, '#008000'); // Bottom border

        // Arch top
        renderer.rect(this.rug.x + 5, this.rug.y + 6, this.rug.w - 10, 2, COLORS.RUG_GOLD);
        renderer.rect(this.rug.x + 8, this.rug.y + 4, this.rug.w - 16, 2, COLORS.RUG_GOLD);

        // Highlight if player is close
        const p = this.game.player;
        const r = this.rug;
        if (p.x < r.x + r.w + 10 && p.x + p.w > r.x - 10 &&
            p.y < r.y + r.h + 10 && p.y + p.h > r.y - 10) {
            renderer.rect(this.rug.x - 2, this.rug.y - 2, this.rug.w + 4, 2, '#ffd700');
            renderer.rect(this.rug.x - 2, this.rug.y + this.rug.h, this.rug.w + 4, 2, '#ffd700');
            renderer.rect(this.rug.x - 2, this.rug.y, 2, this.rug.h, '#ffd700');
            renderer.rect(this.rug.x + this.rug.w, this.rug.y, 2, this.rug.h, '#ffd700');
        }
    }
}

class StageMina extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 400;
        this.mapH = 400;
        this.tents = [];
        this.prayers = 0;
        this.maxPrayers = 5;
        this.prayerProgress = 0;
        this.maxPrayerProgress = 100;

        // Generate non-overlapping tents
        let attempts = 0;
        while (this.tents.length < 20 && attempts < 1000) {
            let t = {
                x: Math.random() * (this.mapW - 60) + 10, // Padding
                y: Math.random() * (this.mapH - 60) + 10,
                w: 32, h: 32,
                isTarget: false,
                visited: false
            };

            let overlap = false;
            for (let other of this.tents) {
                // Check distance or bounding box with padding
                if (t.x < other.x + other.w + 10 && t.x + t.w + 10 > other.x &&
                    t.y < other.y + other.h + 10 && t.y + t.h + 10 > other.y) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                this.tents.push(t);
            }
            attempts++;
        }
        let targets = 0;
        while (targets < 5) {
            let t = this.tents[Math.floor(Math.random() * this.tents.length)];
            if (!t.isTarget) { t.isTarget = true; targets++; }
        }
        this.solids = [];
    }
    enter() {
        this.game.player.x = 10;
        this.game.player.y = 10;
        this.game.ui.setMessage("Stage 2: Mina (8th Dhul Hijjah). Find 5 tents with rugs and HOLD SPACE to Pray.");
        this.game.ui.setHUD(`Prayers: ${this.prayers}/${this.maxPrayers}`);
    }
    update() {
        const p = this.game.player;
        let onRug = false;

        for (let t of this.tents) {
            if (t.isTarget && !t.visited &&
                p.x < t.x + t.w && p.x + p.w > t.x &&
                p.y < t.y + t.h && p.y + p.h > t.y) {

                onRug = true;

                if (this.game.input.isDown('Space')) {
                    this.game.player.pose = 'pray';
                    this.prayerProgress += 1.0; // Adjust speed as needed

                    // Visual feedback in HUD
                    this.game.ui.setHUD(`Praying: ${Math.floor(this.prayerProgress)}%`);

                    if (this.prayerProgress >= this.maxPrayerProgress) {
                        t.visited = true;
                        this.prayers++;
                        this.prayerProgress = 0;
                        this.game.ui.setHUD(`Prayers: ${this.prayers}/${this.maxPrayers}`);
                        this.game.ui.setMessage("Prayer completed.");

                        if (this.prayers >= this.maxPrayers) {
                            this.game.ui.setMessage("All prayers done. Proceeding to Arafah...");
                            setTimeout(() => { this.game.changeStage(new StageArafah(this.game)); }, 2000);
                        }
                    }
                } else {
                    // Reset progress if key released? Or keep it? 
                    // Let's reset for "Hold to pray" feel, or maybe decay?
                    // Resetting is simpler and encourages commitment.
                    this.prayerProgress = 0;
                    this.game.ui.setHUD(`Prayers: ${this.prayers}/${this.maxPrayers}`);
                }
                break; // Only interact with one at a time
            }
        }

        if (!onRug) {
            this.prayerProgress = 0;
            if (this.game.player.pose === 'pray') {
                this.game.player.pose = 'stand';
            }
        } else if (!this.game.input.isDown('Space')) {
            this.game.player.pose = 'stand';
        }
    }
    draw(renderer) {
        renderer.clear(COLORS.SAND);

        // Pavement/Paths - Use rect to handle camera offset
        // Horizontal paths
        renderer.rect(0, 100, 400, 20, COLORS.PAVEMENT);
        renderer.rect(0, 300, 400, 20, COLORS.PAVEMENT);
        // Vertical paths
        renderer.rect(100, 0, 20, 400, COLORS.PAVEMENT);
        renderer.rect(300, 0, 20, 400, COLORS.PAVEMENT);

        // Sort tents by Y to draw them in correct depth order
        this.tents.sort((a, b) => a.y - b.y);

        for (let t of this.tents) {
            renderer.drawTent(t.x, t.y);
            // Draw rug in front of tent if target
            if (t.isTarget) {
                // Draw a mini version of the prayer rug
                // If visited, maybe dim it or remove it? Let's keep it but maybe change color?
                // Or just keep it as is, but it's no longer interactive.
                let rugColor = t.visited ? '#555' : COLORS.RUG_GREEN;
                let fringeColor = t.visited ? '#777' : COLORS.RUG_GOLD;

                renderer.rect(t.x + 10, t.y + 30, 12, 20, rugColor);
                renderer.rect(t.x + 10, t.y + 28, 12, 2, fringeColor); // Top fringe
                renderer.rect(t.x + 10, t.y + 50, 12, 2, fringeColor); // Bottom fringe
                if (!t.visited) {
                    renderer.rect(t.x + 14, t.y + 34, 4, 12, '#008000'); // Inner
                }
            }
        }

        // Draw Prayer Progress Bar if praying
        if (this.game.player.pose === 'pray' && this.prayerProgress > 0) {
            const p = this.game.player;
            renderer.rect(p.x, p.y - 10, 16, 4, '#000');
            renderer.rect(p.x, p.y - 10, 16 * (this.prayerProgress / this.maxPrayerProgress), 4, '#0f0');
        }
    }
}

class StageArafah extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 300;
        this.mapH = 300;
        this.mountain = { x: 100, y: 100, w: 100, h: 80 };
        this.reflectionProgress = 0;
        this.maxReflection = 100;
        this.time = 0;
        this.clouds = [
            { x: 20, y: 20 }, { x: 150, y: 40 }, { x: 250, y: 10 }
        ];
        this.signs = [
            new Sign(50, 200, "Mt. Mercy ^") // Pointing up/towards mountain
        ];
    }
    enter() {
        this.game.player.x = 10;
        this.game.player.y = 250;
        this.game.ui.setMessage("Stage 3: Arafah (9th Dhul Hijjah). Stand near Mount Mercy and hold SPACE to Reflect.");
        this.game.ui.setHUD("Reflection: 0%");
    }
    update() {
        this.time += 0.0005;
        if (this.time > 1) this.time = 1;
        const p = this.game.player;
        const m = this.mountain;
        const nearMountain = (p.x < m.x + m.w + 20 && p.x + p.w > m.x - 20 &&
            p.y < m.y + m.h + 20 && p.y + p.h > m.y - 20);
        if (nearMountain && this.game.input.isDown('Space')) {
            this.reflectionProgress += 0.5;
            if (this.reflectionProgress > this.maxReflection) this.reflectionProgress = this.maxReflection;
            this.game.ui.setHUD(`Reflection: ${Math.floor(this.reflectionProgress)}%`);
            if (this.reflectionProgress >= this.maxReflection) {
                this.game.ui.setMessage("Sun sets on Arafah. Proceeding to Muzdalifah...");
                setTimeout(() => { this.game.changeStage(new StageMuzdalifah(this.game)); }, 2000);
            }
        }

        // Move clouds
        for (let c of this.clouds) {
            c.x += 0.1;
            if (c.x > this.mapW) c.x = -50;
        }
    }
    draw(renderer) {
        renderer.clear(COLORS.SAND);
        renderer.drawMountain(this.mountain.x, this.mountain.y, this.mountain.w, this.mountain.h);

        // Clouds
        for (let c of this.clouds) {
            renderer.drawCloud(c.x, c.y);
        }

        // Signs
        for (let s of this.signs) {
            s.draw(renderer);
        }

        if (this.game.input.isDown('Space')) {
            // Use 'pray' pose instead of manual rect
            // We need to pass this state to the main loop or handle it here?
            // The main loop calls drawPlayer. We can override it or set a flag on player.
            this.game.player.pose = 'pray';
            renderer.rect(this.game.player.x, this.game.player.y - 10, 16, 4, '#000');
            renderer.rect(this.game.player.x, this.game.player.y - 10, 16 * (this.reflectionProgress / this.maxReflection), 4, '#0f0');
        } else {
            this.game.player.pose = 'stand';
        }
        if (this.time > 0.5) {
            renderer.ctx.fillStyle = `rgba(255, 100, 0, ${(this.time - 0.5) * 0.5})`;
            renderer.ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
        }
    }
}

class StageMuzdalifah extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 300;
        this.mapH = 300;
        this.pebbles = [];
        this.collected = 0;
        this.target = 7;
        this.phase = 'sleep'; // 'sleep' or 'collect'
        this.sleepProgress = 0;
        this.maxSleep = 100;
        this.dawnAlpha = 0; // For transition effect
        this.horizonY = 80; // Sky ends, ground starts

        // Add sky boundary to solids to prevent walking into sky
        this.solids = [{ x: 0, y: 0, w: this.mapW, h: this.horizonY }];

        // Animation timer for Z's
        this.zzzTime = 0;
    }
    enter() {
        this.game.player.x = 20;
        this.game.player.y = 100; // Start on ground
        this.game.ui.setMessage("Stage 4: Muzdalifah. Rest under the stars. Hold SPACE to sleep.");
        this.game.ui.setHUD("Sleep: 0%");
    }
    update() {
        if (this.phase === 'sleep') {
            if (this.game.input.isDown('Space')) {
                this.sleepProgress += 0.5;
                if (this.sleepProgress > this.maxSleep) this.sleepProgress = this.maxSleep;
                this.game.ui.setHUD(`Sleep: ${Math.floor(this.sleepProgress)}%`);

                // Increment Z animation timer
                this.zzzTime += 1;

                if (this.sleepProgress >= this.maxSleep) {
                    this.phase = 'transition';
                    this.game.player.pose = 'stand';
                    this.game.ui.setMessage("Fajr approaches...");
                }
            }
        } else if (this.phase === 'transition') {
            this.dawnAlpha += 0.01;
            if (this.dawnAlpha >= 1) {
                this.phase = 'collect';
                this.spawnPebbles();
                this.game.ui.setMessage("Fajr has arrived. Collect 7 pebbles (SPACE).");
                this.game.ui.setHUD(`Pebbles: 0/${this.target}`);
            }
        } else if (this.phase === 'collect') {
            if (this.game.input.isJustPressed('Space') && this.collected < this.target) {
                const p = this.game.player;
                for (let peb of this.pebbles) {
                    if (peb.active &&
                        p.x < peb.x + peb.w + 10 && p.x + p.w > peb.x - 10 &&
                        p.y < peb.y + peb.h + 10 && p.y + p.h > peb.y - 10) {
                        peb.active = false;
                        this.collected++;
                        this.game.ui.setHUD(`Pebbles: ${this.collected}/${this.target}`);
                        if (this.collected >= this.target) {
                            this.game.ui.setMessage("Pebbles collected. To Jamarat!");
                            setTimeout(() => { this.game.changeStage(new StageJamarat(this.game)); }, 2000);
                        }
                        break;
                    }
                }
            }
        }
    }

    spawnPebbles() {
        for (let i = 0; i < 15; i++) {
            this.pebbles.push({
                x: Math.random() * (this.mapW - 10),
                y: Math.random() * (this.mapH - this.horizonY - 10) + this.horizonY, // Only on ground
                w: 4, h: 4,
                active: true
            });
        }
    }

    draw(renderer) {
        // 1. Sky (Top part)
        if (this.phase === 'collect') {
            renderer.rect(0, 0, this.mapW, this.horizonY, '#202050'); // Dawn Sky
        } else {
            renderer.rect(0, 0, this.mapW, this.horizonY, COLORS.SKY_NIGHT); // Night Sky
        }

        // Stars (Only in Sky)
        for (let i = 0; i < 20; i++) {
            renderer.rect(i * 15, (i * 23) % this.horizonY, 1, 1, '#fff');
        }

        // 2. Ground (Bottom part)
        renderer.rect(0, this.horizonY, this.mapW, this.mapH - this.horizonY, '#2b2b2b'); // Dark Earth

        // 3. Red Carpets (Grid) - Only show during sleep/transition, not collect
        if (this.phase !== 'collect') {
            const carpetW = 40;
            const carpetH = 20;
            const gap = 2; // Smaller gap

            for (let y = this.horizonY + 10; y < this.mapH - carpetH; y += carpetH + gap) {
                for (let x = 10; x < this.mapW - carpetW; x += carpetW + gap) {
                    // Draw carpet base
                    renderer.rect(x, y, carpetW, carpetH, COLORS.CARPET_RED);
                    // Simple detail (darker edges)
                    renderer.rect(x, y, carpetW, 2, '#600000'); // Top edge
                    renderer.rect(x, y + carpetH - 2, carpetW, 2, '#600000'); // Bottom edge
                }
            }
        }

        // Sleep Phase Visuals
        if (this.phase === 'sleep') {
            if (this.game.input.isDown('Space')) {
                this.game.player.pose = 'sleep';
                renderer.rect(this.game.player.x, this.game.player.y + 16, 16, 4, '#444'); // Mat

                // Animated Zzz - appear one by one and drift up
                renderer.ctx.fillStyle = '#fff';
                renderer.ctx.font = '8px "Press Start 2P"';

                const cycle = Math.floor(this.zzzTime / 20) % 3; // Cycle every 60 frames
                const drift = (this.zzzTime % 20) * 0.3; // Drift up over 20 frames

                // Position ZZZ above the sleeping character's head
                if (cycle >= 0) {
                    renderer.ctx.fillText('Z', this.game.player.x + 4, this.game.player.y - 19 - drift);
                }
                if (cycle >= 1) {
                    renderer.ctx.fillText('z', this.game.player.x + 10, this.game.player.y - 21 - drift);
                }
                if (cycle >= 2) {
                    renderer.ctx.fillText('z', this.game.player.x + 16, this.game.player.y - 23 - drift);
                }
            } else {
                this.game.player.pose = 'stand';
            }
        }

        // Pebbles
        if (this.phase === 'collect') {
            for (let peb of this.pebbles) {
                if (peb.active) renderer.rect(peb.x, peb.y, peb.w, peb.h, COLORS.PEBBLE);
            }
        }

        // Transition Overlay
        if (this.phase === 'transition') {
            renderer.ctx.fillStyle = `rgba(32, 32, 80, ${this.dawnAlpha})`; // Fade to dawn color
            renderer.ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
        }
    }
}

class StageJamarat extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 300;
        this.mapH = 300;
        this.pillars = [
            { x: 100, y: 50, w: 20, h: 40, size: 'small' },
            { x: 150, y: 120, w: 30, h: 50, size: 'medium' },
            { x: 200, y: 200, w: 40, h: 60, size: 'large', isTarget: true }
        ];

        // Create solid barriers for the rings
        this.solids = [];
        for (let p of this.pillars) {
            // Ring dimensions based on drawing logic
            // Ellipse center: (p.x + p.w/2, p.y + p.h)
            // Radius X: p.w + 10
            // Radius Y: 15
            // Bounding Box:
            let rx = p.w + 10;
            let ry = 15;
            let cx = p.x + p.w / 2;
            let cy = p.y + p.h;

            // Add a rectangular solid for the ring
            this.solids.push({
                x: cx - rx,
                y: cy - ry,
                w: rx * 2,
                h: ry * 2
            });
        }
        // Also add pillars themselves (redundant but safe)
        this.solids = this.solids.concat(this.pillars);

        this.stonesThrown = 0;
        this.target = 7;
        this.projectiles = [];

        // Sign pointing to the largest pillar
        this.signs = [
            new Sign(50, 250, "Largest ->")
        ];
    }
    enter() {
        this.game.player.x = 10;
        this.game.player.y = 250;
        this.game.ui.setMessage("Stage 5: Jamarat al-Aqaba (10th Dhul Hijjah). Throw 7 stones at the LARGEST pillar (SPACE).");
        this.game.ui.setHUD(`Thrown: 0/${this.target}`);
    }
    update() {
        if (this.game.input.isJustPressed('Space') && this.stonesThrown < this.target) {
            this.projectiles.push({
                x: this.game.player.x + 8,
                y: this.game.player.y + 8,
                vx: 2, vy: -2,
                target: this.pillars[2]
            });
        }
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            let tx = p.target.x + p.target.w / 2;
            let ty = p.target.y + p.target.h / 2;
            p.x += (tx - p.x) * 0.1;
            p.y += (ty - p.y) * 0.1;
            if (Math.abs(p.x - tx) < 5 && Math.abs(p.y - ty) < 5) {
                this.projectiles.splice(i, 1);
                this.stonesThrown++;
                this.game.ui.setHUD(`Thrown: ${this.stonesThrown}/${this.target}`);
                if (this.stonesThrown >= this.target) {
                    this.game.ui.setMessage("Stoning complete. Proceed to Sacrifice.");
                    setTimeout(() => { this.game.changeStage(new StageSacrifice(this.game)); }, 2000);
                }
            }
        }
    }
    draw(renderer) {
        renderer.clear(COLORS.SAND);
        for (let p of this.pillars) {
            // Draw Ring/Basin
            const sx = Math.floor(p.x - renderer.camera.x);
            const sy = Math.floor(p.y - renderer.camera.y);

            renderer.ctx.fillStyle = '#c0c0c0'; // Concrete floor
            renderer.ctx.strokeStyle = '#808080'; // Wall outline
            renderer.ctx.lineWidth = 3;

            renderer.ctx.beginPath();
            // Ellipse for the basin
            // Center x = sx + p.w/2
            // Center y = sy + p.h (base of pillar)
            renderer.ctx.ellipse(sx + p.w / 2, sy + p.h, p.w + 10, 15, 0, 0, Math.PI * 2);
            renderer.ctx.fill();
            renderer.ctx.stroke();

            // Draw Pillar
            renderer.drawPillar(p.x, p.y, p.w, p.h);
        }
        for (let p of this.projectiles) {
            renderer.rect(p.x, p.y, 3, 3, COLORS.PEBBLE);
        }

        // Draw Signs
        for (let s of this.signs) {
            s.draw(renderer);
        }
    }
}

class StageSacrifice extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 400;
        this.mapH = 300;

        // Animal Pen (left side)
        this.pen = { x: 20, y: 140, w: 100, h: 80 };
        this.animals = [
            { x: 40, y: 160, w: 12, h: 8, id: 1, following: false },
            { x: 80, y: 180, w: 12, h: 8, id: 2, following: false },
            { x: 60, y: 150, w: 12, h: 8, id: 3, following: false }
        ];

        // Sacrifice Zone (right side, same y-axis)
        this.sacrificeZone = { x: 320, y: 160, w: 60, h: 60 };

        // Barber Stall (centered between pen and sacrifice zone, same y-axis)
        const barberX = (this.pen.x + this.pen.w + this.sacrificeZone.x) / 2 - 20; // Center and adjust for width
        this.barber = { x: barberX, y: 100, w: 40, h: 30, type: 'scissors' };
        this.barberNPC = { x: barberX + 15, y: 115 };

        this.currentAnimal = null;
        this.sacrificeDone = false;
        this.hairCutDone = false;

        // Signs (centered, pointing outward to each zone)
        this.signs = [
            new Sign(150, 200, "Animals <"), // Left - pointing to animal pen
            new Sign(200, 200, "Barber ^"),  // Middle - pointing up to barber
            new Sign(250, 200, "Slaughter >") // Right - pointing to sacrifice zone
        ];

        // Solids for pen walls (with door gap at bottom)
        this.solids = [
            { x: this.pen.x, y: this.pen.y, w: this.pen.w, h: 2 }, // Top
            { x: this.pen.x, y: this.pen.y, w: 2, h: this.pen.h }, // Left
            { x: this.pen.x + this.pen.w, y: this.pen.y, w: 2, h: this.pen.h }, // Right
            // Bottom Split (Gap from 30-70 = 40 pixel wide entrance)
            { x: this.pen.x, y: this.pen.y + this.pen.h, w: 30, h: 2 }, // Bottom Left
            { x: this.pen.x + 70, y: this.pen.y + this.pen.h, w: 30, h: 2 } // Bottom Right
        ];
    }

    enter() {
        this.game.player.x = 200; // Center below signboards
        this.game.player.y = 230; // Below the signboards
        this.game.ui.setMessage("Stage 6: Sacrifice. Go to the pen and lead an animal to the marked zone.");
        this.game.ui.setHUD("Sacrifice: Pending");
    }

    update() {
        const p = this.game.player;

        // 1. Animal Interaction
        if (!this.sacrificeDone && !this.currentAnimal) {
            // Check if player is near pen entrance (let's say right side is open or just proximity)
            // Actually let's make the pen have an opening or just proximity interaction
            for (let a of this.animals) {
                if (p.x < a.x + a.w + 20 && p.x + p.w > a.x - 20 &&
                    p.y < a.y + a.h + 20 && p.y + p.h > a.y - 20) {
                    if (this.game.input.isJustPressed('Space')) {
                        a.following = true;
                        this.currentAnimal = a;
                        this.game.ui.setMessage("Animal is following. Lead it to the Sacrifice Zone.");
                        break;
                    }
                }
            }
        }

        // 2. Animal Following Logic
        if (this.currentAnimal) {
            const a = this.currentAnimal;
            const dx = p.x - a.x;
            const dy = p.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 20) {
                a.x += (dx / dist) * 1.0;
                a.y += (dy / dist) * 1.0;
            }

            // Check if in sacrifice zone
            const sz = this.sacrificeZone;
            if (a.x > sz.x && a.x < sz.x + sz.w &&
                a.y > sz.y && a.y < sz.y + sz.h) {

                this.game.ui.setMessage("Press SPACE to perform sacrifice.");

                if (this.game.input.isJustPressed('Space')) {
                    // Perform Sacrifice
                    this.currentAnimal = null;
                    // Remove animal from list
                    this.animals = this.animals.filter(an => an !== a);
                    this.sacrificeDone = true;
                    this.game.ui.setHUD("Sacrifice: Done");
                    this.game.ui.setMessage("Sacrifice accepted. Now visit the Barber for Halq.");
                }
            }
        }

        // 3. Barber Interaction
        if (this.sacrificeDone && !this.hairCutDone) {
            const b = this.barber;
            if (p.x < b.x + b.w + 10 && p.x + p.w > b.x - 10 &&
                p.y < b.y + b.h + 10 && p.y + p.h > b.y - 10) {
                if (this.game.input.isJustPressed('Space')) {
                    this.hairCutDone = true;
                    this.game.player.isHairCut = true;
                    this.game.ui.setMessage("Hair trimmed (Halq). Proceed to the Grand Mosque.");
                    setTimeout(() => { this.game.changeStage(new StageGrandMosque(this.game)); }, 2000);
                }
            }
        }
    }

    draw(renderer) {
        renderer.clear(COLORS.SAND);

        // Draw Pen
        renderer.ctx.strokeStyle = COLORS.STALL_WOOD;
        renderer.ctx.lineWidth = 2;
        const pen = this.pen;
        const sx = Math.floor(pen.x - renderer.camera.x);
        const sy = Math.floor(pen.y - renderer.camera.y);

        // Draw walls manually to match solids
        renderer.ctx.beginPath();
        // Top
        renderer.ctx.moveTo(sx, sy); renderer.ctx.lineTo(sx + pen.w, sy);
        // Sides
        renderer.ctx.moveTo(sx, sy); renderer.ctx.lineTo(sx, sy + pen.h);
        renderer.ctx.moveTo(sx + pen.w, sy); renderer.ctx.lineTo(sx + pen.w, sy + pen.h);
        // Bottom with gap
        renderer.ctx.moveTo(sx, sy + pen.h); renderer.ctx.lineTo(sx + 40, sy + pen.h);
        renderer.ctx.moveTo(sx + 60, sy + pen.h); renderer.ctx.lineTo(sx + pen.w, sy + pen.h);
        renderer.ctx.stroke();

        // Draw Sacrifice Zone
        const sz = this.sacrificeZone;
        const szx = Math.floor(sz.x - renderer.camera.x);
        const szy = Math.floor(sz.y - renderer.camera.y);
        renderer.ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
        renderer.ctx.fillRect(szx, szy, sz.w, sz.h);
        renderer.ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
        renderer.ctx.strokeRect(szx, szy, sz.w, sz.h);

        // Draw Animals
        for (let a of this.animals) {
            renderer.drawSheep(a.x, a.y);
        }

        // Draw Barber Stall & NPC
        renderer.drawStall(this.barber.x, this.barber.y, 'scissors');
        renderer.drawBarber(this.barberNPC.x, this.barberNPC.y);

        if (this.hairCutDone) {
            renderer.rect(this.barber.x + 15, this.barber.y + 35, 10, 4, '#0f0');
        }

        // Draw Signs
        for (let s of this.signs) {
            s.draw(renderer);
        }
    }
}

class StageGrandMosque extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 400;
        this.mapH = 400;
        this.kaaba = { x: 168, y: 168, w: 64, h: 64 };
        this.solids = [this.kaaba];

        // Tawaf Checkpoints (Anti-Clockwise starting from Black Stone/Bottom-Left)
        // Target sequence: Bottom Right -> Top Right -> Top Left -> Bottom Left (Lap Complete)
        this.checkpoints = [
            { x: 168 + 64, y: 168 + 64, w: 20, h: 20, id: 0 }, // Bottom Right
            { x: 168 + 64, y: 168 - 20, w: 20, h: 20, id: 1 }, // Top Right
            { x: 168 - 20, y: 168 - 20, w: 20, h: 20, id: 2 }, // Top Left
            { x: 168 - 20, y: 168 + 64, w: 20, h: 20, id: 3 }  // Bottom Left (Black Stone)
        ];
        this.currentCheckpoint = 0;
        this.laps = 0;
        this.maxLaps = 7;
        this.mode = 'tawaf'; // tawaf or sai

        // Sa'i Points
        this.safa = { x: 50, y: 300, w: 30, h: 30, name: 'Safa' };
        this.marwa = { x: 350, y: 300, w: 30, h: 30, name: 'Marwa' };
        this.saiTrips = 0;
        this.maxSai = 7;
        this.targetHill = this.safa;
        this.saiStarted = false;

        // Signs for Sa'i
        this.saiSigns = [
            new Sign(this.safa.x + 15, this.safa.y - 10, "Safa"),
            new Sign(this.marwa.x + 15, this.marwa.y - 10, "Marwa")
        ];
        this.saiComplete = false;
    }

    enter() {
        this.game.player.x = 140; // Start near Black Stone (Bottom Left)
        this.game.player.y = 240;
        this.game.ui.setMessage("Stage 7: Grand Mosque. Perform Tawaf (7 laps Anti-Clockwise).");
        this.game.ui.setHUD(`Tawaf: 0/${this.maxLaps}`);
    }

    update() {
        const p = this.game.player;

        if (this.mode === 'tawaf') {
            // Check checkpoints
            let cp = this.checkpoints[this.currentCheckpoint];
            if (p.x < cp.x + cp.w && p.x + p.w > cp.x &&
                p.y < cp.y + cp.h && p.y + p.h > cp.y) {

                this.currentCheckpoint++;
                if (this.currentCheckpoint > 3) {
                    this.currentCheckpoint = 0;
                    this.laps++;
                    this.game.ui.setHUD(`Tawaf: ${this.laps}/${this.maxLaps}`);
                    if (this.laps >= this.maxLaps) {
                        this.mode = 'sai';
                        this.game.ui.setMessage("Tawaf complete. Perform Sa'i (Walk between Safa and Marwa).");
                        this.game.ui.setHUD(`Sa'i: 0/${this.maxSai}`);
                    }
                }
            }
        } else if (this.mode === 'sai') {
            let t = this.targetHill;
            if (p.x < t.x + t.w && p.x + p.w > t.x &&
                p.y < t.y + t.h && p.y + p.h > t.y) {

                if (this.saiComplete) return;

                if (!this.saiStarted) {
                    // First visit to Safa (Start point)
                    if (t === this.safa) {
                        this.saiStarted = true;
                        this.targetHill = this.marwa;
                        this.game.ui.setMessage("Sa'i started. Walk to Marwa.");
                    }
                } else {
                    // Subsequent visits
                    this.saiTrips++;
                    this.game.ui.setHUD(`Sa'i: ${this.saiTrips}/${this.maxSai}`);

                    if (this.saiTrips >= this.maxSai) {
                        this.saiComplete = true;
                        this.game.ui.setMessage("Sa'i complete. Return to Mina for Night 11.");
                        setTimeout(() => { this.game.changeStage(new StageMinaReturn(this.game, 11, 12)); }, 2000);
                    } else {
                        this.targetHill = (this.targetHill === this.safa) ? this.marwa : this.safa;
                        this.game.ui.setMessage(`Go to ${this.targetHill.name}.`);
                    }
                }
            }
        }
    }

    draw(renderer) {
        renderer.clear(COLORS.MARBLE);
        renderer.drawKaaba(this.kaaba.x, this.kaaba.y);

        if (this.mode === 'sai') {
            // Draw path/track between Safa and Marwa
            renderer.rect(this.safa.x + this.safa.w, this.safa.y + 10,
                this.marwa.x - (this.safa.x + this.safa.w), 10, '#d0d0d0');

            // Draw hills
            renderer.rect(this.safa.x, this.safa.y, this.safa.w, this.safa.h, '#888'); // Safa
            renderer.rect(this.marwa.x, this.marwa.y, this.marwa.w, this.marwa.h, '#888'); // Marwa

            // Highlight target
            let t = this.targetHill;
            renderer.rect(t.x, t.y - 10, t.w, 5, '#0f0');

            // Draw signs
            for (let s of this.saiSigns) {
                s.draw(renderer);
            }
        }
    }
}

class StageMinaReturn extends Stage {
    constructor(game, night, day) {
        super(game);
        this.night = night; // 11 or 12
        this.day = day; // 12 or 13
        this.mapW = 400;
        this.mapH = 400;
        this.tents = [];

        // Generate non-overlapping tents
        let attempts = 0;
        while (this.tents.length < 20 && attempts < 1000) {
            let t = {
                x: Math.random() * (this.mapW - 60) + 10,
                y: Math.random() * (this.mapH - 60) + 10,
                w: 32, h: 32
            };
            let overlap = false;
            for (let other of this.tents) {
                if (t.x < other.x + other.w + 10 && t.x + t.w + 10 > other.x &&
                    t.y < other.y + other.h + 10 && t.y + t.h + 10 > other.y) {
                    overlap = true;
                    break;
                }
            }
            if (!overlap) this.tents.push(t);
            attempts++;
        }

        this.solids = [];
        this.sleepProgress = 0;
        this.maxSleep = 100;
        this.zzzTime = 0;
    }
    enter() {
        this.game.player.x = 10;
        this.game.player.y = 10;
        this.game.ui.setMessage(`Night ${this.night}: Mina. Find a tent and hold SPACE to sleep.`);
        this.game.ui.setHUD("Sleep: 0%");
    }
    update() {
        // Check if near any tent
        let nearTent = false;
        const p = this.game.player;
        for (let t of this.tents) {
            if (p.x < t.x + t.w + 10 && p.x + p.w > t.x - 10 &&
                p.y < t.y + t.h + 10 && p.y + p.h > t.y - 10) {
                nearTent = true;
                break;
            }
        }

        if (nearTent && this.game.input.isDown('Space')) {
            this.sleepProgress += 0.5;
            if (this.sleepProgress > this.maxSleep) this.sleepProgress = this.maxSleep;
            this.game.ui.setHUD(`Sleep: ${Math.floor(this.sleepProgress)}%`);
            this.zzzTime++;

            if (this.sleepProgress >= this.maxSleep) {
                this.game.ui.setMessage("You rested well. To Jamarat!");
                setTimeout(() => {
                    this.game.changeStage(new StageJamaratReturn(this.game, this.day));
                }, 2000);
            }
        }
    }
    draw(renderer) {
        // Night sky background
        renderer.rect(0, 0, this.mapW, this.mapH, COLORS.SKY_NIGHT);

        // Draw tents
        this.tents.sort((a, b) => a.y - b.y);
        for (let t of this.tents) {
            renderer.drawTent(t.x, t.y);
        }

        // Draw player sleeping if space held
        if (this.game.input.isDown('Space')) {
            this.game.player.pose = 'sleep';
            // Zzz animation
            renderer.ctx.fillStyle = '#fff';
            renderer.ctx.font = '8px "Press Start 2P"';
            const cycle = Math.floor(this.zzzTime / 20) % 3;
            const drift = (this.zzzTime % 20) * 0.3;
            if (cycle >= 0) renderer.ctx.fillText('Z', this.game.player.x + 4, this.game.player.y - 19 - drift);
            if (cycle >= 1) renderer.ctx.fillText('z', this.game.player.x + 10, this.game.player.y - 21 - drift);
            if (cycle >= 2) renderer.ctx.fillText('z', this.game.player.x + 16, this.game.player.y - 23 - drift);
        } else {
            this.game.player.pose = 'stand';
        }
    }
}

class StageJamaratReturn extends Stage {
    constructor(game, day) {
        super(game);
        this.day = day;
        this.mapW = 300;
        this.mapH = 300;
        // 3 Pillars
        this.pillars = [
            { x: 100, y: 50, w: 20, h: 40, size: 'small', stones: 0, done: false, name: "Small" },
            { x: 150, y: 120, w: 30, h: 50, size: 'medium', stones: 0, done: false, name: "Medium" },
            { x: 200, y: 200, w: 40, h: 60, size: 'large', stones: 0, done: false, name: "Large" }
        ];

        this.solids = [];
        for (let p of this.pillars) {
            let rx = p.w + 10;
            let ry = 15;
            let cx = p.x + p.w / 2;
            let cy = p.y + p.h;
            this.solids.push({ x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2 });
        }
        this.solids = this.solids.concat(this.pillars);

        this.projectiles = [];
        this.targetStones = 7;
    }
    enter() {
        this.game.player.x = 10;
        this.game.player.y = 250;
        this.game.ui.setMessage(`Day ${this.day}: Jamarat. Stone ALL 3 pillars (7 each).`);
        this.game.ui.setHUD("S:0 M:0 L:0");
        this.updateHUD();
    }
    updateHUD() {
        let status = this.pillars.map(p => `${p.name[0]}:${p.stones}`).join(' ');
        this.game.ui.setHUD(status);
    }
    update() {
        if (this.game.input.isJustPressed('Space')) {
            // Find nearest pillar to throw at
            let targetPillar = null;
            let minDist = 1000;
            const p = this.game.player;

            for (let pillar of this.pillars) {
                if (pillar.done) continue;
                let dx = (pillar.x + pillar.w / 2) - p.x;
                let dy = (pillar.y + pillar.h / 2) - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist < minDist) {
                    minDist = dist;
                    targetPillar = pillar;
                }
            }

            if (targetPillar) {
                this.projectiles.push({
                    x: this.game.player.x + 8,
                    y: this.game.player.y + 8,
                    vx: 0, vy: 0, // Will calculate in update
                    target: targetPillar
                });
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            let tx = p.target.x + p.target.w / 2;
            let ty = p.target.y + p.target.h / 2;

            // Simple homing for visual effect
            p.x += (tx - p.x) * 0.15;
            p.y += (ty - p.y) * 0.15;

            if (Math.abs(p.x - tx) < 5 && Math.abs(p.y - ty) < 5) {
                this.projectiles.splice(i, 1);
                p.target.stones++;
                if (p.target.stones >= this.targetStones) {
                    p.target.done = true;
                    p.target.stones = this.targetStones; // Cap it
                }
                this.updateHUD();
                this.checkCompletion();
            }
        }
    }
    checkCompletion() {
        if (this.pillars.every(p => p.done)) {
            if (this.day === 12) {
                this.game.ui.setMessage("Day 12 Complete. Return to Mina for Night 12.");
                setTimeout(() => { this.game.changeStage(new StageMinaReturn(this.game, 12, 13)); }, 2000);
            } else {
                this.game.ui.setMessage("Day 13 Complete. Proceed to Farewell Tawaf.");
                setTimeout(() => { this.game.changeStage(new StageFarewell(this.game)); }, 2000);
            }
        }
    }
    draw(renderer) {
        renderer.clear(COLORS.SAND);
        for (let p of this.pillars) {
            // Draw Ring/Basin
            const sx = Math.floor(p.x - renderer.camera.x);
            const sy = Math.floor(p.y - renderer.camera.y);

            renderer.ctx.fillStyle = '#c0c0c0';
            renderer.ctx.strokeStyle = p.done ? '#00ff00' : '#808080'; // Green outline if done
            renderer.ctx.lineWidth = 3;

            renderer.ctx.beginPath();
            renderer.ctx.ellipse(sx + p.w / 2, sy + p.h, p.w + 10, 15, 0, 0, Math.PI * 2);
            renderer.ctx.fill();
            renderer.ctx.stroke();

            renderer.drawPillar(p.x, p.y, p.w, p.h);
        }
        for (let p of this.projectiles) {
            renderer.rect(p.x, p.y, 3, 3, COLORS.PEBBLE);
        }
    }
}

class StageFarewell extends Stage {
    constructor(game) {
        super(game);
        this.mapW = 400;
        this.mapH = 400;
        this.kaaba = { x: 168, y: 168, w: 64, h: 64 };
        this.solids = [this.kaaba];
        this.checkpoints = [
            { x: 168 + 64, y: 168 + 64, w: 20, h: 20, id: 0 }, // Bottom Right
            { x: 168 + 64, y: 168 - 20, w: 20, h: 20, id: 1 }, // Top Right
            { x: 168 - 20, y: 168 - 20, w: 20, h: 20, id: 2 }, // Top Left
            { x: 168 - 20, y: 168 + 64, w: 20, h: 20, id: 3 }  // Bottom Left
        ];
        this.currentCheckpoint = 0;
        this.laps = 0;
        this.maxLaps = 7;
        this.confetti = [];
        this.completionTime = 0;
    }
    enter() {
        this.game.player.x = 140;
        this.game.player.y = 240;
        this.game.ui.setMessage("Stage 8: Farewell Tawaf. Perform 7 laps.");
        this.game.ui.setHUD(`Farewell: 0/${this.maxLaps}`);
    }
    update() {
        const p = this.game.player;
        let cp = this.checkpoints[this.currentCheckpoint];
        if (p.x < cp.x + cp.w && p.x + p.w > cp.x &&
            p.y < cp.y + cp.h && p.y + p.h > cp.y) {
            this.currentCheckpoint++;
            if (this.currentCheckpoint > 3) {
                this.currentCheckpoint = 0;
                this.laps++;
                this.game.ui.setHUD(`Farewell: ${this.laps}/${this.maxLaps}`);
                if (this.laps >= this.maxLaps) {
                    this.game.ui.setMessage("HAJJ MUBARAK! Game Over.");
                    // Initialize confetti
                    if (this.confetti.length === 0) {
                        for (let i = 0; i < 50; i++) {
                            this.confetti.push({
                                x: Math.random() * this.mapW,
                                y: -10,
                                vx: (Math.random() - 0.5) * 2,
                                vy: Math.random() * 2 + 1,
                                color: ['#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#ffb6c1'][Math.floor(Math.random() * 5)]
                            });
                        }
                    }
                }
            }
        }

        // Update confetti
        if (this.laps >= this.maxLaps) {
            this.completionTime++;
            for (let c of this.confetti) {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.1; // Gravity

                // Reset if off screen
                if (c.y > this.mapH) {
                    c.y = -10;
                    c.x = Math.random() * this.mapW;
                }
            }
        }
    }
    draw(renderer) {
        renderer.clear(COLORS.MARBLE);
        renderer.drawKaaba(this.kaaba.x, this.kaaba.y);
        if (this.laps >= this.maxLaps) {
            // Draw confetti
            for (let c of this.confetti) {
                renderer.rect(c.x, c.y, 3, 3, c.color);
            }

            // Semi-transparent overlay (but don't make it too dark)
            renderer.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            renderer.ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

            // Draw centered text at top
            renderer.ctx.fillStyle = '#ffd700';
            renderer.ctx.font = '10px "Press Start 2P"';
            const text = "HAJJ MUBARAK";
            const textWidth = renderer.ctx.measureText(text).width;
            renderer.ctx.fillText(text, (LOGICAL_W - textWidth) / 2, 30);
        }
    }
}
