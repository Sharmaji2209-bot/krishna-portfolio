/**
 * Interactive Dual-Stream Perception & Depth Heatmap Dashboard Simulator
 * Replicates the real-time functionality of Krishna's Flask + OpenCV + PyTorch
 * depth navigation assistant with Inferno colormap, live telemetry, and Blackbox logger.
 */

export class DepthDashboardSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.alpha = 450.0;
    this.nightVision = false;
    this.voiceEnabled = true;
    this.audioSpatialEnabled = true;
    this.p80Enabled = true;
    this.streamFps = 60;
    this.inferenceHz = 14.8;
    this.frameCount = 0;
    this.lastBreachTime = 0;
    this.audioCtx = null;
    this.currentSceneId = 'classroom_lab';

    // Obstacles in current perception field
    this.detections = [
      { id: 1, class: "person", zone: "CENTER", x: 260, y: 80, w: 120, h: 320, disparity: 380, p80_disparity: 420, mean_disparity: 195, conf: 0.93, vertical: "NORMAL" },
      { id: 2, class: "chair", zone: "LEFT", x: 70, y: 220, w: 110, h: 180, disparity: 210, p80_disparity: 235, mean_disparity: 140, conf: 0.89, vertical: "NORMAL" },
      { id: 3, class: "door", zone: "RIGHT", x: 440, y: 110, w: 140, h: 290, disparity: 130, p80_disparity: 145, mean_disparity: 110, conf: 0.84, vertical: "NORMAL" }
    ];

    this.incidents = [];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.loadScenesFromBackend();
    this.loadIncidentsFromBackend();
    this.startPerceptionLoop();
  }

  async loadScenesFromBackend() {
    try {
      const res = await fetch('/api/depth/scenes');
      const data = await res.json();
      if (data.success && data.scenes) {
        this.backendScenes = data.scenes;
        const selector = document.getElementById('scene-select');
        if (selector) {
          selector.innerHTML = data.scenes.map(s => `
            <option value="${s.id}" ${s.id === this.currentSceneId ? 'selected' : ''}>${s.name} (${s.environment})</option>
          `).join('');
        }
      }
    } catch (e) {
      console.warn('Could not load backend scenes', e);
    }
  }

  async loadIncidentsFromBackend() {
    try {
      const res = await fetch('/api/depth/incidents');
      const data = await res.json();
      if (data.success && data.incidents) {
        this.incidents = data.incidents;
        this.renderIncidentsList();
      }
    } catch (e) {
      console.warn('Could not load incidents', e);
    }
  }

  renderIncidentsList() {
    const listEl = document.getElementById('sqlite-incidents-list');
    if (!listEl) return;
    if (this.incidents.length === 0) {
      listEl.innerHTML = `<div class="p-2 text-slate-500">No collision breaches recorded yet. Click 'Simulate Near Breach' to trigger.</div>`;
      return;
    }
    listEl.innerHTML = this.incidents.slice(0, 5).map(inc => `
      <div class="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-white/5 text-[11px] font-mono">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full ${inc.threat_level === 'CRITICAL' ? 'bg-red-400' : 'bg-amber-400'}"></span>
          <span class="font-bold text-white">${inc.obstacle_name.toUpperCase()}</span>
          <span class="text-slate-400">@ ${inc.distance_m}m (${inc.direction_zone})</span>
        </div>
        <div class="text-slate-500 text-[10px]">${inc.timestamp || inc.created_at || 'Just now'}</div>
      </div>
    `).join('');
  }

  switchScene(sceneId) {
    this.currentSceneId = sceneId;
    if (this.backendScenes) {
      const found = this.backendScenes.find(s => s.id === sceneId);
      if (found) {
        this.detections = found.detections.map(d => ({
          ...d,
          p80_disparity: d.p80_disparity || d.disparity * 1.1,
          mean_disparity: d.mean_disparity || d.disparity * 0.65
        }));
        this.updateP80Histogram();
        return;
      }
    }
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSpatialPing(azimuth = 'CENTER', distanceM = 1.0) {
    if (!this.audioSpatialEnabled) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Frequency inversely proportional to distance (closer = higher pitch)
      // 0.5m -> 880 Hz (High alert), 3.0m -> 320 Hz (Low alert)
      const freq = Math.max(280, Math.min(1050, 400 + (3.0 - Math.min(distanceM, 3.0)) * 250));
      osc.type = distanceM < 0.8 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Stereo Panning
      let panVal = 0.0;
      if (azimuth === 'LEFT') panVal = -0.85;
      else if (azimuth === 'RIGHT') panVal = 0.85;

      if (this.audioCtx.createStereoPanner) {
        const panner = this.audioCtx.createStereoPanner();
        panner.pan.setValueAtTime(panVal, this.audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.audioCtx.destination);
      } else {
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
      }

      // Quick audio envelope
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (distanceM < 0.8 ? 0.22 : 0.14));

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio spatial ping failed', e);
    }
  }

  updateP80Histogram() {
    const centerObstacle = this.detections.find(d => d.zone === 'CENTER') || this.detections[0];
    if (!centerObstacle) return;

    const p80Disp = centerObstacle.p80_disparity || centerObstacle.disparity * 1.1;
    const meanDisp = centerObstacle.mean_disparity || centerObstacle.disparity * 0.65;

    const p80Dist = (this.alpha / (p80Disp + 1e-5)).toFixed(2);
    const meanDist = (this.alpha / (meanDisp + 1e-5)).toFixed(2);

    const p80El = document.getElementById('hist-p80-val');
    const meanEl = document.getElementById('hist-mean-val');
    const diffEl = document.getElementById('hist-diff-val');
    const p80DistEl = document.getElementById('hist-p80-dist');
    const meanDistEl = document.getElementById('hist-mean-dist');

    if (p80El) p80El.textContent = `${Math.round(p80Disp)} px`;
    if (meanEl) meanEl.textContent = `${Math.round(meanDisp)} px`;
    if (p80DistEl) p80DistEl.textContent = `${p80Dist} m`;
    if (meanDistEl) meanDistEl.textContent = `${meanDist} m`;
    if (diffEl) {
      const errM = (Math.abs(parseFloat(meanDist) - parseFloat(p80Dist))).toFixed(2);
      diffEl.textContent = `+${errM} m background bleed error avoided!`;
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="glass-panel rounded-2xl p-5 md:p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <!-- Top Telemetry Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs font-mono">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SYSTEM RUNNING
            </span>
            <span class="text-slate-400">PIPELINE: <strong class="text-white">3-TIER ASYNC</strong></span>
            <span class="text-slate-400 hidden sm:inline">RESOLUTION: <strong class="text-white">640×480</strong></span>
          </div>

          <div class="flex items-center gap-4 text-slate-300">
            <div>STREAM: <span id="tele-stream-fps" class="text-cyan-400 font-bold">60.0 FPS</span></div>
            <div>INFERENCE: <span id="tele-infer-hz" class="text-amber-400 font-bold">14.6 Hz</span></div>
            <div>LATENCY: <span id="tele-latency" class="text-emerald-400 font-bold">24 ms</span></div>
          </div>
        </div>

        <!-- Scene Selector & Multi-Condition Evaluator -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-4 p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="text-cyan-400 font-bold flex items-center gap-1.5">
              <i data-lucide="video" class="w-4 h-4"></i> EVALUATION SCENE:
            </span>
            <select id="scene-select" class="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/30 text-white font-mono text-xs focus:ring-1 focus:ring-cyan-400">
              <option value="classroom_lab">Indoor AI/ML Lab & Classroom</option>
              <option value="corridor_hallway">Corridor Hallway (Dynamic Pedestrian)</option>
              <option value="night_stairwell">Low-Light Night Stairwell (Ground Hazard)</option>
              <option value="crowded_quad">Academic Quad (Multi-Target)</option>
            </select>
          </div>
          <div class="flex items-center gap-3">
            <button id="btn-spatial-audio-test" class="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition font-bold text-xs flex items-center gap-1.5">
              <span>🔊</span> Test 3D Binaural Audio
            </button>
            <button id="btn-toggle-histogram" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition font-bold text-xs flex items-center gap-1.5">
              <span>📊</span> P80 Slicing Inspector
            </button>
          </div>
        </div>

        <!-- P80 Disparity Histogram Inspector Modal/Drawer -->
        <div id="p80-histogram-drawer" class="hidden mt-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono text-xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-white/10">
            <div class="flex items-center gap-2 text-emerald-400 font-bold">
              <span>🔬</span> MATHEMATICAL PROOF: 80th-PERCENTILE (P80) SLICING VS MEAN DISPARITY
            </div>
            <button id="btn-close-histogram" class="text-slate-400 hover:text-white text-xs">✕ Close</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
              <span class="text-slate-400 text-[10px] block">STANDARD MEAN DISPARITY (BLEED)</span>
              <div class="text-amber-400 font-bold text-sm" id="hist-mean-val">195 px</div>
              <div class="text-slate-300 text-xs">Distance: <span id="hist-mean-dist" class="font-bold text-white">2.31 m</span></div>
              <p class="text-[10px] text-slate-500">Distorted by far wall/floor pixels behind obstacle bounding box.</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 space-y-1">
              <span class="text-emerald-300 text-[10px] block">KRISHNA'S P80 DISPARITY SLICING</span>
              <div class="text-emerald-400 font-bold text-sm" id="hist-p80-val">420 px</div>
              <div class="text-slate-300 text-xs">Distance: <span id="hist-p80-dist" class="font-bold text-white">1.07 m</span></div>
              <p class="text-[10px] text-emerald-400/80">Locks strictly onto the closest forward-facing physical surface!</p>
            </div>
            <div class="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 space-y-1 flex flex-col justify-center">
              <span class="text-cyan-300 text-[10px] block">ACCURACY BENEFIT</span>
              <div id="hist-diff-val" class="text-cyan-400 font-bold text-xs">+1.24 m bleed error avoided!</div>
              <p class="text-[10px] text-slate-400">Eliminates false safety margins, preventing collisions with visually impaired users.</p>
            </div>
          </div>
        </div>

        <!-- Dual Streams Side-by-Side -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <!-- Stream 1: RGB Perception Stream -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                <strong>RGB PERCEPTION HUD</strong>
                <span class="text-slate-500">[YOLOv8-Nano]</span>
              </div>
              <span id="rgb-mode-badge" class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">STANDARD RGB</span>
            </div>
            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-white/10 group">
              <div class="laser-scanner"></div>
              <canvas id="rgb-stream-canvas" class="w-full h-full object-cover"></canvas>
              
              <!-- Zone demarcation lines -->
              <div class="absolute inset-0 pointer-events-none flex">
                <div class="w-1/3 border-r border-dashed border-white/15 p-2 text-[10px] font-mono text-slate-400">LEFT ZONE (Pan -0.85)</div>
                <div class="w-1/3 border-r border-dashed border-white/15 p-2 text-[10px] font-mono text-cyan-400/80 text-center">CENTER ZONE (Pan 0.0)</div>
                <div class="w-1/3 p-2 text-[10px] font-mono text-slate-400 text-right">RIGHT ZONE (Pan +0.85)</div>
              </div>

              <!-- Critical Flash Overlay -->
              <div id="collision-flash" class="absolute inset-0 bg-red-600/30 opacity-0 pointer-events-none transition-opacity duration-150"></div>
            </div>
          </div>

          <!-- Stream 2: MiDaS Dense Depth Map (COLORMAP_INFERNO) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-mono text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <strong>MiDaS DENSE DEPTH HEATMAP</strong>
                <span class="text-amber-400/80">[COLORMAP_INFERNO]</span>
              </div>
              <span class="text-[10px] text-slate-400">WARM = NEAR • COOL = FAR</span>
            </div>
            <div class="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-white/10">
              <div class="laser-scanner" style="animation-delay: 1.6s;"></div>
              <canvas id="depth-stream-canvas" class="w-full h-full object-cover"></canvas>
              
              <!-- Depth Heatmap Calibration Bar -->
              <div class="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                <span>0.3m (High Disparity)</span>
                <div class="w-1/2 h-2 rounded bg-gradient-to-r from-yellow-300 via-red-500 to-indigo-950"></div>
                <span>8.0m (Low Disparity)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time Tuning Controls & Spatial Distance Math -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
          <!-- Calibration Alpha Slider -->
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div class="flex justify-between font-mono">
              <span class="text-slate-300">Calibration Alpha (α)</span>
              <span id="alpha-val" class="text-cyan-400 font-bold">450.0</span>
            </div>
            <input type="range" id="alpha-slider" min="300" max="600" step="5" value="450" class="w-full accent-cyan-400">
            <p class="text-[11px] text-slate-400 font-mono">
              d = α / (disparity + ε)
            </p>
          </div>

          <!-- Feature Toggles -->
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col justify-between gap-2">
            <div class="font-mono text-slate-300 font-semibold">Tuning Controls</div>
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" id="toggle-night-vision" class="rounded bg-slate-800 border-white/20 text-cyan-500 focus:ring-0">
                <span>Night Vision (CLAHE)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" id="toggle-p80" checked class="rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-0">
                <span>P80 Slicing</span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" id="toggle-voice" checked class="rounded bg-slate-800 border-white/20 text-amber-500 focus:ring-0">
                <span>Speech Alerts</span>
              </label>
              <button id="trigger-breach-btn" class="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-[10px] font-mono transition">
                Simulate Near Breach
              </button>
            </div>
          </div>

          <!-- Active Threat Status -->
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
            <div class="font-mono text-slate-400 flex justify-between">
              <span>PRIMARY HAZARD</span>
              <span id="threat-badge" class="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">CRITICAL</span>
            </div>
            <div class="font-mono font-bold text-white text-sm" id="primary-hazard-text">
              PERSON @ 0.65m in CENTER ZONE
            </div>
            <div class="text-[11px] text-slate-400 font-mono">
              Action: <span id="hazard-action" class="text-amber-400">Stop & Step Left / Right</span>
            </div>
          </div>
        </div>

        <!-- Blackbox Incident Logger Drawer (Connected to SQLite API) -->
        <div class="mt-5 p-4 rounded-xl bg-slate-950/70 border border-white/10 font-mono text-xs">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-slate-300">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <strong>FORENSIC BLACKBOX INCIDENT LOG (TRIGGER: &lt; 0.8m)</strong>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-500">Persistent SQLite Ledger</span>
              <button id="btn-sync-incidents" class="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] hover:bg-slate-700">Sync SQLite</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div class="md:col-span-2 space-y-2">
              <div class="bg-slate-900/80 p-3 rounded-lg border border-white/5 text-[11px] text-emerald-400 space-y-1">
                <div><span class="text-slate-500">ACTIVE INCIDENT:</span> <span id="log-id">20260922_231746_061</span></div>
                <div><span class="text-slate-500">ALERT:</span> <span id="log-alert" class="text-red-400">CRITICAL BREACH: person at 0.65m in CENTER ZONE</span></div>
                <div><span class="text-slate-500">TELEMETRY:</span> [Conf: 0.92, EstDistance: 0.65m, Zone: CENTER, Alpha: 450.0]</div>
              </div>
              
              <!-- Recent SQLite Incidents List -->
              <div id="sqlite-incidents-list" class="space-y-1 max-h-24 overflow-y-auto">
                <!-- Dynamically loaded from /api/depth/incidents -->
              </div>
            </div>

            <!-- Blackbox Snapshot Preview -->
            <div class="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-lg border border-white/5">
              <img src="assets/images/blackbox_incident_real.jpg" alt="Real Blackbox Snapshot" class="w-20 h-16 object-cover rounded border border-red-500/40">
              <div class="text-[10px] text-slate-300 space-y-0.5">
                <div class="text-red-400 font-bold">SNAPSHOT CAPTURED</div>
                <div class="text-slate-400 font-mono">snapshot_20260922...</div>
                <div class="text-slate-500">Real validation frame</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.rgbCanvas = document.getElementById('rgb-stream-canvas');
    this.depthCanvas = document.getElementById('depth-stream-canvas');
    this.rgbCtx = this.rgbCanvas.getContext('2d');
    this.depthCtx = this.depthCanvas.getContext('2d');

    this.resizeCanvases();
  }

  resizeCanvases() {
    [this.rgbCanvas, this.depthCanvas].forEach(c => {
      c.width = 640;
      c.height = 480;
    });
  }

  bindEvents() {
    const slider = document.getElementById('alpha-slider');
    const alphaVal = document.getElementById('alpha-val');
    slider.addEventListener('input', (e) => {
      this.alpha = parseFloat(e.target.value);
      alphaVal.textContent = this.alpha.toFixed(1);
      this.updateP80Histogram();
    });

    document.getElementById('scene-select')?.addEventListener('change', (e) => {
      this.switchScene(e.target.value);
    });

    document.getElementById('btn-spatial-audio-test')?.addEventListener('click', () => {
      const centerObj = this.detections.find(d => d.zone === 'CENTER') || this.detections[0];
      const dist = this.calculateDistance(centerObj.disparity);
      this.playSpatialPing(centerObj.zone, dist);
    });

    document.getElementById('btn-toggle-histogram')?.addEventListener('click', () => {
      const drawer = document.getElementById('p80-histogram-drawer');
      if (drawer) {
        drawer.classList.toggle('hidden');
        this.updateP80Histogram();
      }
    });

    document.getElementById('btn-close-histogram')?.addEventListener('click', () => {
      document.getElementById('p80-histogram-drawer')?.classList.add('hidden');
    });

    document.getElementById('btn-sync-incidents')?.addEventListener('click', () => {
      this.loadIncidentsFromBackend();
    });

    document.getElementById('toggle-night-vision').addEventListener('change', (e) => {
      this.nightVision = e.target.checked;
      const badge = document.getElementById('rgb-mode-badge');
      if (this.nightVision) {
        badge.textContent = 'CLAHE NIGHT-VISION (LAB)';
        badge.className = 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30';
      } else {
        badge.textContent = 'STANDARD RGB';
        badge.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]';
      }
    });

    document.getElementById('toggle-p80').addEventListener('change', (e) => {
      this.p80Enabled = e.target.checked;
    });

    document.getElementById('toggle-voice').addEventListener('change', (e) => {
      this.voiceEnabled = e.target.checked;
    });

    document.getElementById('trigger-breach-btn').addEventListener('click', () => {
      this.triggerCollisionBreach();
    });
  }

  calculateDistance(disparity) {
    const epsilon = 1e-5;
    return this.alpha / (disparity + epsilon);
  }

  async triggerCollisionBreach() {
    const flash = document.getElementById('collision-flash');
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0'; }, 350);
    }

    const dist = (this.alpha / (420.0 + 1e-5)).toFixed(2);
    const payload = {
      obstacle_name: "person",
      disparity: 420.0,
      distance_m: parseFloat(dist),
      direction_zone: "CENTER",
      vertical_zone: "NORMAL",
      threat_level: "CRITICAL",
      alert_message: `CRITICAL BREACH: person at ${dist}m in CENTER ZONE`,
      snapshot_path: "assets/images/blackbox_incident_real.jpg"
    };

    // Real asynchronous persistence to backend SQLite API
    try {
      const res = await fetch('/api/depth/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('log-id').textContent = data.incident_id;
        document.getElementById('log-alert').textContent = payload.alert_message;
        this.loadIncidentsFromBackend();
      }
    } catch (e) {
      const now = new Date();
      const timestampStr = now.toISOString().replace(/[-:T.]/g, '').slice(0, 15);
      document.getElementById('log-id').textContent = `${timestampStr}_${Math.floor(Math.random() * 900 + 100)}`;
      document.getElementById('log-alert').textContent = payload.alert_message;
    }

    this.playSpatialPing("CENTER", parseFloat(dist));

    if (this.voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Critical breach! Person ahead at ${dist} meters.`);
      utterance.rate = 1.1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }

  drawRGBStream() {
    const ctx = this.rgbCtx;
    ctx.clearRect(0, 0, 640, 480);

    // Simulated indoor room scene
    ctx.fillStyle = this.nightVision ? '#0d221c' : '#111827';
    ctx.fillRect(0, 0, 640, 480);

    // Floor and perspective ceiling
    ctx.fillStyle = this.nightVision ? '#132e26' : '#1f2937';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.lineTo(180, 200);
    ctx.lineTo(460, 200);
    ctx.lineTo(640, 480);
    ctx.closePath();
    ctx.fill();

    // Night vision CLAHE noise & tint simulation
    if (this.nightVision) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(0, 0, 640, 480);
    }

    // Draw detected obstacles with bounding boxes
    this.detections.forEach((d) => {
      // Calculate dynamic metric distance based on Alpha
      const dist = this.calculateDistance(d.disparity);
      const isCritical = dist < 1.0;
      const isWarning = dist >= 1.0 && dist <= 2.2;
      const boxColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#06b6d4';

      // Slight natural breathing motion for person
      let renderY = d.y;
      if (d.class === 'person') {
        renderY += Math.sin(this.frameCount * 0.05) * 4;
      }

      // Draw obstacle silhouette representation
      ctx.fillStyle = isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(6, 182, 212, 0.1)';
      ctx.fillRect(d.x, renderY, d.w, d.h);

      // Sonar Radar Ping Rings for Warning & Critical Obstacles
      if (isCritical || isWarning) {
        const pingPeriod = isCritical ? 30 : 50;
        const pingProgress = (this.frameCount % pingPeriod) / pingPeriod;
        const maxPingRadius = Math.max(d.w, d.h) * 0.75;
        const currentPingRadius = pingProgress * maxPingRadius;
        const pingAlpha = (1 - pingProgress) * (isCritical ? 0.65 : 0.4);

        ctx.strokeStyle = isCritical ? `rgba(239, 68, 68, ${pingAlpha})` : `rgba(245, 158, 11, ${pingAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(d.x + d.w / 2, renderY + d.h / 2, currentPingRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Bounding box border
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(d.x, renderY, d.w, d.h);

      // Corner target brackets
      const bracketLen = 14;
      ctx.lineWidth = 3;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(d.x, renderY + bracketLen);
      ctx.lineTo(d.x, renderY);
      ctx.lineTo(d.x + bracketLen, renderY);
      ctx.stroke();

      // P80 Disparity line inside bounding box
      if (this.p80Enabled) {
        const p80Y = renderY + d.h * 0.8;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(d.x, p80Y);
        ctx.lineTo(d.x + d.w, p80Y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Bounding box badge
      ctx.fillStyle = boxColor;
      ctx.fillRect(d.x, renderY - 22, d.w, 22);

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#000000';
      ctx.fillText(`${d.class.toUpperCase()} ${Math.round(d.conf * 100)}% | ${dist.toFixed(2)}m`, d.x + 6, renderY - 6);

      if (d.zone === 'CENTER') {
        // Update Primary hazard HUD text
        const badge = document.getElementById('threat-badge');
        const hazText = document.getElementById('primary-hazard-text');
        if (badge && hazText) {
          badge.textContent = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'SAFE';
          badge.className = isCritical 
            ? 'px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30'
            : isWarning 
            ? 'px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
          hazText.textContent = `${d.class.toUpperCase()} @ ${dist.toFixed(2)}m in ${d.zone} ZONE`;
        }
      }
    });

    // Crosshair in center
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(320, 225);
    ctx.lineTo(320, 255);
    ctx.moveTo(305, 240);
    ctx.lineTo(335, 240);
    ctx.stroke();
  }

  drawDepthStream() {
    const ctx = this.depthCtx;
    ctx.clearRect(0, 0, 640, 480);

    // Deep Inferno colormap gradient background (dark purple to deep indigo)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 480);
    bgGrad.addColorStop(0, '#0a0314');
    bgGrad.addColorStop(0.5, '#1b0c36');
    bgGrad.addColorStop(1, '#4f1253');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    // Draw objects in Inferno colormap (bright yellow/orange for close, dark violet for far)
    this.detections.forEach((d) => {
      const dist = this.calculateDistance(d.disparity);
      let renderY = d.y;
      if (d.class === 'person') {
        renderY += Math.sin(this.frameCount * 0.05) * 4;
      }

      // Inferno intensity: close (dist < 1m) = fiery yellow-orange, far = magenta-purple
      const objGrad = ctx.createRadialGradient(
        d.x + d.w / 2, renderY + d.h / 2, 10,
        d.x + d.w / 2, renderY + d.h / 2, d.w
      );

      if (dist < 1.0) {
        // High proximity = bright yellow to hot orange
        objGrad.addColorStop(0, '#fef08a');
        objGrad.addColorStop(0.4, '#f97316');
        objGrad.addColorStop(1, '#9333ea');
      } else if (dist <= 2.2) {
        objGrad.addColorStop(0, '#f97316');
        objGrad.addColorStop(0.5, '#c026d3');
        objGrad.addColorStop(1, '#3b0764');
      } else {
        objGrad.addColorStop(0, '#a855f7');
        objGrad.addColorStop(0.7, '#4c1d95');
        objGrad.addColorStop(1, '#1e1b4b');
      }

      ctx.fillStyle = objGrad;
      ctx.beginPath();
      ctx.roundRect(d.x, renderY, d.w, d.h, 12);
      ctx.fill();

      // Disparity contour rings
      ctx.strokeStyle = dist < 1.0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Disparity value text overlay
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`disp:${Math.round(d.disparity)}`, d.x + 8, renderY + 16);
    });
  }

  startPerceptionLoop() {
    const loop = () => {
      this.frameCount++;
      this.drawRGBStream();
      this.drawDepthStream();

      // Update simulated FPS & Hz slight variance
      if (this.frameCount % 20 === 0) {
        const streamFpsEl = document.getElementById('tele-stream-fps');
        const inferHzEl = document.getElementById('tele-infer-hz');
        if (streamFpsEl) {
          streamFpsEl.textContent = (59.6 + Math.random() * 0.8).toFixed(1) + ' FPS';
        }
        if (inferHzEl) {
          inferHzEl.textContent = (14.2 + Math.random() * 1.2).toFixed(1) + ' Hz';
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
