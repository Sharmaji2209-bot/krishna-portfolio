/**
 * Krishna Sharma - Main Application Logic
 * Integrates dynamic data binding, interactive canvas simulations,
 * project deep-dive modals, interactive skills filtering, and responsive navigation.
 */

import {
  PERSONAL_INFO,
  ABOUT_INFO,
  EDUCATION_DATA,
  SKILLS_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  CERTIFICATIONS_DATA,
  WORKSHOPS_DATA,
  ACHIEVEMENTS_DATA,
  NSS_DATA
} from './data.js';

import NeuralBackground from './neural-bg.js';
import { DepthDashboardSimulator } from './depth-dashboard.js';
import { RoomSimulator } from './room-sim.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Canvas
  const neuralBg = new NeuralBackground('hero-canvas');

  // Render Core Sections
  renderEducation();
  renderSkills();
  renderExperience();
  renderProjects();
  renderCertifications();
  renderWorkshops();
  renderAchievements();
  renderNss();
  renderDeveloperProfiles();

  // Initialize Interactive Simulators
  initSimulators();

  // Bind Navigation & UI Interactions
  bindNavigation();
  bindDistanceCalculator();
  bindAttendanceConsole();
  bindAssistiveConsole();
  bindSecurityConsole();
  bindContactForm();
  bindResumeActions();
  bindPhoneReveal();
  bindAccessibilityControls(neuralBg);

  // Initialize Advanced Animations & Interactivity
  initScrollReveal();
  initCardTiltAndSpotlight();
  initAnimatedCounters();
  initRoleRotator();
  initMagneticButtons();

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   Section Renderers
   ========================================================================== */

