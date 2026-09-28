# Krishna Sharma — Personal Portfolio & AI Engineering Showcase

A modern, high-performance personal portfolio website for **Krishna Sharma**, a 3rd-year B.Tech Computer Science & Engineering (AI/ML) student at **IES IPS Academy, Indore**.

Designed specifically for technical recruiters, internship opportunities, engineering collaborators, and hackathon judges.

---

## 🌟 Key Highlights & Features

- **Dark + Futuristic Developer Aesthetic**: Built on a deep obsidian palette with custom glassmorphic panels, subtle glow accents, and modern typography (*Inter* & *JetBrains Mono*).
- **Interactive Multi-Layer Synaptic Neural Canvas**: 60 FPS HTML5 canvas featuring background micro-stars, node connections, traveling synaptic photon pulses, and interactive mouse shockwaves.
- **Dynamic Specular Light & 3D Tilt**: Glassmorphism cards smoothly react to cursor movement with dynamic radial spotlights and subtle 3D perspective shifts.
- **Scroll-Driven Staggered Reveals**: Smooth blur-to-clear entrance animations across all sections, timeline items, and skill badges.
- **Interactive Numerical Counters**: Real-time counter increments for academic standing, CGPA (7.56), and project statistics.
- **Hero Dynamic Role Rotator**: Seamless transition between primary specialties (*Python Developer, AI/ML Engineer, Computer Vision Builder, Autonomous Systems Specialist, Cybersecurity Researcher*).

---

## 🚀 Featured Engineering Projects

### 1. Autonomous Depth Navigation Assistant for the Visually Impaired *(Signature Capstone)*
- **Sensorless Monocular Architecture**: Operates on a single standard 2D monocular RGB webcam without expensive LiDAR, sonar arrays, or stereo cameras.
- **Deep-Learning Perception**: Ultralytics **YOLOv8-Nano** coupled with Intel ISL **MiDaS-Small** on PyTorch.
- **Inverse Metric Distance Calibration**:
  $$d = \frac{\alpha}{\text{disparity} + \varepsilon} \quad (\alpha = 450.0, \; \varepsilon = 10^{-5})$$
- **80th-Percentile (P80) Disparity Bounding-Box Slicing**: Eliminates background depth bleed by sampling the 80th-percentile disparity within detected bounding boxes.
- **3-Tier Asynchronous Multi-Rate Threading Pipeline**: 
  - *Tier 1*: Camera Grabber (atomic frame buffer)
  - *Tier 2*: Perception Worker (~12–16 Hz inference)
  - *Tier 3*: Video Streamer (60 FPS MJPEG broadcast + non-blocking SAPI5 audio dispatch)
- **Interactive Simulator**: Dual-stream viewer (RGB Perception HUD + Inferno Depth Heatmap `COLORMAP_INFERNO`), real-time laser scanner, animated sonar radar rings, and automated forensic collision breach blackbox logger (<0.8m).
- **Procedural 3D Room Simulator**: Interactive wireframe room canvas simulating camera perspective, spatial hazards, and raycasting without physical hardware.

### 2. Smart Employee Attendance System Using AI *(Team Leader)*
- Real-time multi-face detection with MTCNN, Dlib, and CNN feature vector embeddings.
- Conceptual integration model for Government of Madhya Pradesh authorized Aadhaar database biometric verification.

### 3. AI-Based Autonomous Assistance System for Disabled People *(Team Leader)*
- ROS 2, Cartographer SLAM, YOLO object tracking, Whisper AI / Vosk voice command interpretation, and Preemptive Path Prediction with fall & distress IoT alerts.

---

## 🛠️ Technical Skills

- **Programming Languages**: Python, C, C++
- **AI & Machine Learning**: Machine Learning, NumPy, Pandas, Scikit-learn, Matplotlib
- **Computer Vision & Deep Learning**: OpenCV, Dlib, YOLO, YOLOv8-Nano, MTCNN, MiDaS-Small, PyTorch, TensorFlow / Keras
- **Web & Backend**: HTML5, CSS, JavaScript, Flask, REST APIs
- **Tools & Platforms**: Git, GitHub, Google Colab, VS Code, Google Cloud, Google Antigravity, Google Stitch
- **Specialized Domains**: Cybersecurity, Cloud Computing, Computer Vision, Robotics (ROS 2), IoT (MQTT), NLP

---

## 💻 Full-Stack Operational Backend & Quickstart

The portfolio is powered by a zero-dependency **Unified Python Backend Server** (`server.py`) with persistent SQLite storage:

- **Spatial Depth Navigation API**: Computes inverse disparity distance calculations ($d = \alpha / (\text{disp} + \varepsilon)$) and automatically logs near-miss collision incidents ($<0.8\text{m}$) into SQLite.
- **Smart Attendance API**: Biometric face verification endpoint (`/api/attendance/verify`) with cosine similarity scoring, liveness heuristics, and live attendance ledger (`/api/attendance/records`).
- **Autonomous Assistive Robotics API**: Kinematic motion dispatcher (`/api/assistive/command`) and 360° LiDAR telemetry (`/api/assistive/telemetry`).
- **Contact Inquiries API**: Persists recruiter messages and queries into a backend SQLite database (`/api/contact`) with automated tracking tickets.

### Running Locally:

```bash
# Clone the repository
git clone https://github.com/Sharmaji2209-bot/<repo-name>.git
cd <repo-name>

# Start unified full-stack server (APIs + Frontend)
python server.py
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 📄 Contact & Profiles

- **Developer**: Krishna Sharma
- **Location**: Indore, Madhya Pradesh, India
- **Email**: [Krishna.123mrkpro@gmail.com](mailto:Krishna.123mrkpro@gmail.com)
- **GitHub**: [github.com/Sharmaji2209-bot](https://github.com/Sharmaji2209-bot)
- **LinkedIn**: [linkedin.com/in/krishna-sharma-a08065326](https://www.linkedin.com/in/krishna-sharma-a08065326?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- **Resume**: Available for direct preview and download via the on-site modal or [`assets/resume/Krishna_Sharma_Resume.pdf`](assets/resume/Krishna_Sharma_Resume.pdf).

---
*© 2026 Krishna Sharma. All rights reserved.*
