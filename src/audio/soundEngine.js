// Procedural galactic audio engine — Web Audio API, fully offline
// BGM: opening=dynamic assault | heroSelect=space drift | worldMap=dark march | victory=triumph | story=cinematic drama
// Battle = silence — music returns only on hero victory

class SoundEngine {
  constructor() {
    this.ctx        = null
    this.masterGain = null
    this.bgGain     = null
    this.sfxGain    = null
    this.muted      = false
    this._theme     = null
    this._loopTimer = null
    this._loopActive = false
    this._kickBuf   = null
    this._hhBuf     = null
    this._snareBuf  = null
  }

  _init() {
    if (this.ctx) return true
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 1
      this.bgGain     = this.ctx.createGain(); this.bgGain.gain.value     = 0.20
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
    this._kickBuf  = mk(90,  (i, n) => (Math.random() * 2 - 1) * (1 - i / n) ** 2.2)
    this._hhBuf    = mk(22,  (i, n) => (Math.random() * 2 - 1) * (1 - i / n))
    this._snareBuf = mk(65,  (i, n) => (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.28)))
  }

  _resume() { if (this.ctx?.state === 'suspended') this.ctx.resume() }

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
    const play = () => {
      if (this._theme === name && this._loopActive) return
      this._stopLoop()
      this._theme = name
      this._loopActive = true
      this._playTheme()
    }
    // AudioContext.resume() é assíncrono — aguarda antes de tocar (fix iPad/iOS)
    if (this.ctx.state !== 'running') {
      this.ctx.resume().then(play).catch(play)
    } else {
      play()
    }
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
      victory:    () => this._victory(),
      story:      () => this._story(),
    }[this._theme]
    if (!fn) return
    const dur = fn()
    this._loopTimer = setTimeout(() => this._playTheme(), (dur - 0.18) * 1000)
  }

  // ── 1. OPENING — Hero Fanfare, 156 BPM, D major ───────────────────────────
  // Landing page: bright, heroic, energetic — D major for uplifting adventure feel
  _opening() {
    const b    = 60 / 156   // ~0.385s per beat
    const t    = this.ctx.currentTime + 0.02
    const loop = 8          // 2 bars of 4/4

    // ── IMPACT HIT on beat 1: crash burst + power chord ──
    for (let k = 0; k < 4; k++) {
      this._drum(this._hhBuf, 0, 5500 + k * 900, 0.16 - k * 0.03, t + k * 0.011)
    }
    this._bg(73.42,  b * 0.18, 'square',   0.24, t, 0.003)  // D2
    this._bg(110.00, b * 0.18, 'square',   0.18, t, 0.003)  // A2
    this._bg(146.83, b * 0.18, 'sawtooth', 0.13, t, 0.003)  // D3

    // ── HEROIC MELODY: D major ascending fanfare ──
    // D4  F#4  A4  D5 | A4   F#4  E4   D4  | F#4  A4  B4  A4 | F#4 E4  D4(2b)
    const mel = [
      [293.66,0.5],[369.99,0.5],[440.00,0.5],[587.33,0.5],
      [440.00,0.5],[369.99,0.5],[329.63,0.5],[293.66,0.5],
      [369.99,0.5],[440.00,0.5],[493.88,0.5],[440.00,0.5],
      [369.99,0.5],[329.63,0.5],[293.66,2.0],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      const d = beats * b * 0.78
      this._bg(f,         d, 'sawtooth', 0.16, t + cur * b, 0.008)
      this._bg(f * 1.004, d, 'sawtooth', 0.07, t + cur * b, 0.008)
      this._bg(f * 0.749, d * 0.80, 'triangle', 0.05, t + cur * b, 0.020) // 5th below
      cur += beats
    })

    // ── DRIVING BASS: D2/A2 alternating 8th notes ──
    for (let i = 0; i < loop * 2; i++) {
      const f = (i % 8 < 4) ? 73.42 : 110.00
      this._bg(f, b * 0.45, 'sine', 0.30, t + i * b * 0.5, 0.01)
    }

    // ── CHORD STABS: D/A/F# on every 2 beats ──
    [0, 2, 4, 6].forEach(beat => {
      this._bg(73.42,  b * 0.22, 'square', 0.13, t + beat * b, 0.005)
      this._bg(110.00, b * 0.22, 'square', 0.09, t + beat * b, 0.005)
    })

    // ── PERCUSSION: kick every beat, snare 2&4, 16th hihats, double-kick fill ──
    for (let i = 0; i < loop; i++) {
      this._drum(this._kickBuf,  160, 0, 0.40, t + i * b)
      if (i % 2 === 1) this._drum(this._snareBuf, 850, 0, 0.32, t + i * b)
      this._drum(this._hhBuf, 0, 9500, 0.070, t + i * b)
      this._drum(this._hhBuf, 0, 9500, 0.048, t + i * b + b * 0.25)
      this._drum(this._hhBuf, 0, 9500, 0.065, t + i * b + b * 0.5)
      this._drum(this._hhBuf, 0, 9500, 0.042, t + i * b + b * 0.75)
    }
    // Double-kick fill before last beat
    this._drum(this._kickBuf, 180, 0, 0.28, t + (loop - 1) * b - b * 0.5)
    this._drum(this._kickBuf, 180, 0, 0.24, t + (loop - 1) * b - b * 0.25)

    return loop * b
  }

  // ── 2. HERO SELECT — Space Drift, 80 BPM, Eb major ───────────────────────
  // Calmer but keeps the galactic synth palette — floating, majestic
  _heroSelect() {
    const b = 60 / 80       // 0.75s
    const t = this.ctx.currentTime + 0.05

    // Slow floating melody (triangle for softness)
    // Eb4 G4 Bb4 G4 | Eb4 F4 Ab4 Bb4 | C5 Bb4 G4 F4 | Eb4(long)
    const mel = [
      [311.13,1.0],[392.0,0.5],[466.16,0.5],
      [392.0,0.5],[311.13,0.5],[349.23,0.5],[415.30,0.5],
      [466.16,0.5],[523.25,0.5],[466.16,0.5],[392.0,0.5],
      [349.23,0.5],[311.13,1.5],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.90, 'triangle', 0.21, t + cur * b, 0.10)
      cur += beats
    })

    // Soft pad — octave below (sine)
    [[155.56,2],[207.65,2],[174.61,2],[155.56,2]].forEach(([f, beats], i) => {
      this._bg(f, beats * b * 0.94, 'sine', 0.13, t + i * 2 * b, 0.18)
    })

    // Arpeggio bass: gentle Eb2/Bb2/G2
    [155.56,116.54,98.0,116.54,155.56,116.54,87.31,116.54].forEach((f, i) => {
      this._bg(f, b * 0.60, 'sine', 0.18, t + i * b, 0.04)
    })

    // Sparse percussion: soft kick every 2 beats only
    for (let i = 0; i < 4; i++) {
      this._drum(this._kickBuf, 220, 0, 0.13, t + i * 2 * b)
      this._drum(this._hhBuf,   0, 6000, 0.025, t + i * 2 * b + b)
    }

    return 8 * b
  }

  // ── 3. WORLD MAP — Dark March, 108 BPM, B minor ───────────────────────────
  // More dramatic than hero select — tension, stakes, approaching battle
  _worldMap() {
    const b = 60 / 108      // 0.556s
    const t = this.ctx.currentTime + 0.05

    // Tense building melody (triangle)
    // B4 D5 A4 F#4 | G4 F#4 E4 D4 | B3 D4 F#4 A4 | B4(long)
    const mel = [
      [493.88,1.0],[587.33,1.0],[440.0,1.0],[369.99,1.0],
      [392.0,0.5],[369.99,0.5],[329.63,0.5],[293.66,0.5],
      [246.94,0.5],[293.66,0.5],[369.99,0.5],[440.0,0.5],
      [493.88,2.0],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.82, 'triangle', 0.21, t + cur * b, 0.06)
      cur += beats
    })

    // Staccato stabs — military quarter notes (square)
    [246.94,293.66,220.0,185.0,196.0,185.0,164.81,246.94].forEach((f, i) => {
      this._bg(f, b * 0.22, 'square', 0.10, t + i * b, 0.01)
    })

    // Pulsing bass — deep B2
    [123.47,123.47,98.0,98.0,110.0,123.47,110.0,123.47].forEach((f, i) => {
      this._bg(f, b * 0.58, 'sine', 0.28, t + i * b, 0.02)
    })

    // Military percussion: kick on 1&3, snare on 3, off-beat hihat
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) this._drum(this._kickBuf, 200, 0, 0.22, t + i * b)
      if (i % 4 === 2) this._drum(this._snareBuf, 600, 0, 0.24, t + i * b)
      this._drum(this._hhBuf, 0, 7500, 0.035, t + i * b + b * 0.5)
    }

    return 8 * b
  }

  // ── 4. VICTORY — Galactic Triumph, 128 BPM, C major ─────────────────────
  // Plays immediately when hero wins a battle — bright, celebratory
  _victory() {
    const b = 60 / 128      // 0.469s
    const t = this.ctx.currentTime + 0.05

    // Triumphant C major fanfare (triangle, bright)
    const mel = [
      [523.25,0.5],[659.25,0.5],[783.99,0.5],[523.25,0.5],
      [466.16,0.5],[392.0,0.5],[329.63,0.5],[261.63,0.5],
      [349.23,0.5],[440.0,0.5],[523.25,0.5],[659.25,0.5],
      [783.99,0.5],[523.25,0.5],[659.25,1.0],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.80, 'triangle', 0.23, t + cur * b, 0.03)
      cur += beats
    })

    // Harmony line
    [[261.63,2],[220.0,2],[174.61,2],[196.0,2]].forEach(([f, beats], i) => {
      this._bg(f, beats * b * 0.75, 'sine', 0.15, t + i * 2 * b, 0.08)
    })

    // Walking C major bass
    [130.81,164.81,196.0,164.81,174.61,196.0,261.63,196.0].forEach((f, i) => {
      this._bg(f, b * 0.65, 'sine', 0.22, t + i * b, 0.02)
    })

    // Full upbeat percussion
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) this._drum(this._kickBuf, 220, 0, 0.22, t + i * b)
      if (i % 2 === 1) this._drum(this._snareBuf, 600, 0, 0.18, t + i * b)
      this._drum(this._hhBuf, 0, 7000, 0.050, t + i * b + b * 0.25)
      this._drum(this._hhBuf, 0, 7000, 0.040, t + i * b + b * 0.5)
      this._drum(this._hhBuf, 0, 7000, 0.030, t + i * b + b * 0.75)
    }

    return 8 * b
  }

  // ── 5. STORY — Cinematic Drama, 76 BPM, A minor ──────────────────────────
  // Comic panels and opening/ending scenes: dramatic, less childish
  _story() {
    const b = 60 / 76      // 0.789s
    const t = this.ctx.currentTime + 0.05

    // "Strings" sawtooth melody — A minor, wide arcs
    const mel = [
      [440.0, 1.0], [523.25, 0.5], [659.25, 0.5],
      [880.0, 0.5], [783.99, 0.5], [698.46, 0.5], [659.25, 0.5],
      [587.33, 0.75], [523.25, 0.25], [493.88, 0.5], [440.0, 0.5],
      [392.0, 0.5], [329.63, 0.5], [440.0, 1.0],
    ]
    let cur = 0
    mel.forEach(([f, beats]) => {
      this._bg(f, beats * b * 0.78, 'sawtooth', 0.14, t + cur * b, 0.07)
      this._bg(f * 2, beats * b * 0.78, 'sine', 0.03, t + cur * b, 0.07)
      cur += beats
    })

    // Sustained pads: Am(4b) → Em(4b)
    [[110, 164.81, 220], [164.81, 246.94, 329.63]].forEach((notes, ci) => {
      notes.forEach(f => this._bg(f, 4 * b * 0.94, 'square', 0.055, t + ci * 4 * b, 0.22))
    })

    // Pulsing bass root
    [110, 110, 164.81, 110, 110, 110, 98.0, 110].forEach((f, i) => {
      this._bg(f, b * 0.46, 'sine', 0.25, t + i * b, 0.03)
    })

    // Off-beat triangle "pizzicato" accents — adds energy without childishness
    for (let i = 0; i < 8; i++) {
      this._bg(440.0, b * 0.11, 'triangle', 0.06, t + i * b + b * 0.5, 0.01)
    }

    // Half-time feel: kick on 1 & 5, snare on 3 & 7
    for (let i = 0; i < 2; i++) {
      this._drum(this._kickBuf,  160, 0, 0.25, t + i * 4 * b)
      this._drum(this._snareBuf, 500, 0, 0.20, t + i * 4 * b + 2 * b)
    }

    return 8 * b
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SOUND EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  playCorrect() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    [[523.25,0.12],[659.25,0.12],[783.99,0.12],[1046.5,0.28]].forEach(
      ([f, d], i) => this._note(f, d, 'sine', 0.32, t + i * 0.09)
    )
    this._note(1318.5, 0.20, 'sine', 0.16, t + 0.32)
  }

  playWrong() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    this._note(220, 0.18, 'sawtooth', 0.24, t)
    this._note(196, 0.18, 'sawtooth', 0.20, t + 0.12)
    this._note(165, 0.38, 'sawtooth', 0.18, t + 0.24)
  }

  playHeartLost() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    // Heavy impact then falling
    for (let i = 0; i < 2; i++) this._drum(this._kickBuf, 140, 0, 0.45, t + i * 0.07)
    this._note(330, 0.16, 'sine', 0.28, t)
    this._note(277, 0.16, 'sine', 0.24, t + 0.14)
    this._note(233, 0.50, 'sine', 0.22, t + 0.28)
  }

  // Big galactic fanfare — plays when entering the phase WIN screen
  playExplosion() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01

    // Percussion burst: 6 kicks + 3 snares
    for (let i = 0; i < 6; i++) this._drum(this._kickBuf, 140, 0, 0.50 - i * 0.04, t + i * 0.05)
    for (let i = 0; i < 4; i++) this._drum(this._snareBuf, 600, 0, 0.32, t + i * 0.07)

    // Two-octave rising sweep
    ;[261.63,329.63,392.0,493.88,523.25,659.25,783.99,987.77,1046.5,1318.5].forEach(
      (f, i) => this._note(f, i >= 7 ? 0.65 : 0.12, 'sine', 0.30, t + i * 0.06)
    )
    // Harmony sweep
    ;[196.0,246.94,293.66,369.99,392.0,493.88,587.33,739.99].forEach(
      (f, i) => this._note(f, i >= 5 ? 0.50 : 0.10, 'triangle', 0.18, t + i * 0.06 + 0.02)
    )

    // Sub bass boom
    this._note(55,    1.4, 'sine', 0.30, t)
    this._note(82.41, 1.0, 'sine', 0.24, t + 0.08)

    // High sparkle
    this._note(2093.0,  0.9, 'sine', 0.12, t + 0.50)
    this._note(1567.98, 0.7, 'sine', 0.10, t + 0.55)
  }

  // Dramatic defeat SFX — plays when entering the phase LOSE screen
  playDefeat() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01

    // Heavy bass drop
    this._note(110,   2.0, 'sine', 0.30, t)
    this._note(82.41, 2.2, 'sine', 0.24, t + 0.08)
    this._note(55,    1.5, 'sine', 0.22, t + 0.20)

    // Descending sawtooth — villain triumph phrase
    ;[440,392,349,311,277,247,220,196,165,147,110].forEach(
      (f, i) => this._note(f, 0.22, 'sawtooth', 0.18, t + i * 0.16)
    )

    // Percussion: 4 heavy thuds
    for (let i = 0; i < 4; i++) this._drum(this._kickBuf, 120, 0, 0.42 - i * 0.04, t + i * 0.20)
    for (let i = 0; i < 2; i++) this._drum(this._snareBuf, 400, 0, 0.28, t + 0.10 + i * 0.22)
  }

  playPhaseWin() {
    if (!this._init() || this.muted) return; this._resume()
    const t   = this.ctx.currentTime + 0.01
    const mel  = [523.25,659.25,783.99,659.25,783.99,1046.5,1318.5]
    const harm = [392,493.88,587.33,493.88,587.33,783.99,987.77]
    mel.forEach( (f, i) => this._note(f, i >= 5 ? 0.55 : 0.16, 'sine', 0.30, t + i * 0.12))
    harm.forEach((f, i) => this._note(f, i >= 5 ? 0.55 : 0.16, 'sine', 0.14, t + i * 0.12))
  }

  playVillainLaugh() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    ;[220,196,174.61,164.81,146.83,130.81].forEach(
      (f, i) => this._note(f, 0.20, 'sawtooth', 0.18, t + i * 0.14)
    )
    this._note(110, 0.8, 'sawtooth', 0.14, t + 0.9)
  }

  playBossIntro() {
    if (!this._init() || this.muted) return; this._resume()
    const t = this.ctx.currentTime + 0.01
    this._note(110,   2.2, 'sawtooth', 0.20, t)
    this._note(73.42, 2.6, 'square',   0.12, t)
    this._note(880,   0.7, 'sawtooth', 0.10, t + 0.3)
    this._note(440,   0.5, 'sawtooth', 0.08, t + 0.7)
    for (let i = 0; i < 3; i++) this._drum(this._kickBuf, 130, 0, 0.38, t + i * 0.12)
  }

  playClick() {
    if (!this._init() || this.muted) return; this._resume()
    this._note(1000, 0.04, 'sine', 0.12, this.ctx.currentTime + 0.01)
  }

  stopBgMusic()  { this._stopLoop() }
  startBgMusic() { this.startTheme('opening') }

  toggleMute() {
    if (!this._init()) return this.muted
    this.muted = !this.muted
    this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.1)
    return this.muted
  }

  get isMuted() { return this.muted }
}

export const soundEngine = new SoundEngine()