function renderEducation() {
  const container = document.getElementById('education-timeline');
  if (!container) return;

  container.innerHTML = EDUCATION_DATA.map((edu, idx) => `
    <div class="relative pl-8 pb-10 border-l border-cyan-500/30 last:border-transparent last:pb-0">
      <!-- Timeline Node -->
      <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>

      <div class="glass-card rounded-xl p-5 border border-white/10 hover:border-cyan-500/30 transition-all">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            ${edu.badge}
          </span>
          <span class="text-xs font-mono text-slate-400">${edu.timeline}</span>
        </div>

        <h3 class="text-lg font-bold text-white">${edu.institution}</h3>
        <p class="text-cyan-400 font-medium text-sm mb-1">${edu.degree} — <span class="text-slate-300">${edu.branch}</span></p>
        <p class="text-xs text-slate-400 mb-3">${edu.status}</p>

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-mono mb-3">
          <span class="text-slate-400">${edu.metricLabel}:</span>
          <span class="text-emerald-400 font-bold text-sm">${edu.metricValue}</span>
        </div>

        <ul class="space-y-1.5 text-xs text-slate-300">
          ${edu.details.map(d => `<li class="flex items-start gap-2"><span class="text-cyan-400">▹</span> ${d}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function renderSkills(activeCategory = 'all') {
  const tabsContainer = document.getElementById('skill-tabs');
  const gridContainer = document.getElementById('skills-grid');
  if (!tabsContainer || !gridContainer) return;

  // Render Category Tabs
  tabsContainer.innerHTML = SKILLS_DATA.categories.map(cat => `
    <button class="skill-tab-btn px-4 py-2 rounded-xl text-xs font-mono transition-all ${cat.id === activeCategory ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan' : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'}" data-category="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  // Filter Items
  const items = activeCategory === 'all' 
    ? SKILLS_DATA.items 
    : SKILLS_DATA.items.filter(item => item.category === activeCategory);

  // Render Skill Cards (Categorized, NO fake percentages!)
  gridContainer.innerHTML = items.map(skill => `
    <div class="glass-card rounded-xl p-4 border border-white/5 flex items-center gap-3.5 group hover:border-cyan-500/30 transition-all">
      <div class="w-10 h-10 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform">
        <i data-lucide="${skill.icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">${skill.name}</h4>
          ${skill.highlight ? '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]"></span>' : ''}
        </div>
        <p class="text-[11px] text-slate-400 font-mono truncate mt-0.5">${skill.level}</p>
      </div>
    </div>
  `).join('');

  // Re-bind click events
  document.querySelectorAll('.skill-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderSkills(btn.dataset.category);
      initCardTiltAndSpotlight();
      if (window.lucide) window.lucide.createIcons();
    });
  });
  initCardTiltAndSpotlight();
}

function renderExperience() {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  container.innerHTML = EXPERIENCE_DATA.map((exp, idx) => `
    <div class="relative pl-8 pb-12 border-l border-cyan-500/30 last:border-transparent last:pb-0">
      <!-- Node -->
      <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>

      <div class="glass-card rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ${exp.timeframe}
            </span>
            <span class="text-xs text-slate-400 font-mono">${exp.location}</span>
          </div>
          <span class="text-xs font-mono text-slate-400">${exp.duration}</span>
        </div>

        <h3 class="text-xl font-bold text-white mb-1">${exp.role}</h3>
        <h4 class="text-base text-cyan-400 font-medium mb-3">${exp.organization}</h4>
        
        <p class="text-xs text-slate-300 leading-relaxed mb-4">${exp.description}</p>

        <!-- Project Callout -->
        <div class="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 mb-4">
          <span class="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Associated Project / Domain</span>
          <div class="text-sm font-semibold text-white mt-0.5">${exp.projectTitle}</div>
        </div>

        <!-- Highlights & Tags -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${exp.highlights.map(h => `
            <span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 text-slate-300 border border-white/5">
              ${h}
            </span>
          `).join('')}
        </div>

        <!-- Key Contributions -->
        <div class="space-y-1.5 border-t border-white/5 pt-3">
          ${exp.achievements.map(a => `
            <div class="flex items-start gap-2 text-xs text-slate-300">
              <span class="text-cyan-400">▹</span>
              <span>${a}</span>
            </div>
          `).join('')}
        </div>

        <!-- Interactive Operational Launch Triggers -->
        ${exp.id === 'exp-1' ? `
          <button class="btn-launch-attendance-console mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <i data-lucide="scan-face" class="w-4 h-4"></i> Launch Smart Attendance Operational Console
          </button>
        ` : exp.id === 'exp-2' ? `
          <button class="btn-launch-security-console mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600/30 to-rose-600/30 text-red-300 border border-red-500/40 hover:bg-red-600 hover:text-white transition font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <i data-lucide="shield-alert" class="w-4 h-4"></i> Launch IIT Jodhpur Defensive Heuristics Console
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Bind security console buttons inside experience section
  document.querySelectorAll('.btn-launch-security-console').forEach(btn => {
    btn.addEventListener('click', () => {
      openSecurityConsole();
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = PROJECTS_DATA.map((proj) => {
    if (proj.featured) {
      // Large Signature Project Card with Rotating Cyber Glow Border
      return `
        <div class="glass-panel-glow cyber-rotating-border rounded-3xl p-6 lg:p-8 border border-cyan-500/30 relative overflow-hidden mb-12">
          <!-- Ambient gradient glow -->
          <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ${proj.badge}
            </span>
            <span class="text-xs font-mono text-slate-400">Role: <strong class="text-white">${proj.role}</strong></span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Info -->
            <div class="lg:col-span-7 space-y-4">
              <h3 class="text-2xl lg:text-3xl font-bold text-white tracking-tight">${proj.title}</h3>
              <p class="text-sm text-slate-300 leading-relaxed">${proj.shortDescription}</p>

              <!-- Core Concept Callout -->
              <div class="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div class="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">Core Engineering Concept</div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Operates with <strong>Zero External Sensors</strong> (no physical LiDAR, sonar, or stereo cameras). Instead, it couples an ultra-fast <strong>YOLOv8-Nano</strong> object detector with an <strong>Intel ISL MiDaS-Small</strong> inverse depth estimator on a single 2D monocular RGB webcam feed.
                </p>
              </div>

              <!-- Tech Badges -->
              <div class="flex flex-wrap gap-2 pt-1">
                ${proj.technologies.map(t => `
                  <span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 text-cyan-300 border border-cyan-500/20">
                    ${t}
                  </span>
                `).join('')}
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-3 pt-3">
                <button class="view-project-details-btn px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2" data-project-id="${proj.id}">
                  <i data-lucide="maximize-2" class="w-4 h-4"></i> View Full Technical Architecture
                </button>
                <a href="#depth-simulator-anchor" class="px-5 py-2.5 rounded-xl bg-slate-900/80 text-white font-medium text-xs border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-2">
                  <i data-lucide="play" class="w-4 h-4 text-cyan-400"></i> Interactive Dashboard Simulator
                </a>
              </div>
            </div>

            <!-- Right Showcase Visual -->
            <div class="lg:col-span-5 space-y-3">
              <div class="relative rounded-2xl overflow-hidden border border-white/15 group shadow-2xl">
                <img src="${proj.image}" alt="${proj.title}" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div class="absolute bottom-3 left-3 right-3 text-xs font-mono text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex justify-between">
                  <span>YOLOv8-Nano + MiDaS-Small</span>
                  <span class="text-cyan-400">DUAL MJPEG STREAMS</span>
                </div>
              </div>

              <!-- 3-Tier Async Architecture Badge Strip -->
              <div class="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
                <div class="p-2 rounded-lg bg-slate-900/60 border border-white/10">
                  <div class="text-cyan-400 font-bold">Tier 1</div>
                  <div class="text-slate-400 text-[10px]">Cam Grabber</div>
                </div>
                <div class="p-2 rounded-lg bg-slate-900/60 border border-white/10">
                  <div class="text-amber-400 font-bold">Tier 2</div>
                  <div class="text-slate-400 text-[10px]">Perception ~14Hz</div>
                </div>
                <div class="p-2 rounded-lg bg-slate-900/60 border border-white/10">
                  <div class="text-emerald-400 font-bold">Tier 3</div>
                  <div class="text-slate-400 text-[10px]">Streamer 60 FPS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Deep-dive Interactive Anchors Grid -->
          <div class="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
              <span class="text-[10px] font-mono text-slate-400 uppercase">Distance Math</span>
              <div class="text-xs font-bold text-white font-mono mt-0.5">d = α / (disp + ε)</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
              <span class="text-[10px] font-mono text-slate-400 uppercase">Slicing Method</span>
              <div class="text-xs font-bold text-emerald-400 font-mono mt-0.5">P80 Disparity</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
              <span class="text-[10px] font-mono text-slate-400 uppercase">Audio Engine</span>
              <div class="text-xs font-bold text-amber-400 font-mono mt-0.5">Non-Blocking SAPI5</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-center">
              <span class="text-[10px] font-mono text-slate-400 uppercase">Safety Blackbox</span>
              <div class="text-xs font-bold text-red-400 font-mono mt-0.5">&lt;0.8m Incident Log</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Standard Project Card
      return `
        <div class="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
          <div>
            <div class="relative w-full aspect-video overflow-hidden">
              <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70"></div>
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-white/10">
                ${proj.badge}
              </span>
            </div>

            <div class="p-6 space-y-3">
              <div class="text-xs font-mono text-slate-400">Role: <strong class="text-cyan-400">${proj.role}</strong></div>
              <h4 class="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">${proj.title}</h4>
              <p class="text-xs text-slate-300 leading-relaxed">${proj.shortDescription}</p>

              <!-- Special Feature Note -->
              ${proj.specialFeatureNote ? `
                <div class="p-3 rounded-lg bg-slate-900/80 border border-amber-500/20 text-[11px] text-slate-300 font-mono">
                  <span class="text-amber-400 font-bold">Concept Integration:</span> ${proj.specialFeatureNote}
                </div>
              ` : ''}

              <!-- Technologies -->
              <div class="flex flex-wrap gap-1.5 pt-2">
                ${proj.technologies.slice(0, 5).map(t => `
                  <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-300 border border-white/5">
                    ${t}
                  </span>
                `).join('')}
                ${proj.technologies.length > 5 ? `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-400">+${proj.technologies.length - 5} more</span>` : ''}
              </div>
            </div>
          </div>

          <div class="p-6 pt-0 space-y-2">
            ${proj.id === 'smart-attendance-system' ? `
              <button class="btn-launch-attendance-console w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                <i data-lucide="scan-face" class="w-4 h-4"></i> Launch Operational Console
              </button>
            ` : proj.id === 'autonomous-assistance-disabled' ? `
              <button class="btn-launch-assistive-console w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                <i data-lucide="bot" class="w-4 h-4"></i> Launch Robotics Console
              </button>
            ` : ''}
            <button class="view-project-details-btn w-full py-2 rounded-xl bg-slate-900 text-white font-medium text-xs border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center justify-center gap-2" data-project-id="${proj.id}">
              <i data-lucide="info" class="w-4 h-4"></i> View Details & Architecture
            </button>
          </div>
        </div>
      `;
    }
  }).join('');

  // Bind project details modal triggers
  document.querySelectorAll('.view-project-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openProjectModal(btn.dataset.projectId);
    });
  });

  // Bind operational console modal triggers
  document.querySelectorAll('.btn-launch-attendance-console').forEach(btn => {
    btn.addEventListener('click', () => {
      openAttendanceConsole();
    });
  });

  document.querySelectorAll('.btn-launch-assistive-console').forEach(btn => {
    btn.addEventListener('click', () => {
      openAssistiveConsole();
    });
  });
}

function renderCertifications() {
  const formalContainer = document.getElementById('formal-certifications');
  const programsContainer = document.getElementById('programs-participation');

  if (formalContainer) {
    formalContainer.innerHTML = CERTIFICATIONS_DATA.formal.map(c => `
      <div class="glass-card rounded-xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">${c.tag}</span>
          <span>${c.year}</span>
        </div>
        <h4 class="text-base font-bold text-white mb-1">${c.title}</h4>
        <p class="text-xs font-mono text-cyan-400 mb-2">Issuer: ${c.issuer}</p>
        <p class="text-xs text-slate-300 leading-relaxed">${c.desc}</p>
      </div>
    `).join('');
  }

  if (programsContainer) {
    programsContainer.innerHTML = CERTIFICATIONS_DATA.programsAndParticipation.map(p => `
      <div class="glass-card rounded-xl p-5 border border-white/5 hover:border-amber-500/30 transition-all">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">${p.tag}</span>
          <span>${p.year}</span>
        </div>
        <h4 class="text-base font-bold text-white mb-1">${p.title}</h4>
        <p class="text-xs font-mono text-amber-400 mb-2">Institution: ${p.institution}</p>
        <p class="text-xs text-slate-300 leading-relaxed">${p.desc}</p>
      </div>
    `).join('');
  }
}

function renderWorkshops() {
  const container = document.getElementById('workshops-container');
  if (!container) return;

  container.innerHTML = WORKSHOPS_DATA.map(w => `
    <div class="glass-card rounded-xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all">
      <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">${w.tag}</span>
        <span>${w.location}</span>
      </div>
      <h4 class="text-base font-bold text-white mb-1">${w.title}</h4>
      ${w.issuer ? `<p class="text-xs font-mono text-slate-400 mb-2">Organized with: <strong class="text-white">${w.issuer}</strong></p>` : ''}
      <p class="text-xs text-slate-300 leading-relaxed">${w.desc}</p>
    </div>
  `).join('');
}

function renderAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container) return;

  container.innerHTML = ACHIEVEMENTS_DATA.map(a => `
    <div class="glass-card rounded-2xl p-5 border border-white/10 hover:border-amber-500/40 transition-all space-y-2">
      <div class="text-sm font-bold text-amber-400 font-mono">${a.badge}</div>
      <h4 class="text-base font-bold text-white">${a.title}</h4>
      <div class="text-xs font-mono text-slate-400">${a.level} ${a.organization ? `• ${a.organization}` : ''}</div>
      <p class="text-xs text-slate-300 leading-relaxed pt-1">${a.desc}</p>
    </div>
  `).join('');
}

function renderNss() {
  const container = document.getElementById('nss-container');
  if (!container) return;

  container.innerHTML = NSS_DATA.activities.map(item => `
    <div class="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
      <div class="flex items-center justify-between text-xs font-mono">
        <span class="text-cyan-400 font-semibold">${item.role}</span>
        <span class="text-slate-500">Service Activity</span>
      </div>
      <h4 class="text-sm font-bold text-white">${item.title}</h4>
      <p class="text-xs text-slate-300 leading-relaxed">${item.desc}</p>
    </div>
  `).join('');
}

function renderDeveloperProfiles() {
  const container = document.getElementById('developer-profiles-container');
  if (!container) return;

  const profiles = [
    { name: "GitHub", url: PERSONAL_INFO.socialLinks.github, icon: "github", desc: "Open-source repositories, experiments, & vision scripts", badge: "Primary" },
    { name: "LinkedIn", url: PERSONAL_INFO.socialLinks.linkedin, icon: "linkedin", desc: "Professional network, academic milestones, & updates", badge: "Professional" },
    { name: "LeetCode", url: PERSONAL_INFO.socialLinks.leetcode, icon: "code", desc: "Data structures, algorithmic problem solving in C++ & Python", badge: "Problem Solving" },
    { name: "GeeksforGeeks", url: PERSONAL_INFO.socialLinks.gfg, icon: "terminal", desc: "Computer Science core topics, DSA, & practice tracks", badge: "Core CS" },
    { name: "Kaggle", url: PERSONAL_INFO.socialLinks.kaggle, icon: "bar-chart", desc: "Machine Learning datasets, exploratory notebooks, & pipelines", badge: "Data & ML" }
  ];

  container.innerHTML = profiles.map(p => `
    <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="glass-card rounded-xl p-4 border border-white/5 hover:border-cyan-500/30 flex items-center justify-between group transition-all">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-slate-900/90 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <i data-lucide="${p.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">${p.name}</h4>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400">${p.badge}</span>
          </div>
          <p class="text-xs text-slate-400">${p.desc}</p>
        </div>
      </div>
      <i data-lucide="external-link" class="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors"></i>
    </a>
  `).join('');
}

/* ==========================================================================
   Simulators Initialization
   ========================================================================== */

function initSimulators() {
  // Depth Dashboard Simulator
  new DepthDashboardSimulator('depth-dashboard-container');

  // Procedural 3D Room Simulator
  const roomSim = new RoomSimulator('room-sim-container');

  // Room Simulator interactive controls
  const camSlider = document.getElementById('room-cam-slider');
  if (camSlider) {
    camSlider.addEventListener('input', (e) => {
      roomSim.setCameraPosition(parseFloat(e.target.value));
    });
  }

  const distSlider = document.getElementById('room-dist-slider');
  if (distSlider) {
    distSlider.addEventListener('input', (e) => {
      roomSim.setDistance(parseFloat(e.target.value));
    });
  }

  const obstacleSelect = document.getElementById('room-obstacle-select');
  if (obstacleSelect) {
    obstacleSelect.addEventListener('change', (e) => {
      roomSim.selectObstacle(e.target.value);
    });
  }
}

/* ==========================================================================
   Interactive Metric Distance Calibration Calculator
   ========================================================================== */

function bindDistanceCalculator() {
  const dispSlider = document.getElementById('calc-disparity-slider');
  const alphaInput = document.getElementById('calc-alpha-input');
  const resDistance = document.getElementById('calc-res-distance');
  const resZone = document.getElementById('calc-res-zone');

  if (!dispSlider || !alphaInput || !resDistance) return;

  const update = async () => {
    const disp = parseFloat(dispSlider.value);
    const alpha = parseFloat(alphaInput.value) || 450.0;
    const eps = 1e-5;
    const dist = alpha / (disp + eps);

    resDistance.textContent = dist.toFixed(2) + ' m';

    if (dist < 0.8) {
      resZone.textContent = 'CRITICAL BREACH (<0.8m) — EMERGENCY STOP ACTIVATED';
      resZone.className = 'text-red-400 font-bold font-mono text-xs';
    } else if (dist <= 2.2) {
      resZone.textContent = 'WARNING ZONE (Near Field: 0.8m – 2.2m)';
      resZone.className = 'text-amber-400 font-bold font-mono text-xs';
    } else {
      resZone.textContent = 'CLEAR PATH (Far Field: 2.2m – 8.0m)';
      resZone.className = 'text-emerald-400 font-bold font-mono text-xs';
    }

    const dispVal = document.getElementById('calc-disp-val');
    if (dispVal) dispVal.textContent = disp.toFixed(0);

    // Verified calculation from live backend API
    try {
      const res = await fetch('/api/depth/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disparity: disp, alpha: alpha, epsilon: eps, zone: 'CENTER' })
      });
      const data = await res.json();
      if (data.success && dispVal) {
        dispVal.textContent = `${disp.toFixed(0)} [API Synced: ${data.results.calculation_latency_ms}ms]`;
      }
    } catch (_) {}
  };

  dispSlider.addEventListener('input', update);
  alphaInput.addEventListener('input', update);
  update();
}

/* ==========================================================================
   Project Deep-Dive Modal
   ========================================================================== */

function openProjectModal(projectId) {
  const proj = PROJECTS_DATA.find(p => p.id === projectId);
  if (!proj) return;

  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('project-modal-content');
  if (!modalBackdrop || !modalContent) return;

  let extraHtml = '';

  if (proj.id === 'depth-navigation-assistant') {
    extraHtml = `
      <div class="mt-6 space-y-6">
        <!-- 3-Tier Architecture Flow -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <h4 class="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">3-Tier Asynchronous Architecture</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div class="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30">
              <div class="text-cyan-400 font-bold">Tier 1: Camera Grabber</div>
              <div class="text-slate-400 text-[11px] mt-1">Non-blocking webcam thread with atomic memory buffer (zero frame drops).</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30">
              <div class="text-amber-400 font-bold">Tier 2: Perception Worker</div>
              <div class="text-slate-400 text-[11px] mt-1">YOLOv8n + MiDaS inference at ~12–16 Hz without blocking the video stream.</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30">
              <div class="text-emerald-400 font-bold">Tier 3: Video Streamer</div>
              <div class="text-slate-400 text-[11px] mt-1">Flask 60 FPS MJPEG broadcast + pyttsx3 non-blocking audio dispatch.</div>
            </div>
          </div>
          <p class="text-xs text-slate-400">
            <strong>Key Engineering Achievement:</strong> Upgraded from ~2.6 FPS synchronous execution to 60 FPS continuous video streaming paired with 12–16 Hz deep-learning inference.
          </p>
        </div>

        <!-- P80 Disparity Flow -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <h4 class="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">80th-Percentile (P80) Disparity Bounding-Box Slicing</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${proj.p80Explanation}
          </p>
          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 text-xs font-mono text-slate-300">
            <span>Camera Frame</span>
            <span class="text-cyan-400">→</span>
            <span>Object Bounding Box</span>
            <span class="text-cyan-400">→</span>
            <span>Depth Map</span>
            <span class="text-cyan-400">→</span>
            <span class="text-emerald-400 font-bold">P80 Disparity Slice</span>
            <span class="text-cyan-400">→</span>
            <span>Accurate Obstacle Surface Distance</span>
          </div>
        </div>

        <!-- Real Blackbox Telemetry Sample -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
          <h4 class="text-sm font-bold text-red-400 font-mono uppercase tracking-wider">Forensic Blackbox Logger Telemetry</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <pre class="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-white/5"><code>{
  "incident_id": "${proj.liveTelemetrySample.incident_id}",
  "timestamp": "${proj.liveTelemetrySample.timestamp}",
  "obstacle": "${proj.liveTelemetrySample.obstacle_name}",
  "confidence": ${proj.liveTelemetrySample.confidence},
  "estimated_distance_m": ${proj.liveTelemetrySample.estimated_distance_m},
  "zone": "${proj.liveTelemetrySample.direction_zone}",
  "threat_level": "${proj.liveTelemetrySample.threat_level}"
}</code></pre>
            <div>
              <img src="${proj.liveTelemetrySample.snapshotFile}" alt="Real Blackbox Snapshot" class="rounded-xl border border-red-500/40 w-full h-auto">
              <p class="text-[11px] text-slate-400 font-mono mt-1 text-center">Actual frame snapshot captured during breach test</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (proj.id === 'autonomous-assistance-disabled') {
    extraHtml = `
      <div class="mt-6 p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
        <h4 class="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider">End-to-End Robotics & Perception Pipeline</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          ${proj.architecturePipeline.map(step => `
            <div class="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
              <span class="text-[10px] text-cyan-400 font-bold">STEP ${step.step}</span>
              <div class="font-bold text-white">${step.name}</div>
              <p class="text-[11px] text-slate-400">${step.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  modalContent.innerHTML = `
    <div class="flex items-center justify-between pb-4 border-b border-white/10">
      <div>
        <span class="text-xs font-mono text-cyan-400">${proj.badge}</span>
        <h3 class="text-xl lg:text-2xl font-bold text-white mt-0.5">${proj.title}</h3>
      </div>
      <button id="close-project-modal" class="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="mt-5 space-y-5">
      <img src="${proj.image}" alt="${proj.title}" class="w-full max-h-72 object-cover rounded-xl border border-white/10">

      <div>
        <h4 class="text-xs font-mono uppercase text-slate-400 mb-1">Project Role</h4>
        <div class="text-sm font-semibold text-white">${proj.role}</div>
      </div>

      <div>
        <h4 class="text-xs font-mono uppercase text-slate-400 mb-2">Technical Responsibilities & Architecture Contributions</h4>
        <ul class="space-y-1.5 text-xs text-slate-300">
          ${proj.responsibilities.map(r => `<li class="flex items-start gap-2"><span class="text-cyan-400">▹</span> ${r}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-mono uppercase text-slate-400 mb-2">Technology Stack</h4>
        <div class="flex flex-wrap gap-2">
          ${proj.technologies.map(t => `<span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 text-cyan-300 border border-cyan-500/20">${t}</span>`).join('')}
        </div>
      </div>

      ${extraHtml}
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('close-project-modal')?.addEventListener('click', () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  });

  if (window.lucide) window.lucide.createIcons();
}

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */

function bindNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileDrawer.classList.add('hidden');
      } else {
        mobileDrawer.classList.remove('hidden');
      }
    });

    // Close mobile menu on click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    });
  }

  // Scrollspy for active nav link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Phone Number Privacy & Reveal
   ========================================================================== */

function bindPhoneReveal() {
  const revealBtn = document.getElementById('reveal-phone-btn');
  const phoneText = document.getElementById('contact-phone-text');

  if (revealBtn && phoneText) {
    revealBtn.addEventListener('click', () => {
      phoneText.textContent = `+91 ${PERSONAL_INFO.phone}`;
      revealBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> Revealed`;
      revealBtn.classList.remove('bg-cyan-500/10', 'text-cyan-400');
      revealBtn.classList.add('bg-emerald-500/10', 'text-emerald-400');

      navigator.clipboard?.writeText(PERSONAL_INFO.phone);
      showToast('Phone number revealed & copied to clipboard!');
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

/* ==========================================================================
   Resume Actions & Printable Modal
   ========================================================================== */

function bindResumeActions() {
  const resumeBtns = document.querySelectorAll('.download-resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-modal');

  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) {
        resumeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Print resume button
  document.getElementById('print-resume-btn')?.addEventListener('click', () => {
    window.print();
  });
}

/* ==========================================================================
   Contact Form Validation
   ========================================================================== */

function bindContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (data.success) {
        form.reset();
        showToast(`Inquiry [${data.ticket_id}] saved to backend SQLite! Krishna will review it shortly.`, 'success');
        return;
      }
    } catch (_) {}

    // Fallback if offline
    form.reset();
    showToast(`Thank you, ${name}! Your inquiry has been received.`, 'success');
  });
}

/* ==========================================================================
   Smart Attendance Operational Console Controller
   ========================================================================== */

let attWebcamStream = null;

export function openAttendanceConsole() {
  const modal = document.getElementById('attendance-operational-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchAttendanceStats();
  fetchAttendanceRecords();
}

async function fetchAttendanceStats() {
  try {
    const res = await fetch('/api/attendance/stats');
    const data = await res.json();
    if (data.success) {
      const totalEl = document.getElementById('att-stat-total');
      const presEl = document.getElementById('att-stat-present');
      const lateEl = document.getElementById('att-stat-late');
      if (totalEl) totalEl.textContent = `${data.total_marked} Marked`;
      if (presEl) presEl.textContent = `${data.present_count} Students`;
      if (lateEl) lateEl.textContent = `${data.late_count} Students`;
    }
  } catch (err) {
    console.warn('Could not fetch attendance stats', err);
  }
}

async function fetchAttendanceRecords() {
  const tbody = document.getElementById('att-table-body');
  if (!tbody) return;

  try {
    const res = await fetch('/api/attendance/records');
    const data = await res.json();
    if (data.success && data.records && data.records.length > 0) {
      tbody.innerHTML = data.records.map(r => `
        <tr class="hover:bg-slate-900/60 transition-colors">
          <td class="p-3 font-semibold text-white">${r.student_name}</td>
          <td class="p-3 text-slate-300">
            <span class="block">${r.student_id}</span>
            <span class="text-[10px] text-slate-500">${r.department || 'B.Tech CSE (AI/ML)'}</span>
          </td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              r.status === 'PRESENT'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }">${r.status}</span>
          </td>
          <td class="p-3 font-bold text-cyan-400">${r.confidence_score}%</td>
          <td class="p-3 text-[11px] text-slate-400">${r.timestamp}</td>
        </tr>
      `).join('');
      return;
    }
  } catch (err) {
    console.warn('Could not fetch attendance records', err);
  }

  tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">No records found. Click verify to add student.</td></tr>`;
}

async function verifyAndMarkAttendance(name, id, node) {
  const feedback = document.getElementById('att-verify-feedback');
  const fbStatus = document.getElementById('att-feedback-status');
  const fbConf = document.getElementById('att-feedback-conf');
  const fbDetails = document.getElementById('att-feedback-details');

  try {
    const res = await fetch('/api/attendance/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: name,
        student_id: id,
        camera_node: node || 'NODE_ENTRANCE_CAM_01',
        department: 'B.Tech CSE (AI/ML)'
      })
    });
    const data = await res.json();
    if (data.success) {
      if (feedback) {
        feedback.classList.remove('hidden');
        if (fbStatus) fbStatus.textContent = `VERIFIED ${data.status}`;
        if (fbConf) fbConf.textContent = `${data.confidence_score}% Match`;
        if (fbDetails) fbDetails.textContent = `Cosine vector similarity: ${(data.confidence_score/100).toFixed(3)}. Persisted to SQLite attendance_records table.`;
      }
      showToast(`Face Verified: ${data.student_name} (${data.confidence_score}%) — Marked ${data.status}`, 'success');
      fetchAttendanceStats();
      fetchAttendanceRecords();
    }
  } catch (err) {
    showToast('Failed to connect to /api/attendance/verify', 'error');
  }
}

