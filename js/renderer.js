// --- RENDERER ---
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = { x: 0, y: 0 };
    }

    setCamera(camera) {
        this.camera = camera;
    }

    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    }

    drawMarbleFloor(mapW, mapH) {
        // Base color
        this.rect(0, 0, mapW, mapH, COLORS.MARBLE);

        // Tile patterns
        const tileSize = 32;
        const camX = this.camera.x;
        const camY = this.camera.y;

        for (let y = 0; y < mapH; y += tileSize) {
            for (let x = 0; x < mapW; x += tileSize) {
                // Main tile lines
                this.ctx.strokeStyle = '#e0e0e0';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(
                    Math.floor(x - camX),
                    Math.floor(y - camY),
                    tileSize,
                    tileSize
                );

                // Subtle inner border for premium look
                this.ctx.strokeStyle = '#f5f5f5';
                this.ctx.strokeRect(
                    Math.floor(x + 2 - camX),
                    Math.floor(y + 2 - camY),
                    tileSize - 4,
                    tileSize - 4
                );
            }
        }
    }

    rect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x - this.camera.x), Math.floor(y - this.camera.y), w, h);
    }

    drawPlayer(x, y, isIhram, isHairCut, pose = 'stand') {
        const dx = Math.floor(x);
        const dy = Math.floor(y);

        if (pose === 'sleep') {
            // Sleeping Pose (Lying down)
            // Body (Horizontal)
            if (isIhram || isHairCut) {
                this.rect(dx, dy + 8, 14, 6, COLORS.WHITE); // Ihram or Thobe
            } else {
                this.rect(dx, dy + 8, 14, 6, COLORS.SHIRT);
            }
            // Head
            this.rect(dx - 4, dy + 6, 6, 6, COLORS.SKIN);

            // Hat when sleeping
            if (isHairCut && !isIhram) {
                this.rect(dx - 5, dy + 6, 2, 6, COLORS.WHITE); // Kufi on side
            }

            // Closed Eyes (Eyelids)
            this.rect(dx - 2, dy + 8, 2, 1, COLORS.SKIN);
            return;
        }

        // --- FEET & SANDALS ---
        // Left foot
        this.rect(dx + 4, dy + 14, 3, 2, COLORS.SKIN);
        this.rect(dx + 4, dy + 15, 3, 1, COLORS.SANDAL);
        // Right foot
        this.rect(dx + 9, dy + 14, 3, 2, COLORS.SKIN);
        this.rect(dx + 9, dy + 15, 3, 1, COLORS.SANDAL);

        // --- BODY ---
        if (isIhram) {
            // Main white garment
            this.rect(dx + 3, dy + 6, 10, 9, COLORS.WHITE);
            // Idtiba (Right shoulder bare, Left covered)
            // Expose top-right of body block to skin
            this.rect(dx + 10, dy + 6, 3, 3, COLORS.SKIN);

            // Draping/Shadow details
            this.rect(dx + 3, dy + 8, 2, 1, COLORS.IHRAM_SHADOW);
            this.rect(dx + 11, dy + 10, 2, 1, COLORS.IHRAM_SHADOW);
            this.rect(dx + 4, dy + 12, 8, 1, COLORS.IHRAM_SHADOW);
        } else if (isHairCut) {
            // Thobe (Full white robe)
            this.rect(dx + 3, dy + 6, 10, 9, COLORS.WHITE);
            // Detail (Vertical line for collar area)
            this.rect(dx + 7, dy + 6, 2, 4, COLORS.IHRAM_SHADOW);
        } else {
            // Normal clothes (Shirt + Pants)
            this.rect(dx + 3, dy + 6, 10, 6, COLORS.SHIRT);
            this.rect(dx + 4, dy + 12, 8, 3, COLORS.PANTS);
        }

        // --- ARMS ---
        const sleeveColor = (isIhram) ? null : (isHairCut ? COLORS.WHITE : COLORS.SHIRT);

        if (pose === 'pray') {
            // Arms raised
            this.rect(dx + 0, dy + 2, 3, 6, COLORS.SKIN); // Left arm up
            this.rect(dx + 13, dy + 2, 3, 6, COLORS.SKIN); // Right arm up

            // Full sleeves when not in Ihram (raised)
            if (sleeveColor) {
                this.rect(dx + 0, dy + 2, 3, 6, sleeveColor); // Left sleeve
                this.rect(dx + 13, dy + 2, 3, 6, sleeveColor); // Right sleeve
                // Show hands
                this.rect(dx + 0, dy + 6, 3, 2, COLORS.SKIN); // Left hand
                this.rect(dx + 13, dy + 6, 3, 2, COLORS.SKIN); // Right hand
            }
        } else {
            // Arms down
            this.rect(dx + 1, dy + 6, 3, 6, COLORS.SKIN); // Left arm
            this.rect(dx + 12, dy + 6, 3, 6, COLORS.SKIN); // Right arm

            // Full sleeves when not in Ihram (down)
            if (sleeveColor) {
                this.rect(dx + 1, dy + 6, 3, 6, sleeveColor); // Left sleeve
                this.rect(dx + 12, dy + 6, 3, 6, sleeveColor); // Right sleeve
                // Show hands
                this.rect(dx + 1, dy + 10, 3, 2, COLORS.SKIN); // Left hand
                this.rect(dx + 12, dy + 10, 3, 2, COLORS.SKIN); // Right hand
            }
        }

        // --- HEAD ---
        // Face base
        this.rect(dx + 4, dy, 8, 7, COLORS.SKIN);

        // Hair or Hat
        if (isHairCut) {
            if (!isIhram) {
                // White Kufi/Hat
                this.rect(dx + 4, dy - 1, 8, 3, COLORS.WHITE);
                // Shadow under hat
                this.rect(dx + 4, dy + 1, 8, 1, COLORS.IHRAM_SHADOW);
            }
            // If in Ihram, we stay bald (drawn via face base)
        } else {
            this.rect(dx + 4, dy, 8, 2, COLORS.HAIR); // Top hair
            this.rect(dx + 3, dy + 1, 1, 3, COLORS.HAIR); // Sideburn L
            this.rect(dx + 12, dy + 1, 1, 3, COLORS.HAIR); // Sideburn R
        }

        // Eyes
        this.rect(dx + 5, dy + 3, 2, 2, COLORS.BLACK);
        this.rect(dx + 9, dy + 3, 2, 2, COLORS.BLACK);

        // Beard
        // Beard (Always present, even after haircut)
        this.rect(dx + 4, dy + 5, 8, 2, COLORS.HAIR);
        this.rect(dx + 5, dy + 7, 6, 1, COLORS.HAIR);
    }

    drawCloud(x, y) {
        this.rect(x + 10, y, 30, 10, '#fff');
        this.rect(x, y + 5, 20, 10, '#fff');
        this.rect(x + 25, y + 5, 20, 10, '#fff');
    }

    drawTent(x, y) {
        const sx = Math.floor(x - this.camera.x);
        const sy = Math.floor(y - this.camera.y);

        // Ropes (Pegs) - Thinner and more grounded
        this.ctx.strokeStyle = COLORS.ROPE;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        // Left Rope
        this.ctx.moveTo(sx + 4, sy + 15);
        this.ctx.lineTo(sx - 6, sy + 28);
        // Right Rope
        this.ctx.moveTo(sx + 28, sy + 15);
        this.ctx.lineTo(sx + 38, sy + 28);
        this.ctx.stroke();

        // Pegs
        this.ctx.fillStyle = '#553311';
        this.ctx.fillRect(sx - 7, sy + 27, 2, 2);
        this.ctx.fillRect(sx + 37, sy + 27, 2, 2);

        // Triangular Tent Body
        // Main front face (Triangle)
        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.beginPath();
        this.ctx.moveTo(sx + 16, sy);       // Top peak
        this.ctx.lineTo(sx + 32, sy + 28);  // Bottom right
        this.ctx.lineTo(sx, sy + 28);       // Bottom left
        this.ctx.closePath();
        this.ctx.fill();

        // Shaded side (giving it 3D depth)
        this.ctx.fillStyle = COLORS.TENT_SIDE;
        this.ctx.beginPath();
        this.ctx.moveTo(sx + 16, sy);       // Top peak
        this.ctx.lineTo(sx + 16, sy + 28);  // Bottom center
        this.ctx.lineTo(sx, sy + 28);       // Bottom left
        this.ctx.closePath();
        this.ctx.fill();

        // Entrance (Darker triangle/slit)
        this.ctx.fillStyle = '#dddddd';
        this.ctx.beginPath();
        this.ctx.moveTo(sx + 16, sy + 12);
        this.ctx.lineTo(sx + 20, sy + 28);
        this.ctx.lineTo(sx + 12, sy + 28);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawMountain(x, y, w, h) {
        const sx = Math.floor(x - this.camera.x);
        const sy = Math.floor(y - this.camera.y);

        // Base Layer (Widest)
        this.ctx.fillStyle = COLORS.MOUNTAIN;
        this.ctx.fillRect(sx, sy + 40, w, h - 40);

        // Middle Layer (Stepped in)
        this.ctx.fillStyle = '#707070';
        this.ctx.fillRect(sx + 10, sy + 20, w - 20, h - 20);

        // Top Layer (Peak area)
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(sx + 25, sy, w - 50, h - 30);

        // Texture/Rocks
        this.ctx.fillStyle = '#505050';
        this.ctx.fillRect(sx + 15, sy + 50, 10, 5);
        this.ctx.fillRect(sx + w - 25, sy + 30, 8, 4);
        this.ctx.fillRect(sx + 40, sy + 10, 6, 3);

        // The White Pillar (Jabal al-Rahmah Marker)
        const px = sx + w / 2 - 4;
        const py = sy - 15;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(px, py, 8, 20); // Pillar shaft
        this.ctx.fillStyle = '#dddddd'; // Shading
        this.ctx.fillRect(px + 6, py, 2, 20);
    }

    drawPillar(x, y, w, h) {
        this.rect(x, y, w, h, COLORS.PILLAR);
        this.rect(x + 2, y + 2, w - 4, h - 4, '#999999');
    }

    drawStall(x, y, type) {
        this.rect(x, y, 40, 30, COLORS.STALL_WOOD);
        this.rect(x + 5, y + 5, 30, 20, '#000');
        if (type === 'animal') {
            this.rect(x + 15, y - 10, 10, 10, '#fff');
            this.rect(x + 17, y - 8, 6, 6, '#f00');
        } else if (type === 'scissors') {
            // Barber Pole
            const px = x + 32;
            const py = y - 5;

            // Pole Base
            this.rect(px, py + 16, 6, 2, '#111');
            this.rect(px + 1, py + 18, 4, 1, '#111');

            // Pole Cap
            this.rect(px, py, 6, 2, '#111');
            this.rect(px + 1, py - 1, 4, 1, '#111');

            // Cylinder (White background)
            this.rect(px + 1, py + 2, 4, 14, '#fff');

            // Stripes (Red and Blue diagonals)
            // Simple pixel art diagonals
            this.rect(px + 1, py + 3, 4, 2, '#d00'); // Red
            this.rect(px + 1, py + 7, 4, 2, '#00d'); // Blue
            this.rect(px + 1, py + 11, 4, 2, '#d00'); // Red
            this.rect(px + 1, py + 15, 4, 1, '#00d'); // Blue partial

            // Signboard text
            this.drawSign(x + 5, y - 10, "Barber");
        }
    }

    drawKaaba(x, y) {
        // --- HATEEM (Hijr Ismail) ---
        // Semi-circular wall to the right of the Kaaba
        const hx = Math.floor(x + 64 - this.camera.x);
        const hy = Math.floor(y + 32 - this.camera.y);
        this.ctx.strokeStyle = '#dddddd';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        // A semi-circle arching to the right
        this.ctx.arc(hx + 5, hy, 28, -Math.PI / 2, Math.PI / 2);
        this.ctx.stroke();

        // --- KAABA BASE ---
        this.rect(x, y, 64, 64, COLORS.KAABA_BLACK);

        // Gold stripe (Kiswa)
        this.rect(x, y + 10, 64, 8, COLORS.KAABA_GOLD);
        // Detail on gold stripe
        this.rect(x, y + 12, 64, 1, 'rgba(0,0,0,0.2)');
        this.rect(x, y + 15, 64, 1, 'rgba(0,0,0,0.2)');

        // --- DOOR AREA ---
        // Aligned more to the left
        const doorX = x + 12;
        const doorY = y + 25;
        this.rect(doorX, doorY, 14, 25, '#3e2723'); // Dark wood door

        // Gold door outline
        this.rect(doorX, doorY, 14, 2, COLORS.KAABA_GOLD); // Top
        this.rect(doorX, doorY, 2, 25, COLORS.KAABA_GOLD); // Left
        this.rect(doorX + 12, doorY, 2, 25, COLORS.KAABA_GOLD); // Right

        // Door steps (Grey)
        this.rect(doorX - 2, y + 50, 18, 5, '#888888'); // Top step
        this.rect(doorX - 4, y + 55, 22, 5, '#aaaaaa'); // Middle step
        this.rect(doorX - 6, y + 60, 26, 4, '#cccccc'); // Bottom step

        // --- BLACK STONE (Hajar al-Aswad) ---
        // Bottom Left Corner
        const bsX = Math.floor(x - this.camera.x);
        const bsY = Math.floor(y + 64 - this.camera.y - 5);
        // Silver Casing
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.beginPath();
        this.ctx.arc(bsX, bsY, 6, 0, Math.PI * 2);
        this.ctx.fill();
        // Stone
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(bsX, bsY, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSheep(x, y) {
        const sx = Math.floor(x - this.camera.x);
        const sy = Math.floor(y - this.camera.y);

        // Body
        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.fillRect(sx, sy, 12, 8);
        // Head
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(sx - 2, sy - 2, 6, 6);
        // Legs
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(sx + 2, sy + 8, 2, 3);
        this.ctx.fillRect(sx + 8, sy + 8, 2, 3);
        // Eye
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(sx, sy, 1, 1);
    }

    drawSign(x, y, text) {
        const sx = Math.floor(x - this.camera.x);
        const sy = Math.floor(y - this.camera.y);

        this.ctx.font = '6px monospace';
        const textWidth = this.ctx.measureText(text).width;
        const boardW = textWidth + 6;
        const boardH = 10;
        const boardX = sx - boardW / 2;

        // Post
        this.ctx.fillStyle = COLORS.STALL_WOOD;
        this.ctx.fillRect(sx - 1, sy + 10, 2, 10);

        // Board
        this.ctx.fillStyle = '#d2b48c'; // Tan
        this.ctx.fillRect(boardX, sy, boardW, boardH);
        this.ctx.strokeStyle = COLORS.STALL_WOOD;
        this.ctx.strokeRect(boardX, sy, boardW, boardH);

        // Arrow/Text
        this.ctx.fillStyle = '#3e2723';
        this.ctx.fillText(text, boardX + 3, sy + 7);
    }

    drawBarber(x, y) {
        const dx = Math.floor(x);
        const dy = Math.floor(y);

        // --- FEET ---
        this.rect(dx + 4, dy + 14, 3, 2, COLORS.BLACK);
        this.rect(dx + 9, dy + 14, 3, 2, COLORS.BLACK);

        // --- OUTFIT ---
        // Pants
        this.rect(dx + 4, dy + 12, 8, 3, COLORS.PANTS);
        // Shirt (Light blue professional look)
        const shirtColor = '#e3f2fd';
        this.rect(dx + 3, dy + 6, 10, 7, shirtColor);
        // Apron (Professional barber look)
        this.rect(dx + 4, dy + 7, 8, 6, '#5d4037');

        // --- ARMS ---
        this.rect(dx + 1, dy + 6, 3, 6, COLORS.SKIN);
        this.rect(dx + 12, dy + 6, 3, 6, COLORS.SKIN);
        // Sleeves
        this.rect(dx + 1, dy + 6, 3, 3, shirtColor);
        this.rect(dx + 12, dy + 6, 3, 3, shirtColor);

        // --- HEAD ---
        this.rect(dx + 4, dy, 8, 7, COLORS.SKIN);
        // Hair
        this.rect(dx + 4, dy, 8, 2, COLORS.HAIR);
        this.rect(dx + 3, dy + 1, 1, 3, COLORS.HAIR);
        this.rect(dx + 12, dy + 1, 1, 3, COLORS.HAIR);

        // Face Features
        this.rect(dx + 5, dy + 3, 2, 2, COLORS.BLACK); // Eye L
        this.rect(dx + 9, dy + 3, 2, 2, COLORS.BLACK); // Eye R

        // Mouth
        this.rect(dx + 6, dy + 6, 4, 1, '#ff8080'); // Small mouth

        // --- TOOLS (Right Hand) ---
        // Metal scissors
        this.rect(dx + 13, dy + 8, 5, 1, '#c0c0c0');
        this.rect(dx + 13, dy + 10, 5, 1, '#c0c0c0');
        this.rect(dx + 12, dy + 9, 2, 1, '#757575'); // Pivot
    }

    drawNPCInIhram(x, y) {
        const dx = x;
        const dy = y;
        const grey = '#aaaaaa';

        // --- FEET ---
        this.rect(dx + 4, dy + 14, 3, 2, COLORS.SKIN_DARK);
        this.rect(dx + 4, dy + 15, 3, 1, COLORS.SANDAL);
        this.rect(dx + 9, dy + 14, 3, 2, COLORS.SKIN_DARK);
        this.rect(dx + 9, dy + 15, 3, 1, COLORS.SANDAL);

        // --- BODY (Ihram) ---
        this.rect(dx + 3, dy + 6, 10, 9, COLORS.WHITE);
        this.rect(dx + 10, dy + 6, 3, 3, COLORS.SKIN_DARK); // Idtiba

        this.rect(dx + 3, dy + 8, 2, 1, COLORS.IHRAM_SHADOW);
        this.rect(dx + 11, dy + 10, 2, 1, COLORS.IHRAM_SHADOW);
        this.rect(dx + 4, dy + 12, 8, 1, COLORS.IHRAM_SHADOW);

        // --- ARMS ---
        this.rect(dx + 1, dy + 6, 3, 6, COLORS.SKIN_DARK);
        this.rect(dx + 12, dy + 6, 3, 6, COLORS.SKIN_DARK);

        // --- HEAD ---
        this.rect(dx + 4, dy, 8, 7, COLORS.SKIN_DARK);

        // Balding: Hair only on sides (grey)
        this.rect(dx + 3, dy + 1, 1, 3, grey); // Sideburn L
        this.rect(dx + 12, dy + 1, 1, 3, grey); // Sideburn R
        this.rect(dx + 4, dy, 1, 2, grey); // Top corner L
        this.rect(dx + 11, dy, 1, 2, grey); // Top corner R

        // Grey Beard
        this.rect(dx + 4, dy + 5, 8, 3, grey); // Beard bottom
        this.rect(dx + 3, dy + 4, 1, 2, grey); // Side beard L
        this.rect(dx + 12, dy + 4, 1, 2, grey); // Side beard R

        // Eyes
        this.rect(dx + 5, dy + 3, 2, 2, COLORS.BLACK);
        this.rect(dx + 9, dy + 3, 2, 2, COLORS.BLACK);
    }
}
