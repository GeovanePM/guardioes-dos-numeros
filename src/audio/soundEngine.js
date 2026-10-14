// Procedural audio engine — 4 distinct BGM themes + SFX, Web Audio API, fully offline

class SoundEngine {
  constructor() {
    this.ctx        = null
    this.masterGain = null
    this.bgGain     = null
    this.sfxGain    = null
    this.muted      = false
    this._theme     = null    // current theme name
    this._loopTimer = null
    this._loopActive = false
    this._kickBuf   = null
    this._hhBuf     = null
    this._snareBuf  = null
  }

  // ─── Initialise AudioContext (requires prior user gesture) ─────────────────
  _init() {
    if (this.ctx) return true
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 1
      this.bgGain     = this.ctx.createGain(); this.bgGain.gain.value     = 0.18
      this.sfxGain    = this.ctx.createGain(); this.sfxGain.gain.value    = 0.52
      this.bgGain.connect(this.masterGain)
      this.sfxGain.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)
      this._makePercBufs()
      return true
    } catch { return false }
  }

  _makePercBufs() {
    const sr = this.ctx.sampleRate
    const mk = (ms, fn) => {
      const n = Math.floor(sr * ms / 1000)
      const b = this.ctx.createBuffer(1, n, sr)
      const d = b.getChannelData(0)
      for (let i = 0; i < n; i++) d[i] = fn(i, n)
      return b
    }
    // kick: thump
    this._kickBuf  = mk(80,  (i, n) => (Math.random() * 2 - 1) * (1 - i / n) ** 2)
    // hi-hat: bright white noise
    this._hhBuf    = mk(25,  (i, n) => (Math.random() * 2 - 1) * (1 - i / n))
    // snare: mid noise pop
    this._snareBuf = mk(60,  (i, n) => (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.3)))
  }

  _resume() { if (this.ctx?.state === 'suspended') this.ctx.resume() }

  // ─── note → sfxGain ───────────────────────────────────────────────────────
  _note(freq, dur, type, vol, t) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const g   = this.ctx.createGain()
    osc.type = type; osc.frequency.value = freq
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(dur * 0.9, 0.01))
    osc.connect(g); g.connect(this.sfxGain)
    osc.start(t); osc.stop(t + dur + 0.01)
  }

  // ─── bg note → bgGain ─────────────────────────────────────────────────────
  _bg(freq, dur, type, vol, t, attack = 0.04) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const g   = this.ctx.createGain()
    osc.type = type; osc.frequency.value = freq
    g.gain.setValueAtTime(0.001, t)
    g.gain.linearRampToValueAtTime(vol, t + attack)
    g.gain.setValueAtTime(vol, t + dur - 0.06)
    g.gain.linearRampToValueAtTime(0.001, t + dur)
    osc.connect(g); g.connect(this.bgGain)
    osc.start(t); osc.stop(t + dur + 0.02)
  }

  // ─── percussion hit ───────────────────────────────────────────────────────
  _drum(buf, lpfHz, hpfHz, vol, t) {
    if (!buf || !this.ctx) return
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    const filt = this.ctx.createBiquadFilter()
    filt.type = lpfHz ? 'lowpass' : 'highpass'
    filt.frequency.value = lpfHz || hpfHz
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + buf.duration)
    src.connect(filt); filt.connect(g); g.connect(this.bgGain)
    src.start(t); src.stop(t + buf.duration + 0.01)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BGM THEMES
  // ═══════════════════════════════════════════════════════════════════════════

  startTheme(name) {
    if (!this._init()) return
    this._resume()
    if (this._theme === name && this._loopActive) return
    this._stopLoop()
    this._theme = name
    this._loopActive = true
    this._playTheme()
  }

  _stopLoop() {
    this._loopActive = false
    if (this._loopTimer) { clearTimeout(this._loopTimer); this._loopTimer = null }
  }

  _playTheme() {
    if (!this._loopActive || !this.ctx) return
    this._resume()
    const fn = {
      opening:    () => this._opening(),
      heroSelect: () => this._heroSelect(),
      worldMap:   () => this._worldMap(),
      battle:     () => this._battle(),
    }[this._theme] || (() => this._opening())
    const dur = fn()
    this._loopTimer = setTimeout(() => this._playTheme(), (dur - 0.18) * 1000)
  }

  // ── 1. OPENING — Dramatic E-minor, 58 BPM ─────────────────────────────────
  _opening() {
    const b  = 60 / 58       // beat = 1.034s
    const t  = this.ctx.currentTime + 0.05
    // Melody: E4 D4 B3 G3 A3 B3 D4 E4 (8 beats)
    const mel = [
      [329.63,1],[293.66,1],[246.94,1],[196.0,1.5],
      [220.0,0.5],[246.94,1],[293.66,1],[329.63,1],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.88, 'triangle', 0.22, t + cur * b, 0.06)
      cur += beats
    })
    // Harmony (fifth above on beats 1, 3, 5, 7)
    const harm = [
      [493.88,1],[440.0,1],[369.99,1],[293.66,2],
      [329.63,1],[369.99,1],[440.0,1],[493.88,1],
    ]
    cur = 0
    harm.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.7, 'sine', 0.08, t + cur * b, 0.08)
      cur += beats
    })
    // Bass drone E2 + B2
    this._bg(82.41,  8 * b, 'sine', 0.13, t, 0.2)
    this._bg(123.47, 8 * b, 'sine', 0.07, t, 0.2)
    // Slow kick on every 2 beats
    for (let i = 0; i < 4; i++) this._drum(this._kickBuf, 160, 0, 0.18, t + i * 2 * b)
    return 8 * b
  }

  // ── 2. HERO SELECT — Upbeat C-major, 92 BPM ───────────────────────────────
  _heroSelect() {
    const b  = 60 / 92
    const t  = this.ctx.currentTime + 0.05
    // Melody: C4 E4 G4 E4 C4 D4 F4 A4 G4 E4 C4 D4 C4(long) (8 beats in 8ths)
    const mel = [
      [261.63,0.5],[329.63,0.5],[392.0,0.5],[329.63,0.5],
      [261.63,0.5],[293.66,0.5],[349.23,0.5],[440.0,0.5],
      [392.0,0.5],[329.63,0.5],[261.63,0.5],[293.66,0.5],
      [261.63,2],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.8, 'triangle', 0.18, t + cur * b, 0.02)
      cur += beats
    })
    // Counter melody (lower octave, quarter notes)
    const bass_mel = [
      [130.81,1],[196.0,1],[261.63,1],[196.0,1],
      [174.61,1],[261.63,1],[196.0,1],[130.81,1],
    ]
    cur = 0
    bass_mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.75, 'sine', 0.14, t + cur * b, 0.03)
      cur += beats
    })
    // Bass: C2 G2 alternating every beat
    for (let i = 0; i < 8; i++) {
      this._bg(i % 2 === 0 ? 65.41 : 98.0, b * 0.7, 'sine', 0.15, t + i * b, 0.02)
    }
    // Kick 1&3, hihat 8ths
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) this._drum(this._kickBuf, 200, 0, 0.2, t + i * b)
      this._drum(this._hhBuf, 0, 7000, 0.05, t + i * b + b * 0.5)
    }
    return 8 * b
  }

  // ── 3. WORLD MAP — Exploration G-major, 76 BPM ────────────────────────────
  _worldMap() {
    const b  = 60 / 76
    const t  = this.ctx.currentTime + 0.05
    // Melody: G4 A4 B4 D5 B4 G4 A4 G4(long)
    const mel = [
      [392.0,1],[440.0,1],[493.88,0.5],[587.33,0.5],
      [493.88,1],[392.0,1],[440.0,1],[392.0,2],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.85, 'triangle', 0.2, t + cur * b, 0.04)
      cur += beats
    })
    // Walking bass line G D E D C G D G
    const bassLine = [
      [98.0,1],[146.83,1],[164.81,1],[146.83,1],
      [130.81,1],[98.0,1],[146.83,1],[98.0,1],
    ]
    cur = 0
    bassLine.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.65, 'sine', 0.16, t + cur * b, 0.02)
      cur += beats
    })
    // Light percussion: kick on 1&3, hihat off-beat
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) this._drum(this._kickBuf, 250, 0, 0.14, t + i * b)
      this._drum(this._hhBuf, 0, 7500, 0.03, t + i * b + b * 0.5)
    }
    return 8 * b
  }

  // ── 4. BATTLE — Intense A-minor action, 128 BPM ───────────────────────────
  _battle() {
    const b  = 60 / 128      // beat = 0.469s
    const t  = this.ctx.currentTime + 0.05
    // Fast melody in 8ths: A3 C4 E4 A4 G4 E4 F4 E4 | D4 E4 A3 C4 E4 A4 G4 A4
    const mel = [
      [220.0,0.5],[261.63,0.5],[329.63,0.5],[440.0,0.5],
      [392.0,0.5],[329.63,0.5],[349.23,0.5],[329.63,0.5],
      [293.66,0.5],[329.63,0.5],[220.0,0.5],[261.63,0.5],
      [329.63,0.5],[440.0,0.5],[392.0,1],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.72, 'sawtooth', 0.13, t + cur * b, 0.01)
      cur += beats
    })
    // Harmony power chord 5ths
    const harm = [
      [329.63,1],[392.0,1],[523.25,1],[392.0,1],
      [349.23,1],[523.25,1],[392.0,1],[440.0,1],
    ]
    cur = 0
    harm.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.6, 'square', 0.06, t + cur * b, 0.02)
      cur += beats
    })
    // Heavy bass: A1/A2 every beat
    for (let i = 0; i < 8; i++) {
      const freq = [55.0, 110.0, 55.0, 82.41, 55.0, 110.0, 73.42, 55.0][i]
      this._bg(freq, b * 0.6, 'sine', 0.2, t + i * b, 0.01)
    }
    // Driving percussion: kick every beat, snare on 2&4, rapid hihat 16ths
    for (let i = 0; i < 8; i++) {
      this._drum(this._kickBuf,  200, 0,    0.22, t + i * b)
      if (i % 2 === 1) this._drum(this._snareBuf, 600, 0, 0.2, t + i * b)
      this._drum(this._hhBuf, 0, 8000, 0.05, t + i * b + b * 0.25)
      this._drum(this._hhBuf, 0, 8000, 0.04, t + i * b + b * 0.5)
      this._drum(this._hhBuf, 0, 8000, 0.03, t + i * b + b * 0.75)
    }
    return 8 * b
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SOUND EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  playCorrect() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    [[523.25,0.13],[659.25,0.13],[783.99,0.13],[1046.5,0.25]].forEach(
      ([f, d], i) => this._note(f, d, 'sine', 0.3, t + i * 0.1)
    )
  }

  playWrong() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    this._note(220, 0.2, 'sawtooth', 0.22, t)
    this._note(165, 0.35, 'sawtooth', 0.18, t + 0.14)
  }

  playHeartLost() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    this._note(330, 0.18, 'sine', 0.25, t)
    this._note(247, 0.42, 'sine', 0.2,  t + 0.16)
  }

  playPhaseWin() {
    if (!this._init() || this.muted) return; this._resume()
    const t   = this.ctx.currentTime + 0.01
    const mel  = [523.25,659.25,783.99,659.25,783.99,1046.5]
    const harm = [392,493.88,587.33,493.88,587.33,783.99]
    mel.forEach( (f, i) => this._note(f, i===5?0.55:0.18, 'sine', 0.3,  t + i*0.13))
    harm.forEach((f, i) => this._note(f, i===5?0.55:0.18, 'sine', 0.14, t + i*0.13))
  }

  playExplosion() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    // Percussion burst
    for (let i = 0; i < 4; i++) this._drum(this._kickBuf, 300, 0, 0.4, t + i * 0.06)
    // Rising fanfare
    ;[523.25,659.25,783.99,1046.5,1318.5].forEach(
      (f, i) => this._note(f, 0.18, 'sine', 0.28, t + i * 0.08)
    )
    // Low boom
    this._note(55, 0.6, 'sine', 0.22, t)
    this._note(82.41, 0.4, 'sine', 0.18, t + 0.1)
  }

  playVillainLaugh() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    // Menacing descending phrase
    ;[220,196,174.61,164.81,146.83,130.81].forEach(
      (f, i) => this._note(f, 0.2, 'sawtooth', 0.18, t + i * 0.14)
    )
    this._note(110, 0.8, 'sawtooth', 0.14, t + 0.9)
  }

  playBossIntro() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    this._note(110,   2.0, 'sawtooth', 0.18, t)
    this._note(73.42, 2.5, 'square',   0.1,  t)
    this._note(880,   0.6, 'sawtooth', 0.08, t + 0.3)
  }

  playClick() {
    if (!this._init() || this.muted) return; this._resume()
    this._note(900, 0.04, 'sine', 0.12, this.ctx.currentTime + 0.01)
  }

  // ─── startBgMusic kept for compatibility (now just starts 'opening') ──────
  startBgMusic() { this.startTheme('opening') }
  stopBgMusic()  { this._stopLoop() }

  toggleMute() {
    if (!this._init()) return this.muted
    this.muted = !this.muted
    this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.1)
    return this.muted
  }

  get isMuted() { return this.muted }
}

export const soundEngine = new SoundEngine()