function stopAttWebcam() {
  if (attWebcamStream) {
    attWebcamStream.getTracks().forEach(t => t.stop());
    attWebcamStream = null;
  }
}

function startFaceReticleTracking() {
  const canvas = document.getElementById('att-face-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 480;

  const trackLoop = () => {
    if (!attWebcamStream) {
      ctx.clearRect(0, 0, 640, 480);
      return;
    }
    ctx.clearRect(0, 0, 640, 480);
    const t = Date.now() * 0.003;
    const cx = 320 + Math.sin(t) * 15;
    const cy = 240 + Math.cos(t * 0.8) * 10;
    const bw = 160;
    const bh = 200;

    // MTCNN Alignment Box
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - bw/2, cy - bh/2, bw, bh);

    // Landmarks simulation
    ctx.fillStyle = '#10b981';
    ctx.beginPath(); ctx.arc(cx - 35, cy - 25, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 35, cy - 25, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy + 10, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 20, cy + 50, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 20, cy + 50, 3, 0, Math.PI * 2); ctx.fill();

    requestAnimationFrame(trackLoop);
  };
  trackLoop();
}

function bindAttendanceConsole() {
  document.getElementById('close-attendance-modal')?.addEventListener('click', () => {
    document.getElementById('attendance-operational-modal')?.classList.remove('open');
    document.body.style.overflow = '';
    stopAttWebcam();
  });

  // Tab switching
  const tabScanner = document.getElementById('tab-att-scanner');
  const tabEnroll = document.getElementById('tab-att-enroll');
  const panelScanner = document.getElementById('panel-att-scanner');
  const panelEnroll = document.getElementById('panel-att-enroll');

  tabScanner?.addEventListener('click', () => {
    tabScanner.className = 'px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold transition flex items-center gap-2';
    tabEnroll.className = 'px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-white/10 transition flex items-center gap-2';
    panelScanner?.classList.remove('hidden');
    panelEnroll?.classList.add('hidden');
  });

  tabEnroll?.addEventListener('click', () => {
    tabEnroll.className = 'px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold transition flex items-center gap-2';
    tabScanner.className = 'px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-white/10 transition flex items-center gap-2';
    panelEnroll?.classList.remove('hidden');
    panelScanner?.classList.add('hidden');
  });

  // Toggle Webcam
  const toggleCamBtn = document.getElementById('btn-toggle-att-webcam');
  toggleCamBtn?.addEventListener('click', async () => {
    const video = document.getElementById('att-webcam-video');
    const img = document.getElementById('att-viewfinder-img');
    if (attWebcamStream) {
      stopAttWebcam();
      img?.classList.remove('hidden');
      video?.classList.add('hidden');
      toggleCamBtn.innerHTML = `<i data-lucide="camera" class="w-3 h-3"></i> Toggle Webcam`;
      showToast('Switched to simulated camera node view.', 'info');
    } else {
      try {
        attWebcamStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (video) {
          video.srcObject = attWebcamStream;
          video.classList.remove('hidden');
          img?.classList.add('hidden');
          toggleCamBtn.innerHTML = `<i data-lucide="camera-off" class="w-3 h-3"></i> Stop Webcam`;
          showToast('Live webcam initialized! Ready for biometric face capture.', 'success');
          startFaceReticleTracking();
        }
      } catch (err) {
        showToast('Webcam access not allowed or unavailable. Using simulated optical sensor.', 'info');
      }
    }
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('btn-refresh-attendance')?.addEventListener('click', () => {
    fetchAttendanceStats();
    fetchAttendanceRecords();
    showToast('Attendance registry refreshed from SQLite database.', 'info');
  });

  document.getElementById('btn-quick-verify-krishna')?.addEventListener('click', () => {
    verifyAndMarkAttendance('Krishna Sharma', 'STU-2023-AI01', 'NODE_ENTRANCE_CAM_01');
  });

  document.querySelectorAll('.btn-quick-verify-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      verifyAndMarkAttendance(btn.dataset.name, btn.dataset.id, 'NODE_ENTRANCE_CAM_01');
    });
  });

  document.getElementById('btn-submit-attendance')?.addEventListener('click', () => {
    const name = document.getElementById('att-input-name')?.value.trim() || 'Krishna Sharma';
    const id = document.getElementById('att-input-id')?.value.trim() || 'STU-2023-AI01';
    const node = document.getElementById('att-select-node')?.value || 'NODE_ENTRANCE_CAM_01';
    verifyAndMarkAttendance(name, id, node);
  });

  // Submit enrollment
  document.getElementById('btn-submit-enrollment')?.addEventListener('click', async () => {
    const name = document.getElementById('enroll-name')?.value.trim();
    const id = document.getElementById('enroll-id')?.value.trim();
    const dept = document.getElementById('enroll-dept')?.value.trim() || 'B.Tech CSE (AI/ML)';
    if (!name || !id) {
      showToast('Please enter full student name and ID.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/attendance/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name: name, student_id: id, department: dept })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Enrolled: ${name} (${id}) committed to SQLite enrolled_faces!`, 'success');
        document.getElementById('enroll-name').value = '';
        document.getElementById('enroll-id').value = '';
        tabScanner?.click();
        verifyAndMarkAttendance(name, id, 'NODE_ENTRANCE_CAM_01');
      }
    } catch (e) {
      showToast('Failed to connect to /api/attendance/enroll', 'error');
    }
  });
}

