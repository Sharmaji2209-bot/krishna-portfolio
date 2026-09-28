/**
 * Procedural 3D Room Simulator Canvas
 * Interactive wireframe room visualizer simulating monocular camera perspective,
 * spatial obstacle positions (ground hazard, head-level hazard, chair, person),
 * and depth raycasting without physical hardware.
 */

export class RoomSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'w-full h-full rounded-xl';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Simulation state
    this.cameraX = 0; // -1 to 1
    this.cameraHeight = 1.6; // meters
    this.activeObstacle = 'person'; // 'person', 'chair', 'head_hazard', 'ground_hazard'
    this.obstacleDist = 1.35; // meters
    this.rayAngle = 0;
    this.animId = null;

    // Obstacles definitions
    this.obstacles = [
      { id: 'person', label: 'Human Obstacle', zone: 'CENTER', baseDist: 1.2, height: 1.7, width: 0.5, color: '#06b6d4', type: 'NORMAL' },
      { id: 'chair', label: 'Office Chair', zone: 'LEFT', baseDist: 2.1, height: 0.9, width: 0.55, color: '#f59e0b', type: 'NORMAL' },
      { id: 'head_hazard', label: 'Open Cabinet Door', zone: 'RIGHT', baseDist: 1.4, height: 2.0, yOffset: 1.5, width: 0.6, color: '#ef4444', type: 'HEAD-LEVEL HAZARD' },
      { id: 'ground_hazard', label: 'Low Step / Curb', zone: 'CENTER', baseDist: 0.75, height: 0.25, width: 0.8, color: '#f97316', type: 'GROUND HAZARD' }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 580;
    this.height = this.canvas.height = rect.height || 360;
  }

  setCameraPosition(xOffset) {
    this.cameraX = xOffset; // -1 to 1
  }

  selectObstacle(id) {
    this.activeObstacle = id;
    const found = this.obstacles.find(o => o.id === id);
    if (found) {
      this.obstacleDist = found.baseDist;
    }
  }

  setDistance(dist) {
    this.obstacleDist = parseFloat(dist);
  }

  project(x, y, z) {
    // 3D to 2D projection
    // Eye at (0, 0, -2)
    const focal = 280;
    const camZ = z + 1.2;
    const camX = x - this.cameraX * 0.8;
    const camY = y - (this.cameraHeight - 1.6);

    const scale = focal / (camZ + 1e-4);
    const screenX = this.width / 2 + camX * scale;
    const screenY = this.height / 2 - camY * scale;

    return { x: screenX, y: screenY, scale };
  }

  drawRoom() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Deep grid background
    this.ctx.fillStyle = '#090d16';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Vanishing perspective room wireframe lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.lineWidth = 1;

    const roomW = 3.5;
    const roomH = 2.8;
    const roomDepth = 8.0;

    // Floor grid
    for (let z = 1; z <= roomDepth; z += 1.0) {
      const pLeft = this.project(-roomW, -1.0, z);
      const pRight = this.project(roomW, -1.0, z);
      this.ctx.beginPath();
      this.ctx.moveTo(pLeft.x, pLeft.y);
      this.ctx.lineTo(pRight.x, pRight.y);
      this.ctx.strokeStyle = z <= 2.2 ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.07)';
      this.ctx.stroke();
    }

    // Longitudinal floor lines
    for (let x = -roomW; x <= roomW; x += 0.875) {
      const pNear = this.project(x, -1.0, 0.5);
      const pFar = this.project(x, -1.0, roomDepth);
      this.ctx.beginPath();
      this.ctx.moveTo(pNear.x, pNear.y);
      this.ctx.lineTo(pFar.x, pFar.y);
      this.ctx.strokeStyle = Math.abs(x) < 0.1 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.06)';
      this.ctx.stroke();
    }

    // Walls & Ceiling boundaries
    const corners = [
      [-roomW, -1.0], [roomW, -1.0], [roomW, roomH], [-roomW, roomH]
    ];

    corners.forEach(([cx, cy]) => {
      const p1 = this.project(cx, cy, 0.5);
      const p2 = this.project(cx, cy, roomDepth);
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.stroke();
    });

    // Distance zone demarcation overlays on floor
    // Near Field: 0.3m to 2.2m (cyan tint), Far Field: 2.2m to 8.0m (blue tint)
    const nearFarLineL = this.project(-roomW, -1.0, 2.2);
    const nearFarLineR = this.project(roomW, -1.0, 2.2);
    this.ctx.beginPath();
    this.ctx.moveTo(nearFarLineL.x, nearFarLineL.y);
    this.ctx.lineTo(nearFarLineR.x, nearFarLineR.y);
    this.ctx.strokeStyle = '#06b6d4';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Zone text
    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.fillStyle = '#06b6d4';
    this.ctx.fillText('CRITICAL / WARNING ZONE (d ≤ 2.2m)', nearFarLineL.x + 10, nearFarLineL.y - 6);

    // Draw active obstacles
    this.obstacles.forEach((obs) => {
      const isActive = obs.id === this.activeObstacle;
      let obsX = 0;
      if (obs.zone === 'LEFT') obsX = -1.2;
      if (obs.zone === 'RIGHT') obsX = 1.2;
      if (obs.zone === 'CENTER') obsX = 0.0;

      const z = isActive ? this.obstacleDist : obs.baseDist + 1.5;
      const alpha = isActive ? 0.95 : 0.25;

      this.drawObstacle3D(obs, obsX, z, alpha, isActive);
    });

    // Draw Virtual Camera Ray Frustum
    this.drawCameraRays();

    // Draw HUD text & telemetry overlay
    this.drawTelemetryOverlay();
  }

  drawObstacle3D(obs, x, z, alpha, isPrimary) {
    const w = obs.width;
    const h = obs.height;
    const baseY = obs.yOffset ? obs.yOffset - 1.0 : -1.0;
    const topY = baseY + h;

    // 8 bounding vertices of box
    const v = [
      this.project(x - w / 2, baseY, z - 0.2), // 0: front-bottom-left
      this.project(x + w / 2, baseY, z - 0.2), // 1: front-bottom-right
      this.project(x + w / 2, topY, z - 0.2),  // 2: front-top-right
      this.project(x - w / 2, topY, z - 0.2),  // 3: front-top-left
      this.project(x - w / 2, baseY, z + 0.2), // 4: back-bottom-left
      this.project(x + w / 2, baseY, z + 0.2), // 5: back-bottom-right
      this.project(x + w / 2, topY, z + 0.2),  // 6: back-top-right
      this.project(x - w / 2, topY, z + 0.2),  // 7: back-top-left
    ];

    // Shading faces
    this.ctx.fillStyle = isPrimary ? `${obs.color}22` : 'rgba(255,255,255,0.03)';
    this.ctx.beginPath();
    this.ctx.moveTo(v[0].x, v[0].y);
    this.ctx.lineTo(v[1].x, v[1].y);
    this.ctx.lineTo(v[2].x, v[2].y);
    this.ctx.lineTo(v[3].x, v[3].y);
    this.ctx.closePath();
    this.ctx.fill();

    // Wireframe edges
    this.ctx.strokeStyle = isPrimary ? obs.color : 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = isPrimary ? 2 : 1;

    const edges = [
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7]
    ];

    edges.forEach(([i, j]) => {
      this.ctx.beginPath();
      this.ctx.moveTo(v[i].x, v[i].y);
      this.ctx.lineTo(v[j].x, v[j].y);
      this.ctx.stroke();
    });

    if (isPrimary) {
      // 80th percentile disparity marker line
      const p80Y = v[0].y - (v[0].y - v[3].y) * 0.8;
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(v[0].x, p80Y);
      this.ctx.lineTo(v[1].x, p80Y);
      this.ctx.stroke();

      // Bounding box label
      this.ctx.font = 'bold 11px "JetBrains Mono", monospace';
      this.ctx.fillStyle = obs.color;
      this.ctx.fillText(`${obs.label.toUpperCase()} [${z.toFixed(2)}m]`, v[3].x, v[3].y - 8);

      if (obs.type !== 'NORMAL') {
        this.ctx.font = '9px "JetBrains Mono", monospace';
        this.ctx.fillStyle = '#f87171';
        this.ctx.fillText(`! ${obs.type}`, v[3].x, v[3].y - 20);
      }
    }
  }

  drawCameraRays() {
    const origin = { x: this.width / 2 + this.cameraX * 30, y: this.height - 20 };
    const leftRay = this.project(-2.2, -0.2, 5.0);
    const rightRay = this.project(2.2, -0.2, 5.0);
    const centerRay = this.project(0.0, -0.2, 5.0);

    this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
    this.ctx.lineWidth = 1;

    [leftRay, centerRay, rightRay].forEach((ray) => {
      this.ctx.beginPath();
      this.ctx.moveTo(origin.x, origin.y);
      this.ctx.lineTo(ray.x, ray.y);
      this.ctx.stroke();
    });
  }

  drawTelemetryOverlay() {
    // Current simulated state
    const current = this.obstacles.find(o => o.id === this.activeObstacle);
    const isCritical = this.obstacleDist < 1.0;
    const isWarning = this.obstacleDist >= 1.0 && this.obstacleDist <= 2.2;

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(14, 14, 260, 85, 8);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.fillText('SIMULATION TELEMETRY (NO HARDWARE)', 24, 32);

    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
    this.ctx.fillStyle = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
    this.ctx.fillText(`TARGET: ${current.label} (${current.zone})`, 24, 52);

    this.ctx.font = '11px "JetBrains Mono", monospace';
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText(`ESTIMATED DISTANCE: ${this.obstacleDist.toFixed(2)} m`, 24, 70);

    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.fillStyle = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8';
    this.ctx.fillText(`STATUS: ${isCritical ? 'COLLISION ALERT' : isWarning ? 'PROXIMITY WARNING' : 'CLEAR PATH'}`, 24, 86);
  }

  animate() {
    this.drawRoom();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
