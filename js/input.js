// --- INPUT HANDLING ---
class Input {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.firstInteraction = false;
        this.onFirstInteraction = null;

        const handleFirstInteraction = () => {
            if (!this.firstInteraction) {
                this.firstInteraction = true;
                if (this.onFirstInteraction) this.onFirstInteraction();
                // Remove listeners to cleanup? No, we still need them for input.
            }
        };

        window.addEventListener('keydown', (e) => {
            handleFirstInteraction();
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Use capture phase or just ensure it runs for all events
        window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
        window.addEventListener('mousedown', handleFirstInteraction, { passive: true });

        // Initial Bindings
        this.initJoystick();
        this.bindTouch('btn-action', 'Space');
    }

    initJoystick() {
        const zone = document.getElementById('joystick-zone');
        const base = document.getElementById('joystick-base');
        const stick = document.getElementById('joystick-stick');
        if (!zone || !base || !stick) return;

        let active = false;
        let rect, centerX, centerY, maxDist;

        const updateGeometry = () => {
            rect = base.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
            maxDist = rect.width / 2;
        };

        const handleMove = (e) => {
            if (!active) return;
            const touch = e.targetTouches ? e.targetTouches[0] : e;
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Limit stick movement to radius
            const ratio = dist > maxDist ? maxDist / dist : 1;
            const lx = dx * ratio;
            const ly = dy * ratio;

            // Update UI
            stick.style.left = `${50 + (lx / maxDist) * 50}%`;
            stick.style.top = `${50 + (ly / maxDist) * 50}%`;
            stick.style.background = 'rgba(255, 255, 255, 0.7)';

            // Set digital keys based on direction (threshold 0.3)
            const th = 0.3;
            const nx = lx / maxDist;
            const ny = ly / maxDist;

            this.keys['ArrowUp'] = ny < -th;
            this.keys['ArrowDown'] = ny > th;
            this.keys['ArrowLeft'] = nx < -th;
            this.keys['ArrowRight'] = nx > th;
        };

        const handleEnd = () => {
            active = false;
            stick.style.left = stick.style.top = '50%';
            stick.style.background = '';
            this.keys['ArrowUp'] = this.keys['ArrowDown'] = false;
            this.keys['ArrowLeft'] = this.keys['ArrowRight'] = false;
        };

        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            active = true;
            updateGeometry();
            handleMove(e);
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handleMove(e);
        }, { passive: false });

        zone.addEventListener('touchend', handleEnd);
        zone.addEventListener('touchcancel', handleEnd);

        // Optional: Mouse support for testing in dev tools
        zone.addEventListener('mousedown', (e) => {
            active = true;
            updateGeometry();
            handleMove(e);
            const moveHandler = (me) => handleMove(me);
            const upHandler = () => {
                handleEnd();
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', upHandler);
            };
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
        });
    }

    bindTouch(elementId, keyCode) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const setKey = (active) => {
            this.keys[keyCode] = active;
        };

        el.addEventListener('touchstart', (e) => { e.preventDefault(); setKey(true); }, { passive: false });
        el.addEventListener('touchend', (e) => { e.preventDefault(); setKey(false); }, { passive: false });

        el.addEventListener('mousedown', (e) => { e.preventDefault(); setKey(true); });
        el.addEventListener('mouseup', (e) => { e.preventDefault(); setKey(false); });
        el.addEventListener('mouseleave', (e) => { setKey(false); });
    }

    update() {
        this.prevKeys = { ...this.keys };
    }

    isDown(code) {
        return !!this.keys[code];
    }

    isJustPressed(code) {
        return !!this.keys[code] && !this.prevKeys[code];
    }
}
