/**
 * Advanced Neural Network & Synaptic Particle Field Canvas
 * 
 * Features:
 * - Multi-layer parallax depth (background micro-stars, midground nodes, foreground active clusters)
 * - Synaptic data pulses (photons traveling along connections with glowing trails)
 * - Interactive mouse repulsion & click shockwave ripple
 * - Breathing node glow and halo rings
 * - Automatic 60 FPS optimization with tab visibility throttling & reduced-motion support
 */

class NeuralBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.backgroundStars = [];
    this.pulses = []; // Traveling synaptic photons
    this.ripples = []; // Shockwave rings on click/movement
    this.mouse = { x: null, y: null, radius: 160, isHovered: false };
    this.animationId = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lastTime = performance.now();
    this.pulseSpawnTimer = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.isHovered = false;
    });

    // Click shockwave ripple
    window.addEventListener('click', (e) => {
      if (this.reducedMotion) return;
      this.addRipple(e.clientX, e.clientY);
    });

    // Page visibility throttling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.lastTime = performance.now();
        this.start();
      }
    });

    this.createNodes();
    this.createBackgroundStars();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    // Density tuned for high performance
    this.nodeCount = Math.min(Math.floor((this.width * this.height) / 18000), 65);
    this.starCount = Math.min(Math.floor((this.width * this.height) / 12000), 90);

    if (this.nodes.length !== this.nodeCount) {
      this.createNodes();
    }
    this.createBackgroundStars();
  }

  createBackgroundStars() {
    this.backgroundStars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.backgroundStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.0 + 0.3,
        alpha: Math.random() * 0.35 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      const isCyan = Math.random() > 0.45;
      this.nodes.push({
        id: i,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.3,
        hue: isCyan ? 'rgba(6, 182, 212,' : 'rgba(139, 92, 246,',
        haloHue: isCyan ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)',
        pulseOffset: Math.random() * Math.PI * 2,
        connectedTo: []
      });
    }
  }

  addRipple(x, y) {
    this.ripples.push({
      x,
      y,
      radius: 10,
      maxRadius: Math.min(this.width, this.height) * 0.35,
      alpha: 0.6,
      speed: 6.5
    });

    // Slightly energize nearby nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const dx = n.x - x;
      const dy = n.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220 && dist > 1) {
        n.vx += (dx / dist) * 1.2;
        n.vy += (dy / dist) * 1.2;
      }
    }
  }

  spawnSynapticPulse(nodeA, nodeB) {
    if (this.pulses.length > 25) return; // Cap to keep lightweight
    this.pulses.push({
      startX: nodeA.x,
      startY: nodeA.y,
      endX: nodeB.x,
      endY: nodeB.y,
      progress: 0,
      speed: Math.random() * 0.02 + 0.015,
      color: Math.random() > 0.4 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(167, 139, 250, 0.9)',
      size: Math.random() * 1.8 + 1.5
    });
  }

  start() {
    if (this.reducedMotion) {
      this.renderStatic();
      return;
    }
    if (!this.animationId) {
      this.lastTime = performance.now();
      this.animate();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
    if (enabled) {
      this.stop();
      this.renderStatic();
    } else {
      this.start();
    }
  }

  renderStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      this.ctx.beginPath();
      this.ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(6, 182, 212, 0.3)`;
      this.ctx.fill();
    }
  }

  animate() {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Background Parallax Stars
    for (let i = 0; i < this.backgroundStars.length; i++) {
      const star = this.backgroundStars[i];
      star.phase += star.twinkleSpeed;
      const alpha = star.alpha + Math.sin(star.phase) * 0.15;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(148, 163, 184, ${Math.max(0.05, alpha)})`;
      this.ctx.fill();
    }

    // 2. Render and Update Shockwave Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha -= 0.012;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(6, 182, 212, ${r.alpha * 0.5})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, Math.max(0, r.radius - 8), 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(139, 92, 246, ${r.alpha * 0.3})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // 3. Update & Connect Nodes
    const activeConnections = [];

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      // Physics update with friction
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.995;
      node.vy *= 0.995;

      // Keep minimum gentle drift
      if (Math.abs(node.vx) < 0.1) node.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(node.vy) < 0.1) node.vy += (Math.random() - 0.5) * 0.1;

      // Bounce against edges with soft margins
      if (node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
      if (node.x > this.width) { node.x = this.width; node.vx = -Math.abs(node.vx); }
      if (node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
      if (node.y > this.height) { node.y = this.height; node.vy = -Math.abs(node.vy); }

      // Smooth mouse interaction (subtle gravity & magnetic push)
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 1) {
          const force = (1 - dist / this.mouse.radius) * 0.55;
          node.vx -= (dx / dist) * force;
          node.vy -= (dy / dist) * force;

          // Connect cursor to close nodes
          const cursorAlpha = (1 - dist / this.mouse.radius) * 0.35;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${cursorAlpha})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
        }
      }

      // Breathing glow calculation
      const breath = Math.sin(now * 0.002 + node.pulseOffset) * 0.3 + 1.0;
      const currentRadius = node.radius * breath;

      // Draw faint halo around node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, currentRadius * 2.8, 0, Math.PI * 2);
      this.ctx.fillStyle = node.haloHue;
      this.ctx.fill();

      // Draw core node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${node.hue} ${node.baseAlpha})`;
      this.ctx.fill();

      // Find connections to adjacent nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dx = node.x - nodeB.x;
        const dy = node.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 145) {
          const alpha = (1 - dist / 145) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(nodeB.x, nodeB.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();

          activeConnections.push([node, nodeB]);
        }
      }
    }

    // 4. Randomly spawn Synaptic Pulses on active connections
    this.pulseSpawnTimer += dt;
    if (this.pulseSpawnTimer > 0.18 && activeConnections.length > 0) {
      this.pulseSpawnTimer = 0;
      const pair = activeConnections[Math.floor(Math.random() * activeConnections.length)];
      if (Math.random() > 0.5) {
        this.spawnSynapticPulse(pair[0], pair[1]);
      } else {
        this.spawnSynapticPulse(pair[1], pair[0]);
      }
    }

    // 5. Update & Render Traveling Synaptic Photons
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        this.pulses.splice(i, 1);
        continue;
      }

      // Linear interpolation along line
      const currX = p.startX + (p.endX - p.startX) * p.progress;
      const currY = p.startY + (p.endY - p.startY) * p.progress;

      // Draw glowing photon with fading tail
      const tailX = p.startX + (p.endX - p.startX) * Math.max(0, p.progress - 0.08);
      const tailY = p.startY + (p.endY - p.startY) * Math.max(0, p.progress - 0.08);

      const grad = this.ctx.createLinearGradient(tailX, tailY, currX, currY);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(1, p.color);

      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(currX, currY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2.2;
      this.ctx.stroke();

      // Front spark
      this.ctx.beginPath();
      this.ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#06b6d4';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // Reset
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

export default NeuralBackground;
