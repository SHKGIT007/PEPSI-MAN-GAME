class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.noteStep = 0;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (err) {
      // AudioContext init deferred until user gesture
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    }
    return this.isMuted;
  }

  // --- Sound Effects ---

  // Soda Can Pick Chime (Refreshing double ding)
  playCanPick() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    
    // First high note
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, t); // C6
    osc1.frequency.exponentialRampToValueAtTime(2093.0, t + 0.1); // C7
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.15);

    // Fizz sparkle
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Jump Whoosh
  playJump() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t); // A3
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.22); // A5
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Slide / Duck Swoosh
  playSlide() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Crash / Impact Explosion
  playCrash() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.4);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Shield Power-up Sound
  playPowerup() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.15);
    });
  }

  // --- Background Arcade Synth Beat Loop ---
  startBGM() {
    if (this.bgmPlaying || this.isMuted) return;
    this.init();
    this.bgmPlaying = true;
    this.noteStep = 0;

    // High energy Pepsi-Man style retro funk bass notes (C, Eb, F, F#, G)
    const bassNotes = [130.81, 155.56, 174.61, 185.00, 196.00, 174.61, 155.56, 130.81];
    const melodyNotes = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 783.99, 880.00];

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.bgmPlaying) return;
      const t = this.ctx.currentTime;

      // Bass synth
      const bassFreq = bassNotes[this.noteStep % bassNotes.length];
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, t);
      bassGain.gain.setValueAtTime(0.12, t);
      bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(t);
      bassOsc.stop(t + 0.15);

      // Hi-hat tick
      const hatBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
      const hatData = hatBuffer.getChannelData(0);
      for (let i = 0; i < hatData.length; i++) hatData[i] = Math.random() * 2 - 1;
      const hatSource = this.ctx.createBufferSource();
      hatSource.buffer = hatBuffer;
      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 7000;
      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.06, t);
      hatGain.gain.exponentialRampToValueAtTime(0.005, t + 0.03);
      hatSource.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.ctx.destination);
      hatSource.start(t);

      // Lead Synth (Every alternate beat)
      if (this.noteStep % 2 === 0) {
        const leadFreq = melodyNotes[(this.noteStep / 2) % melodyNotes.length];
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadFreq, t);
        leadGain.gain.setValueAtTime(0.08, t);
        leadGain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);
        leadOsc.connect(leadGain);
        leadGain.connect(this.ctx.destination);
        leadOsc.start(t);
        leadOsc.stop(t + 0.18);
      }

      this.noteStep++;
    }, 140); // Fast 140ms step interval = 107 BPM upbeat funk
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundEngine();