/* ==========================================================================
   Autonomous Assistive Robotics Console Controller
   ========================================================================== */

let slamRobot = { x: 12.5, y: 8.2, theta: 4.95, v: 0.8, omega: 0.0 };
let slamMapData = null;
let slamAnimationId = null;

export function openAssistiveConsole() {
  const modal = document.getElementById('assistive-operational-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchAssistiveTelemetry();
  fetchSLAMMap();
}

async function fetchSLAMMap() {
  try {
    const res = await fetch('/api/assistive/map');
    const data = await res.json();
    if (data.success) {
      slamMapData = data;
      slamRobot.x = data.robot_pose.x_m;
      slamRobot.y = data.robot_pose.y_m;
      slamRobot.theta = data.robot_pose.heading_rad;
      startSLAMRenderer();
    }
  } catch (e) {
    console.warn('Could not fetch SLAM map', e);
  }
}

function startSLAMRenderer() {
  const canvas = document.getElementById('ast-slam-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (slamAnimationId) cancelAnimationFrame(slamAnimationId);

  const renderSLAM = () => {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / 30.0;
    const scaleY = canvas.height / 20.0;

    // Draw Grid Lines (2m intervals)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= 30; gx += 2) {
      ctx.beginPath(); ctx.moveTo(gx * scaleX, 0); ctx.lineTo(gx * scaleX, canvas.height); ctx.stroke();
    }
    for (let gy = 0; gy <= 20; gy += 2) {
      ctx.beginPath(); ctx.moveTo(0, gy * scaleY); ctx.lineTo(canvas.width, gy * scaleY); ctx.stroke();
    }

    if (slamMapData) {
      // Draw Walls
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      slamMapData.walls.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(w.x1 * scaleX, w.y1 * scaleY);
        ctx.lineTo(w.x2 * scaleX, w.y2 * scaleY);
        ctx.stroke();
      });

      // Draw Obstacles
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      slamMapData.obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.arc(obs.x * scaleX, obs.y * scaleY, obs.radius * scaleX, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Draw Waypoints
      slamMapData.waypoints.forEach(wp => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(wp.x * scaleX, wp.y * scaleY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(wp.name, wp.x * scaleX + 6, wp.y * scaleY + 3);
      });
    }

    // Kinematics Update
    slamRobot.theta += slamRobot.omega * 0.05;
    slamRobot.x += Math.cos(slamRobot.theta) * (slamRobot.v * 0.02);
    slamRobot.y += Math.sin(slamRobot.theta) * (slamRobot.v * 0.02);

    // Keep within bounds
    slamRobot.x = Math.max(1.5, Math.min(28.5, slamRobot.x));
    slamRobot.y = Math.max(1.5, Math.min(18.5, slamRobot.y));

    // Update coordinate HUD
    const coordX = document.getElementById('slam-coord-x');
    const coordY = document.getElementById('slam-coord-y');
    if (coordX) coordX.textContent = slamRobot.x.toFixed(1);
    if (coordY) coordY.textContent = slamRobot.y.toFixed(1);

    const rx = slamRobot.x * scaleX;
    const ry = slamRobot.y * scaleY;

    // Draw 16 LiDAR Raycasts
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const rayAngle = slamRobot.theta + (i / 16) * Math.PI * 2;
      const rayDist = 3.5 + Math.sin(Date.now() * 0.005 + i) * 0.8;
      const rayX = rx + Math.cos(rayAngle) * rayDist * scaleX;
      const rayY = ry + Math.sin(rayAngle) * rayDist * scaleY;

      ctx.strokeStyle = i === 0 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(239, 68, 68, 0.35)';
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rayX, rayY);
      ctx.stroke();

      // Laser bounce particle
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(rayX, rayY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Robot Body
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(slamRobot.theta);

    // Chassis
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 16, 4);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -10, 6, 3);
    ctx.fillRect(2, -10, 6, 3);
    ctx.fillRect(-8, 7, 6, 3);
    ctx.fillRect(2, 7, 6, 3);

    // Front sensor dome
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(8, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Heading arrow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();

    ctx.restore();

    slamAnimationId = requestAnimationFrame(renderSLAM);
  };

  renderSLAM();
}

