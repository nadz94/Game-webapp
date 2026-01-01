// --- INPUT HANDLING ---
class Input {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.onInteraction = null;

        window.addEventListener('keydown', (e) => {
            this.triggerInteraction();
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Use capture phase or just ensure it runs for all events
        window.addEventListener('touchstart', () => this.triggerInteraction(), { passive: true });
        window.addEventListener('mousedown', () => this.triggerInteraction(), { passive: true });

        // Initial Bindings
        this.bindTouch('btn-up', 'ArrowUp');
        this.bindTouch('btn-down', 'ArrowDown');
        this.bindTouch('btn-left', 'ArrowLeft');
        this.bindTouch('btn-right', 'ArrowRight');
        this.bindTouch('btn-action', 'Space');
    }

    triggerInteraction() {
        if (this.onInteraction) this.onInteraction();
    }

    bindTouch(elementId, keyCode) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const setKey = (active) => {
            this.keys[keyCode] = active;
        };

        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerInteraction(); // Explicitly trigger audio unlock
            setKey(true);
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.triggerInteraction();
            setKey(false);
        }, { passive: false });

        el.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.triggerInteraction();
            setKey(true);
        });

        el.addEventListener('mouseup', (e) => {
            e.preventDefault();
            setKey(false);
        });
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
