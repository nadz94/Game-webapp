// --- INPUT HANDLING ---
class Input {
    constructor() {
        this.keys = {};
        this.prevKeys = {};
        this.firstInteraction = false;
        this.onFirstInteraction = null;

        window.addEventListener('keydown', (e) => {
            this.triggerFirstInteraction();
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Use capture phase or just ensure it runs for all events
        window.addEventListener('touchstart', () => this.triggerFirstInteraction(), { passive: true });
        window.addEventListener('mousedown', () => this.triggerFirstInteraction(), { passive: true });

        // Initial Bindings
        this.bindTouch('btn-up', 'ArrowUp');
        this.bindTouch('btn-down', 'ArrowDown');
        this.bindTouch('btn-left', 'ArrowLeft');
        this.bindTouch('btn-right', 'ArrowRight');
        this.bindTouch('btn-action', 'Space');
    }

    triggerFirstInteraction() {
        if (!this.firstInteraction) {
            this.firstInteraction = true;
            if (this.onFirstInteraction) this.onFirstInteraction();
        }
    }

    bindTouch(elementId, keyCode) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const setKey = (active) => {
            this.keys[keyCode] = active;
        };

        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerFirstInteraction(); // Explicitly trigger audio unlock
            setKey(true);
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.triggerFirstInteraction();
            setKey(false);
        }, { passive: false });

        el.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.triggerFirstInteraction();
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