async function fetchAssistiveTelemetry() {
  try {
    const res = await fetch('/api/assistive/telemetry');
    const data = await res.json();
    if (data.success) {
      document.getElementById('ast-stat-battery').textContent = `${data.battery_soc}%`;
      document.getElementById('ast-stat-speed').textContent = `${data.speed_mps} m/s`;
      document.getElementById('ast-stat-heading').textContent = `${data.heading_deg}° NW`;
      document.getElementById('ast-stat-clearance').textContent = `${data.clearance.front_m} m`;
    }
  } catch (err) {
    console.warn('Could not fetch telemetry', err);
  }
}

async function sendAssistiveCommand(cmd, voice) {
  const terminal = document.getElementById('ast-terminal-log');
  const respStatus = document.getElementById('ast-response-status');
  const respText = document.getElementById('ast-response-text');
  const brakeState = document.getElementById('ast-stat-brake');

  // Update real kinematics state
  if (cmd === 'FORWARD') {
    slamRobot.v = 0.8;
    slamRobot.omega = 0.0;
  } else if (cmd === 'REVERSE') {
    slamRobot.v = -0.4;
    slamRobot.omega = 0.0;
  } else if (cmd === 'TURN_LEFT') {
    slamRobot.omega = -0.6;
    slamRobot.v = 0.3;
    setTimeout(() => { slamRobot.omega = 0; }, 800);
  } else if (cmd === 'TURN_RIGHT') {
    slamRobot.omega = 0.6;
    slamRobot.v = 0.3;
    setTimeout(() => { slamRobot.omega = 0; }, 800);
  } else if (cmd === 'EMERGENCY_STOP') {
    slamRobot.v = 0.0;
    slamRobot.omega = 0.0;
  }

  if (cmd === 'EMERGENCY_STOP' && brakeState) {
    brakeState.textContent = 'EMERGENCY BRAKE ENGAGED';
    brakeState.className = 'text-sm font-bold text-red-400 mt-1';
  } else if (brakeState) {
    brakeState.textContent = 'NORMAL DISENGAGED';
    brakeState.className = 'text-sm font-bold text-emerald-400 mt-1';
  }

  try {
    const res = await fetch('/api/assistive/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd, voice_input: voice || '' })
    });
    const data = await res.json();
    if (data.success) {
      if (respStatus) respStatus.textContent = `${data.command} EXECUTED`;
      if (respText) respText.textContent = `"${data.audio_synthesis_text}"`;
      if (terminal) {
        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.textContent = `[${timeStr}] CMD: ${data.command} | Linear: ${data.kinematics.linear_speed_mps}m/s | Obstacle: ${data.sensors.obstacle_clearance_m}m | Battery: ${data.sensors.battery_soc}%`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.audio_synthesis_text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }

      showToast(`Robotics Command Dispatched: ${data.command}`, 'info');
      fetchAssistiveTelemetry();
    }
  } catch (err) {
    showToast('Failed to connect to /api/assistive/command', 'error');
  }
}

