// --- AUDIO MANAGER ---
// Procedural 8-bit sound effects using Web Audio API

class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.busOscillator = null;
        this.busGain = null;
    }

    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Play a simple tone
    playTone(frequency, duration, type = 'square', volume = 0.15) {
        if (!this.initialized) return;

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
    playNoise(duration, volume = 0.1) {
        if (!this.initialized) return;

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
        filter.frequency.value = 1000;

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    // --- SOUND EFFECTS ---

    // Footstep - quick soft blip
    playFootstep() {
        this.playTone(150 + Math.random() * 50, 0.05, 'square', 0.05);
    }

    // Bus engine - more car-like engine hum (looping)
    startBusEngine() {
        if (!this.initialized || this.busOscillator) return;

        this.busOscillator = this.ctx.createOscillator();
        this.busGain = this.ctx.createGain();
        const noiseGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const engineFilter = this.ctx.createBiquadFilter();

        // Main engine tone - use sawtooth with heavy lowpass for a "throaty" car sound
        this.busOscillator.type = 'sawtooth';
        this.busOscillator.frequency.value = 60;

        engineFilter.type = 'lowpass';
        engineFilter.frequency.value = 150;
        engineFilter.Q.value = 2;

        // Create noise rumble
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        filter.type = 'lowpass';
        filter.frequency.value = 100;

        noiseGain.gain.value = 0.05;
        this.busGain.gain.value = 0.12;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        this.busOscillator.connect(engineFilter);
        engineFilter.connect(this.busGain);
        this.busGain.connect(this.ctx.destination);

        this.busOscillator.start();
        noise.start();

        this.busNoiseSource = noise;
    }

    stopBusEngine() {
        if (this.busOscillator) {
            this.busOscillator.stop();
            this.busOscillator = null;
        }
        if (this.busNoiseSource) {
            this.busNoiseSource.stop();
            this.busNoiseSource = null;
        }
        this.busGain = null;
    }

    // Throw - rising whoosh
    playThrow() {
        if (!this.initialized) return;

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

    // Impact - quick thud
    playImpact() {
        if (!this.initialized) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
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

    // Sacrifice - metallic knife/sword "shing"
    playSacrifice() {
        if (!this.initialized) return;

        // Metallic "shing" - high frequency sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(4000, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Add a high-pass noise burst for the friction
        const duration = 0.2;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 3000;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start();
        noise.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Hair trim - electric buzzing trimmer
    playTrim() {
        if (!this.initialized) return;

        // Buzzing sound - low sawtooth with LFO
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 120;

        lfo.frequency.value = 50; // High speed vibration
        lfoGain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain); // Modulate volume for vibration feel

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.4); // Sustain
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5); // End

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        lfo.start();
        osc.stop(this.ctx.currentTime + 0.5);
        lfo.stop(this.ctx.currentTime + 0.5);
    }

    // UI click/select
    playSelect() {
        this.playTone(440, 0.05, 'square', 0.1);
    }
}
