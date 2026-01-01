// --- AUDIO MANAGER ---
// Mixed Procedural (Web Audio API) and File-based (HTML5 Audio Pool)

class SoundPool {
    constructor(src, size = 5) {
        this.pool = [];
        this.index = 0;
        for (let i = 0; i < size; i++) {
            const audio = new Audio(src);
            audio.preload = 'auto'; // Hint to browser to load it
            this.pool.push(audio);
        }
    }

    play(volume = 1.0) {
        const sound = this.pool[this.index];
        sound.currentTime = 0;
        sound.volume = volume;
        sound.play().catch(e => {
            // Ignore abort errors from rapid playback rewinds, warn on others
            if (e.name !== 'AbortError') console.warn('Audio play failed', e);
        });

        // Round-robin selection
        this.index = (this.index + 1) % this.pool.length;
        return sound;
    }
}

class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;

        // Initialize Sound Pools for frequent sounds
        this.pools = {
            impact: new SoundPool('sounds/rock-impact.mp3', 5),
            sacrifice: new SoundPool('sounds/sacrifice.mp3', 3), // Less frequent
            trim: new SoundPool('sounds/barber-clipper.mp3', 3),
            sheep: new SoundPool('sounds/Sheep.mp3', 4)
        };

        // Single instances for loops or background
        this.sounds = {
            bus: new Audio('sounds/bus-engine.mp3')
        };
        this.sounds.bus.loop = true;
    }

    // Aggressive Resume: Call this on ANY user interaction
    resumeContext() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
            } catch (e) {
                console.warn('Web Audio API not supported', e);
                return;
            }
        }

        if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
            this.ctx.resume().then(() => {
                // Success
            }).catch(e => console.warn('Audio resume failed', e));
        }

        // Always try to wake up the engine with a silent oscillator
        this.tryWakeUp();
    }

    // Alias for compatibility
    init() {
        this.resumeContext();
    }

    tryWakeUp() {
        if (!this.ctx) return;
        try {
            const buffer = this.ctx.createBuffer(1, 1, 22050);
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.ctx.destination);
            source.start(0);
        } catch (e) {
            // Ignore
        }
    }

    // Play a simple tone
    playTone(frequency, duration, type = 'square', volume = 0.15) {
        if (!this.initialized) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Play noise burst
    playNoise(duration, volume = 0.1, frequency = 1000) {
        if (!this.initialized) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        noise.buffer = buffer;
        filter.type = 'lowpass';
        filter.frequency.value = frequency;

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        // Exponential ramp can approach 0 too fast with low initial volume
        // Linear ramp is safer for short percussive sounds
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    // --- SOUND EFFECTS ---

    // Footstep - procedural noise
    playFootstep() {
        // "Mario-like" subtle tap: Low pass, short duration
        // Increased volume to 0.14
        this.playNoise(0.04, 0.18, 350);
    }

    // Bus engine - loop mp3
    startBusEngine() {
        this.sounds.bus.volume = 0.5;
        this.sounds.bus.play().catch(e => console.log('Bus audio failed', e));
    }

    stopBusEngine() {
        this.sounds.bus.pause();
        this.sounds.bus.currentTime = 0;
    }

    // Throw - rising whoosh
    playThrow() {
        if (!this.initialized) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // Impact - rock impact mp3
    playImpact() {
        this.pools.impact.play(0.6);
    }

    // Collect - bright pickup chime
    playCollect() {
        this.playTone(880, 0.08, 'square', 0.15);
        setTimeout(() => this.playTone(1320, 0.1, 'square', 0.1), 50);
    }

    // Prayer/Sleep complete - gentle ascending chime
    playComplete() {
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2, 'triangle', 0.15), i * 100);
        });
    }

    // Stage complete - short jingle
    playStageComplete() {
        const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15, 'square', 0.15), i * 80);
        });
    }

    // Celebration - victory fanfare
    playCelebration() {
        const melody = [
            { note: 523, time: 0 },      // C5
            { note: 523, time: 100 },    // C5
            { note: 523, time: 200 },    // C5
            { note: 659, time: 350 },    // E5
            { note: 784, time: 500 },    // G5
            { note: 1047, time: 700 }    // C6
        ];

        melody.forEach(({ note, time }) => {
            setTimeout(() => this.playTone(note, 0.2, 'square', 0.15), time);
        });
    }

    // Sacrifice - sacrifice mp3
    playSacrifice() {
        this.pools.sacrifice.play(0.6);
    }

    // Hair trim - barber clipper mp3
    playTrim() {
        return this.pools.trim.play(0.6);
    }

    // Sheep sound - new
    playSheep() {
        this.pools.sheep.play(0.6);
    }

    // UI click/select
    playSelect() {
        this.playTone(440, 0.05, 'square', 0.1);
    }
}