function bindAssistiveConsole() {
  document.getElementById('close-assistive-modal')?.addEventListener('click', () => {
    document.getElementById('assistive-operational-modal')?.classList.remove('open');
    document.body.style.overflow = '';
    if (slamAnimationId) cancelAnimationFrame(slamAnimationId);
  });

  document.querySelectorAll('.ast-cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendAssistiveCommand(btn.dataset.cmd);
    });
  });

  document.querySelectorAll('.ast-voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendAssistiveCommand(btn.dataset.cmd, btn.dataset.voice);
    });
  });

  // Web Speech API
  const micBtn = document.getElementById('btn-ast-mic');
  micBtn?.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Web Speech API not supported in this browser. Use preset voice buttons.', 'info');
      sendAssistiveCommand('NAVIGATE_DOORWAY', 'Guide through the main entrance doorway');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.innerHTML = `<span>🔴</span> Listening...`;
    micBtn.classList.add('animate-pulse');

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      showToast(`Recognized Voice: "${transcript}"`, 'info');
      micBtn.innerHTML = `<span>🎙️</span> Speak Voice Command`;
      micBtn.classList.remove('animate-pulse');

      let cmd = 'NAVIGATE_DOORWAY';
      const lower = transcript.toLowerCase();
      if (lower.includes('stop') || lower.includes('halt')) cmd = 'EMERGENCY_STOP';
      else if (lower.includes('left')) cmd = 'TURN_LEFT';
      else if (lower.includes('right')) cmd = 'TURN_RIGHT';
      else if (lower.includes('forward') || lower.includes('go')) cmd = 'FORWARD';
      else if (lower.includes('status') || lower.includes('battery')) cmd = 'REPORT_STATUS';
      else if (lower.includes('lab') || lower.includes('304')) cmd = 'NAVIGATE_LAB304';

      sendAssistiveCommand(cmd, transcript);
    };

    recognition.onerror = () => {
      micBtn.innerHTML = `<span>🎙️</span> Speak Voice Command`;
      micBtn.classList.remove('animate-pulse');
      showToast('Voice capture ended or cancelled.', 'info');
    };

    recognition.start();
  });

  // Fall Distress SOS
  const fallBtn = document.getElementById('btn-ast-fall-sos');
  fallBtn?.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/assistive/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imu_impact_g: 4.25,
          location: "IES IPS Academy Campus, Ground Floor Corridor",
          coordinates: { lat: 22.7196, lon: 75.8577 }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`EMERGENCY SOS: Fall anomaly detected [${data.dispatch_id}]! Emergency contacts notified.`, 'error');
        const term = document.getElementById('ast-terminal-log');
        if (term) {
          const line = document.createElement('div');
          line.className = 'text-red-400 font-bold';
          line.textContent = `[SOS ALERT ${data.dispatch_id}] 4.25g Fall Anomaly at (22.7196°N, 75.8577°E). MQTT Broadcast dispatched!`;
          term.appendChild(line);
          term.scrollTop = term.scrollHeight;
        }

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Emergency alert! Fall anomaly detected. Distress beacon dispatched.");
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (e) {
      showToast('Emergency SOS dispatched via simulated MQTT broker!', 'error');
    }
  });
}

