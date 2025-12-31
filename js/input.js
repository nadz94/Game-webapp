// --- INPUT HANDLING ---
class Input {
    constructor() {
        this.keys = {};
        this.prevKeys = {};

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Touch Control Bindings
        this.bindTouch('btn-up', 'ArrowUp');
        this.bindTouch('btn-down', 'ArrowDown');
        this.bindTouch('btn-left', 'ArrowLeft');
        this.bindTouch('btn-right', 'ArrowRight');
        this.bindTouch('btn-action', 'Space');
    }

    bindTouch(elementId, keyCode) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const setKey = (active) => {
            this.keys[keyCode] = active;
        };

        el.addEventListener('touchstart', (e) => { e.preventDefault(); setKey(true); }, { passive: false });
        el.addEventListener('touchend', (e) => { e.preventDefault(); setKey(false); }, { passive: false });
        // Also handle mouse for testing on desktop if controls are visible
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