/* ==========================================================================
   IIT Jodhpur Cybersecurity Defensive Scanner Console Controller
   ========================================================================== */

export function openSecurityConsole() {
  const modal = document.getElementById('security-operational-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function bindSecurityConsole() {
  document.getElementById('close-security-modal')?.addEventListener('click', () => {
    document.getElementById('security-operational-modal')?.classList.remove('open');
    document.body.style.overflow = '';
  });

  const textarea = document.getElementById('sec-input-content');

  // Benchmark Sample Presets
  const samplePayloads = {
    clean: "MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00This program cannot be run in DOS mode. NTDLL.DLL RtlInitUnicodeString NtQueryInformationProcess GetModuleHandleW ExitProcess legitimate system code section with natural ASCII frequency distribution",
    packed: "MZ\x90\x00\x03\x00UPX0\x00\x00\x00VirtualAlloc\x00CreateRemoteThread\x00WriteProcessMemory\x00\x89\x4f\x21\x9a\xf3\xcd\x04\x5b\x6e\x88\x12\x3c\xee\xbc\xaa\x43\x76\x98\x11\x54\x32\x67\x89\xaa\xbb\xcc\xdd\xee\xff\x10\x20\x30\x40\x50\x60\x70\x80\x90\xa0\xb0\xc0\xd0\xe0\xf0\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f",
    dropper: "MZ\x90\x00\x03WS2_32.dll\x00WSAStartup\x00connect\x00send\x00recv\x00closesocket\x00CreateProcessA\x00cmd.exe /c powershell -nop -w hidden -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA=="
  };

  document.querySelectorAll('.sec-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      if (textarea && samplePayloads[type]) {
        textarea.value = samplePayloads[type];
        showToast(`Loaded forensic benchmark sample: ${type.toUpperCase()}`, 'info');
      }
    });
  });

  document.getElementById('btn-run-security-scan')?.addEventListener('click', async () => {
    const content = textarea?.value.trim() || samplePayloads.packed;
    try {
      const res = await fetch('/api/security/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        const entropyVal = document.getElementById('sec-entropy-val');
        const entropyBar = document.getElementById('sec-entropy-bar');
        const packingVal = document.getElementById('sec-packing-val');
        const hooksVal = document.getElementById('sec-hooks-val');
        const threatBadge = document.getElementById('sec-threat-badge');
        const verdictText = document.getElementById('sec-verdict-text');

        if (entropyVal) entropyVal.textContent = `${data.shannon_entropy} / 8.00`;
        if (entropyBar) {
          const pct = Math.min(100, (data.shannon_entropy / 8.0) * 100);
          entropyBar.style.width = `${pct}%`;
          entropyBar.className = data.shannon_entropy > 7.0 
            ? 'h-full bg-red-500 transition-all duration-500' 
            : data.shannon_entropy > 6.0 
            ? 'h-full bg-amber-500 transition-all duration-500' 
            : 'h-full bg-emerald-400 transition-all duration-500';
        }

        if (packingVal) {
          packingVal.textContent = data.packing_heuristic ? 'DETECTED (High H > 7.0)' : 'UNPACKED (H <= 7.0)';
          packingVal.className = data.packing_heuristic ? 'text-sm font-bold text-red-400' : 'text-sm font-bold text-emerald-400';
        }

        if (hooksVal) {
          hooksVal.textContent = data.suspicious_apis_detected.length > 0 
            ? data.suspicious_apis_detected.join(', ') 
            : 'No known hook APIs detected';
          hooksVal.className = data.suspicious_apis_detected.length > 0 ? 'text-sm font-bold text-red-400' : 'text-sm font-bold text-slate-300';
        }

        if (threatBadge) {
          threatBadge.textContent = data.threat_classification;
          threatBadge.className = data.threat_classification === 'MALICIOUS_THREAT'
            ? 'px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40'
            : data.threat_classification === 'SUSPICIOUS'
            ? 'px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40'
            : 'px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        }

        if (verdictText) {
          verdictText.textContent = data.defensive_verdict;
        }

        showToast(`Defensive scan complete: ${data.threat_classification}`, data.threat_classification === 'MALICIOUS_THREAT' ? 'error' : 'success');
      }
    } catch (e) {
      showToast('Failed to connect to /api/security/scan', 'error');
    }
  });
}

/* ==========================================================================
   Accessibility & Reduced Motion Controls
   ========================================================================== */

function bindAccessibilityControls(neuralBg) {
  const toggleBtn = document.getElementById('toggle-motion-btn');
  if (!toggleBtn) return;

  let isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  toggleBtn.addEventListener('click', () => {
    isReduced = !isReduced;
    document.body.classList.toggle('reduced-motion', isReduced);
    neuralBg.setReducedMotion(isReduced);

    toggleBtn.innerHTML = isReduced 
      ? `<i data-lucide="zap-off" class="w-4 h-4"></i> Motion: Off` 
      : `<i data-lucide="zap" class="w-4 h-4"></i> Motion: On`;

    showToast(`Reduced motion ${isReduced ? 'enabled' : 'disabled'}`);
    if (window.lucide) window.lucide.createIcons();
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const borderCol = type === 'error' ? 'border-red-500/40' : type === 'success' ? 'border-emerald-500/40' : 'border-cyan-500/40';
  const textCol = type === 'error' ? 'text-red-400' : type === 'success' ? 'text-emerald-400' : 'text-cyan-400';

  toast.className = `toast glass-panel p-3.5 px-4 rounded-xl border ${borderCol} flex items-center gap-3 text-xs font-mono shadow-2xl`;
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${type === 'error' ? 'bg-red-400' : type === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}"></span>
    <span class="${textCol}">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

/* ==========================================================================
   Advanced Animation & Interaction Controllers
   ========================================================================== */

function initScrollReveal() {
  const elements = document.querySelectorAll('section, .glass-panel, .glass-card, #education-timeline > div, #experience-timeline > div');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });
}

function initCardTiltAndSpotlight() {
  const cards = document.querySelectorAll('.glass-card, .glass-panel');

  cards.forEach(card => {
    if (card._hasSpotlightBound) return;
    card._hasSpotlightBound = true;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D Tilt calculation (subtle, non-jarring)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.2;
      const rotateY = ((x - centerX) / centerX) * 3.2;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600; // ms
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          // Ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = (target * easeProgress).toFixed(decimals);

          el.textContent = `${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${target.toFixed(decimals)}${suffix}`;
          }
        };

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function initRoleRotator() {
  const roleEl = document.getElementById('hero-rotating-role');
  if (!roleEl) return;

  const roles = [
    'Python Developer',
    'AI/ML Engineer',
    'Computer Vision Builder',
    'Autonomous Systems Specialist',
    'Cybersecurity Researcher'
  ];

  let currentIdx = 0;

  setInterval(() => {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(6px)';
    roleEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease';

    setTimeout(() => {
      currentIdx = (currentIdx + 1) % roles.length;
      roleEl.textContent = roles[currentIdx];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 290);
  }, 3000);
}

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
