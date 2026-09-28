/**
 * Krishna Sharma - Portfolio Data Store
 * Cleanly decoupled data layer containing authentic academic, project,
 * internship, certification, and technical information.
 */

export const PERSONAL_INFO = {
  name: "Krishna Sharma",
  headline: "B.Tech CSE (AI/ML) Student | Python Developer | AI/ML Enthusiast",
  subheadline: "Building practical solutions with AI, computer vision, Python, and emerging technologies.",
  location: "Indore, Madhya Pradesh, India",
  email: "Krishna.123mrkpro@gmail.com",
  phone: "6266471092",
  displayPhoneMasked: "+91 62664 •••••",
  degree: "B.Tech in Computer Science & Engineering (Core)",
  specialization: "Artificial Intelligence & Machine Learning",
  college: "IES IPS Academy, Indore",
  academicYear: "3rd Year",
  semester: "5th Semester",
  cgpa: "7.56",
  graduationYear: "2028",
  secondaryEducation: {
    title: "Secondary School Examination (Class 10)",
    percentage: "75.6%"
  },
  socialLinks: {
    github: "https://github.com/Sharmaji2209-bot",
    linkedin: "https://www.linkedin.com/in/krishna-sharma-a08065326?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "mailto:Krishna.123mrkpro@gmail.com",
    leetcode: "https://leetcode.com/krishna-sharma", // Placeholder
    gfg: "https://auth.geeksforgeeks.org/user/krishna-sharma", // Placeholder
    kaggle: "https://kaggle.com/krishna-sharma" // Placeholder
  }
};

export const ABOUT_INFO = {
  summary: `Krishna Sharma is a third-year Bachelor of Technology student in Computer Science & Engineering at IES IPS Academy, Indore, with a strong interest in Artificial Intelligence, Machine Learning, Python development, Computer Vision, Cybersecurity, and emerging technologies. He enjoys building practical technology solutions that combine software, AI, and real-world problem solving. His experience includes AI/ML development, computer vision, cybersecurity training, cloud programs, technical projects, workshops, hackathons, and student activities.`,
  technicalInterests: [
    { title: "Artificial Intelligence", desc: "Applied AI models, heuristic optimization, agentic workflows", icon: "brain" },
    { title: "Machine Learning", desc: "Supervised & unsupervised learning, tabular modeling, feature engineering", icon: "cpu" },
    { title: "Python Development", desc: "Scalable backend services, async pipelines, computational scripting", icon: "code" },
    { title: "Computer Vision", desc: "Monocular depth estimation, YOLO object detection, facial recognition", icon: "eye" },
    { title: "Cybersecurity", desc: "Threat analysis, system protection, endpoint defensive architecture", icon: "shield" },
    { title: "Cloud Computing", desc: "Cloud infrastructure fundamentals, containerized services, edge deployment", icon: "cloud" },
    { title: "Software Development", desc: "Full-stack engineering, REST APIs, threading, system integration", icon: "layers" }
  ]
};

export const EDUCATION_DATA = [
  {
    institution: "IES IPS Academy, Indore",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering (CSE – Core)",
    status: "Currently Enrolled (3rd Year, 5th Semester)",
    metricLabel: "CGPA",
    metricValue: "7.56",
    timeline: "2024 – 2028 (Expected)",
    details: [
      "Core focus on Data Structures, Algorithms, Operating Systems, Database Management Systems, and Object-Oriented Programming.",
      "Specialized coursework and practical exploration in Artificial Intelligence, Machine Learning pipelines, and Computer Vision.",
      "Active participant in technical symposiums, coding challenges, and collegiate science exhibitions."
    ],
    badge: "Undergraduate"
  },
  {
    institution: "Secondary Education",
    degree: "Class 10 Examination",
    branch: "General Science & Mathematics",
    status: "Completed",
    metricLabel: "Score",
    metricValue: "75.6%",
    timeline: "Completed",
    details: [
      "Rigorous secondary schooling foundation in analytical mathematics, basic computing, and physical sciences.",
      "Demonstrated consistent academic performance and leadership in school activities."
    ],
    badge: "Secondary School"
  }
];

export const SKILLS_DATA = {
  categories: [
    { id: "all", label: "All Skills" },
    { id: "languages", label: "Programming Languages" },
    { id: "aiml", label: "AI & Machine Learning" },
    { id: "cv", label: "Computer Vision & DL" },
    { id: "dev", label: "Development & Backend" },
    { id: "tools", label: "Tools & Platforms" },
    { id: "other", label: "Specialized Domains" }
  ],
  items: [
    // Programming Languages
    { name: "Python", category: "languages", level: "Primary Language", icon: "code", highlight: true },
    { name: "C", category: "languages", level: "Core Foundations", icon: "cpu", highlight: false },
    { name: "C++", category: "languages", level: "Object-Oriented & DSA", icon: "terminal", highlight: false },

    // AI & Machine Learning
    { name: "Machine Learning", category: "aiml", level: "Algorithms & Pipelines", icon: "sparkles", highlight: true },
    { name: "NumPy", category: "aiml", level: "Numerical Arrays & Tensor Math", icon: "binary", highlight: false },
    { name: "Pandas", category: "aiml", level: "Data Transformation & ETL", icon: "table", highlight: false },
    { name: "Scikit-learn", category: "aiml", level: "Classification & Regression", icon: "git-branch", highlight: false },
    { name: "Matplotlib", category: "aiml", level: "Telemetry & Metric Visualization", icon: "bar-chart-2", highlight: false },

    // Computer Vision & Deep Learning
    { name: "OpenCV", category: "cv", level: "Image Processing & Filtering", icon: "camera", highlight: true },
    { name: "Dlib", category: "cv", level: "Facial Landmark Detection", icon: "user-check", highlight: false },
    { name: "YOLO", category: "cv", level: "Real-time Object Detection", icon: "crosshair", highlight: true },
    { name: "YOLOv8-Nano", category: "cv", level: "Edge-Optimized Detection", icon: "zap", highlight: true },
    { name: "MTCNN", category: "cv", level: "Cascaded Face Alignment", icon: "scan-face", highlight: false },
    { name: "MiDaS-Small", category: "cv", level: "Monocular Inverse Depth", icon: "layers", highlight: true },
    { name: "PyTorch", category: "cv", level: "Deep Learning Framework", icon: "flame", highlight: true },
    { name: "TensorFlow / Keras", category: "cv", level: "Neural Network Architectures", icon: "network", highlight: false },

    // Development & Web
    { name: "HTML5", category: "dev", level: "Semantic Web Structure", icon: "layout", highlight: false },
    { name: "CSS", category: "dev", level: "Modern Responsive Styling", icon: "palette", highlight: false },
    { name: "JavaScript", category: "dev", level: "Client-side Logic & DOM", icon: "file-code", highlight: false },
    { name: "Flask", category: "dev", level: "Python Microframework & MJPEG", icon: "server", highlight: true },
    { name: "REST APIs", category: "dev", level: "API Integration & Endpoints", icon: "plug", highlight: false },

    // Tools & Platforms
    { name: "Git", category: "tools", level: "Version Control", icon: "git-commit", highlight: false },
    { name: "GitHub", category: "tools", level: "Collaboration & Repositories", icon: "github", highlight: false },
    { name: "Google Colab", category: "tools", level: "GPU Model Prototyping", icon: "play", highlight: false },
    { name: "VS Code", category: "tools", level: "Primary IDE & Tooling", icon: "edit-3", highlight: false },
    { name: "Google Cloud", category: "tools", level: "Cloud Foundations & Consoles", icon: "cloud", highlight: true },
    { name: "Google Antigravity", category: "tools", level: "Advanced Agentic IDE", icon: "box", highlight: true },
    { name: "Google Stitch", category: "tools", level: "Developer Tooling", icon: "tool", highlight: false },

    // Other Areas
    { name: "Cybersecurity", category: "other", level: "Defensive Software & Threat Protection", icon: "shield-alert", highlight: true },
    { name: "Cloud Computing", category: "other", level: "Distributed Compute Basics", icon: "cloud-rain", highlight: false },
    { name: "Computer Vision", category: "other", level: "Spatial Spatial Geometry", icon: "eye", highlight: true },
    { name: "Robotics", category: "other", level: "ROS 2 & Sensor Interfacing", icon: "bot", highlight: false },
    { name: "IoT", category: "other", level: "MQTT & Connected Devices", icon: "wifi", highlight: false },
    { name: "Natural Language Processing", category: "other", level: "Whisper & Vosk Speech Models", icon: "mic", highlight: false }
  ]
};

export const EXPERIENCE_DATA = [
  {
    id: "exp-1",
    role: "AI/ML Using Python Intern",
    organization: "Academy of Skill Development",
    location: "Hyderabad, India (Remote / Hybrid)",
    duration: "12 July 2025 – 14 September 2025",
    timeframe: "8 Weeks",
    description: "Worked on developing AI agents for day-to-day tasks using Python and explored practical AI/ML applications in corporate workflows and automated monitoring.",
    projectTitle: "Smart Employee Attendance System",
    highlights: [
      "AI/ML Agent Architecture",
      "Python 3 Development",
      "Computer Vision & Facial Recognition",
      "Real-World Attendance Automation",
      "Dataset Preprocessing & Anti-Spoofing"
    ],
    achievements: [
      "Researched and integrated computer vision pipelines using OpenCV and MTCNN for multi-face detection.",
      "Engineered automated employee logging scripts that reduced manual verification overhead.",
      "Documented technical workflows, architectural feasibility, and data handling protocols."
    ]
  },
  {
    id: "exp-2",
    role: "Cybersecurity Intern",
    organization: "Indian Institute of Technology Jodhpur (IIT Jodhpur)",
    location: "Jodhpur, Rajasthan, India",
    duration: "23 March 2023 – 25 April 2023",
    timeframe: "4 Weeks",
    description: "Worked on comprehensive security solutions for software systems and explored cybersecurity concepts through practical training, code analysis, and threat protection fundamentals.",
    projectTitle: "Antivirus Software & Defensive System Architecture",
    highlights: [
      "Cybersecurity Fundamentals",
      "Software Security & Threat Protection",
      "Malware Signature Recognition",
      "Endpoint Security Concepts",
      "Defensive Code Auditing"
    ],
    achievements: [
      "Explored file-integrity heuristics, process monitoring, and signature matching mechanisms for defensive software.",
      "Participated in hands-on labs analyzing malicious execution vectors and defensive countermeasures.",
      "Gained deep foundational knowledge of secure software development lifecycles and cryptographic hygiene."
    ]
  }
];

export const PROJECTS_DATA = [
  {
    id: "depth-navigation-assistant",
    featured: true,
    badge: "Featured / Signature Capstone Project",
    title: "Autonomous Depth Navigation Assistant for the Visually Impaired",
    shortDescription: "An end-to-end sensorless assistive computer vision system designed to provide real-time spatial awareness, obstacle identification, depth estimation, and collision avoidance using a single standard 2D RGB monocular camera.",
    image: "assets/images/depth_navigation_signature.jpg",
    role: "Lead Developer & System Architect",
    responsibilities: [
      "Designed the 3-tier asynchronous multi-rate threading pipeline separating 60 FPS video streaming from 12–16 Hz deep-learning perception.",
      "Formulated the sensorless inverse metric distance calibration model d = α / (disparity + ε) with α = 450.0.",
      "Engineered the 80th-percentile (P80) disparity bounding-box slicing method to suppress background depth bleed.",
      "Built a non-blocking assistive audio dispatch queue with SAPI5, priority-based alert preemption, and speech cooldowns.",
      "Implemented an automated forensic blackbox incident logger capturing telemetry and frames upon near-miss collision breaches (<0.8m).",
      "Created a dual MJPEG stream dashboard (RGB perception + Inferno depth colormap) and procedural 3D room simulator."
    ],
    technologies: [
      "Python 3.11",
      "PyTorch",
      "Ultralytics YOLOv8-Nano",
      "Intel ISL MiDaS-Small",
      "OpenCV 4.x",
      "NumPy",
      "Flask 3.x",
      "pyttsx3 / Windows SAPI5",
      "CLAHE (CIELAB)",
      "Dark Glassmorphism",
      "Tailwind CSS"
    ],
    metricDistanceFormula: {
      formula: "d = \\frac{\\alpha}{\\text{disparity} + \\varepsilon}",
      alpha: 450.0,
      epsilon: "1e-5",
      nearField: "0.3 m – 2.2 m",
      farField: "2.2 m – 8.0 m",
      explanation: "Converts relative disparity outputs from MiDaS-Small into approximated physical metric distances without hardware LiDAR or stereo depth sensors."
    },
    p80Explanation: "In standard bounding boxes, background pixels behind the obstacle distort the mean or median depth. Taking the 80th percentile of disparity (where higher disparity = closer distance) isolates the closest forward-facing surface of the obstacle while filtering out background bleed.",
    architectureTiers: [
      {
        tier: "Tier 1",
        name: "Camera Grabber",
        rate: "30–60 FPS",
        desc: "Non-blocking dedicated thread capturing raw camera frames into atomic memory buffers with zero latency."
      },
      {
        tier: "Tier 2",
        name: "Perception Worker",
        rate: "~12–16 Hz Inference",
        desc: "Parallel worker executing YOLOv8-Nano semantic detection and Intel MiDaS-Small dense disparity estimation."
      },
      {
        tier: "Tier 3",
        name: "Video Streamer & Audio Dispatch",
        rate: "60 FPS Streaming",
        desc: "Synthesizes dual MJPEG streams (RGB Perception HUD + Inferno Depth Colormap) and manages non-blocking SAPI5 speech synthesis."
      }
    ],
    signatureFeatures: [
      {
        title: "Zero External Sensor Requirement",
        desc: "Eliminates expensive LiDAR, ultrasonic arrays, and stereo cameras by operating entirely on a standard 2D monocular RGB webcam.",
        icon: "camera-off"
      },
      {
        title: "P80 Disparity Bounding-Box Slicing",
        desc: "Applies 80th-percentile disparity sampling within detected bounding boxes to isolate the closest physical surface and eliminate background bleed.",
        icon: "filter"
      },
      {
        title: "Head-Level & Ground Hazard Classification",
        desc: "Detects elevated obstacles (open cabinet doors, tree branches, scaffolding) alongside low ground trip hazards using vertical spatial partitioning.",
        icon: "alert-triangle"
      },
      {
        title: "Dual MJPEG Streaming HUD",
        desc: "Transmits synchronous dual video feeds: real-time RGB bounding box telemetry HUD alongside an Inferno Colormap dense depth heatmap.",
        icon: "layers"
      },
      {
        title: "Forensic Blackbox Incident Logger",
        desc: "Automatically records timestamped JSON telemetry and image snapshots whenever a critical collision breach (< 0.8m in Center Zone) is triggered.",
        icon: "hard-drive"
      },
      {
        title: "Low-Light CLAHE Pre-Processor",
        desc: "Applies Contrast Limited Adaptive Histogram Equalization in the CIELAB color space to enhance night-vision and dim indoor environments.",
        icon: "moon"
      },
      {
        title: "Procedural 3D Room Simulator",
        desc: "Integrated synthetic 3D testing environment enabling automated spatial obstacle evaluation without requiring physical hardware camera access.",
        icon: "box"
      }
    ],
    liveTelemetrySample: {
      incident_id: "20260922_231746_061",
      timestamp: "2026-09-22T23:17:46.061927",
      obstacle_name: "person",
      confidence: "92%",
      estimated_distance_m: "0.65 m",
      direction_zone: "CENTER",
      vertical_zone: "NORMAL",
      threat_level: "CRITICAL",
      alert_message: "CRITICAL BREACH: person at 0.65m in CENTER ZONE",
      snapshotFile: "assets/images/blackbox_incident_real.jpg"
    }
  },
  {
    id: "smart-attendance-system",
    featured: false,
    badge: "AI & Computer Vision",
    title: "Smart Employee Attendance System Using AI",
    shortDescription: "An AI-powered attendance system that uses computer vision and facial recognition to automatically identify individuals and track attendance in real time within a defined office environment.",
    image: "assets/images/attendance_system.jpg",
    role: "Team Leader",
    responsibilities: [
      "Led the project team, guiding algorithmic selection, timeline milestones, and deliverables.",
      "Architected backend integration pipelines and facial vector comparison routines.",
      "Authored technical feasibility studies and system documentation.",
      "Designed the conceptual integration workflow for authorized institutional database connectivity (Government of MP Aadhaar authentication concept)."
    ],
    technologies: [
      "Python",
      "OpenCV",
      "Dlib",
      "MTCNN",
      "TensorFlow / Keras",
      "Pre-trained CNNs",
      "SQLite / REST API"
    ],
    keyFeatures: [
      "Real-time multi-face detection and alignment using cascaded MTCNN architectures.",
      "128-dimensional facial embedding generation with deep metric cosine similarity verification.",
      "Liveness verification heuristics to prevent photo/screen spoofing attacks.",
      "Conceptual integration model for Government of Madhya Pradesh authorized Aadhaar database biometric verification.",
      "Automated attendance spreadsheet and database logging with timestamped entry/exit records."
    ],
    specialFeatureNote: "Architected as a secure institutional verification concept designed to interface with authorized state databases using encrypted tokenized biometric validation protocols, preventing unauthorized credential storage."
  },
  {
    id: "autonomous-assistance-disabled",
    featured: false,
    badge: "Robotics & IoT Assistive Tech",
    title: "AI-Based Autonomous Assistance System for Disabled People",
    shortDescription: "An intelligent assistive system combining computer vision, voice recognition, robotics, and IoT to support hands-free navigation, real-time obstacle avoidance, and independent daily task execution.",
    image: "assets/images/assistive_robotics.jpg",
    role: "Team Leader",
    responsibilities: [
      "Spearheaded team coordination, ROS 2 node architecture, and component communication protocols.",
      "Formulated technical documentation, hardware-in-the-loop feasibility tests, and user safety standards.",
      "Designed the multi-modal sensing integration between Whisper AI speech recognition and SLAM navigation.",
      "Authored the Preemptive Path Prediction and distress alert routines via MQTT IoT brokers."
    ],
    technologies: [
      "Robotics & ROS 2",
      "SLAM (RTAB-Map / Cartographer)",
      "YOLO",
      "MobileNet",
      "Whisper AI & Vosk",
      "MQTT Protocol",
      "Python",
      "C++"
    ],
    keyFeatures: [
      "Autonomous 2D/3D indoor mapping and localization with Cartographer and RTAB-Map SLAM nodes.",
      "Hands-free natural language voice command interpretation via lightweight Whisper AI and offline Vosk engines.",
      "Preemptive Path Prediction with real-time dynamic obstacle trajectory calculations.",
      "Fall & Distress Analytics generating instant emergency alerts over low-latency MQTT IoT channels.",
      "Comprehensive multi-modal assistive navigation tailored for indoor accessibility and assistive mobility."
    ],
    architecturePipeline: [
      { step: "01", name: "Camera & Sensors", desc: "RGB feeds, wheel odometry, IMU telemetry" },
      { step: "02", name: "Computer Vision", desc: "Frame enhancement, edge detection, optical flow" },
      { step: "03", name: "AI Perception", desc: "YOLO/MobileNet object classification & human pose estimation" },
      { step: "04", name: "Path Planning", desc: "Costmap generation & global/local trajectory planning" },
      { step: "05", name: "Obstacle Avoidance", desc: "Dynamic velocity obstacle calculations & reactive steering" },
      { step: "06", name: "Voice / IoT Response", desc: "Audio acknowledgment & MQTT telemetry dispatch" }
    ]
  }
];

export const CERTIFICATIONS_DATA = {
  formal: [
    {
      title: "Google Cloud Certification / Program",
      issuer: "Google Cloud",
      year: "2025 & 2026",
      desc: "Comprehensive training and hands-on skill badges covering Google Cloud infrastructure, cloud computing fundamentals, compute engines, storage architectures, and cloud-native AI capabilities.",
      tag: "Cloud & Infrastructure",
      icon: "cloud"
    },
    {
      title: "Google Student Ambassador — 1st Round",
      issuer: "Google",
      year: "Selected / Round 1",
      desc: "Recognized in the preliminary selection cohort of student technology leaders championing developer platforms, AI tools, and technical peer engagement.",
      tag: "Leadership & Community",
      icon: "award"
    },
    {
      title: "NSS 'B' & 'C' Certificate Holder",
      issuer: "National Service Scheme (NSS), Govt. of India",
      year: "Certified",
      desc: "Successfully completed disciplined multi-year service requirements, community leadership camps, and state-level volunteer mobilization programs.",
      tag: "National Service",
      icon: "shield-check"
    }
  ],
  programsAndParticipation: [
    {
      title: "College-Level Hackathons & Coding Sprints",
      institution: "IES IPS Academy & Partner Institutions",
      year: "2024 – 2026",
      desc: "Active participation in rapid prototyping hackathons building computer vision prototypes, algorithmic solutions, and assistive tools within competitive time limits.",
      tag: "Competitive Prototyping",
      icon: "terminal"
    }
  ]
};

export const WORKSHOPS_DATA = [
  {
    title: "Generative AI Workshop",
    location: "Bhopal, Madhya Pradesh",
    desc: "Hands-on immersion in modern foundation models, prompt engineering, vector embeddings, and real-world enterprise applications of generative artificial intelligence.",
    tag: "Generative AI",
    icon: "sparkles"
  },
  {
    title: "Market Analysis Using AI",
    location: "National Institute of Securities Markets (NISM)",
    issuer: "Government of India",
    desc: "Explored computational predictive models, quantitative time-series forecasting, algorithmic market data analysis, and regulatory fintech considerations.",
    tag: "Fintech & Data Modeling",
    icon: "trending-up"
  },
  {
    title: "AI for Healthcare Workshop",
    location: "Be10X Pvt. Ltd.",
    desc: "Deep-dive into medical imaging analysis, diagnostic AI assistance pipelines, biomedical data privacy, and ethical machine learning deployments in patient care.",
    tag: "Healthcare AI",
    icon: "activity"
  }
];

export const ACHIEVEMENTS_DATA = [
  {
    badge: "🥇 1st Place",
    title: "Yuva Utsav – Science Exhibition",
    level: "First Prize Winner",
    desc: "Awarded 1st Place for presenting an innovative applied technology model demonstrating real-world practical problem solving and technical implementation.",
    icon: "award"
  },
  {
    badge: "🥈 2nd Place",
    title: "Debate on AI for Kids",
    level: "Second Prize Winner",
    organization: "Shree Sant Shiromani Global Skill Park, Bhopal",
    desc: "Secured 2nd Place presenting structured arguments on the educational, cognitive, ethical, and developmental implications of Artificial Intelligence for younger generations.",
    icon: "mic"
  },
  {
    badge: "🎖️ District Achievement",
    title: "28th District-Level Yuva Utsav",
    level: "District Representative & Participant",
    desc: "Represented collegiate peers at the prestigious 28th District-Level Yuva Utsav technical and cultural symposium, demonstrating youth innovation and leadership.",
    icon: "star"
  },
  {
    badge: "🏛️ National Challenge",
    title: "MyBharat Budget Quest 2025",
    level: "National Initiative Participant",
    desc: "Participated in the civic economic literacy and national budget policy analytics initiative under the MyBharat national portal.",
    icon: "flag"
  }
];

export const NSS_DATA = {
  title: "NSS & Community Engagement",
  overview: "Actively serving as a dedicated National Service Scheme (NSS) volunteer, cultivating teamwork, leadership, social awareness, and civic responsibility alongside technical studies.",
  activities: [
    {
      title: "NSS 'B' & 'C' Certificate Holder",
      role: "Certified Volunteer",
      desc: "Attained prestigious 'B' and 'C' service certifications through consistent participation in campus cleanliness drives, rural empowerment initiatives, and health camps."
    },
    {
      title: "Volunteer — Bricks India 2024",
      role: "Event Volunteer",
      desc: "Contributed to logistical execution, delegate assistance, and team coordination during the Bricks India 2024 national youth event."
    },
    {
      title: "Campus & Community Leadership",
      role: "Student Coordinator",
      desc: "Collaborated with multi-disciplinary student teams to organize awareness seminars, technical workshops, and social outreach campaigns in Indore."
    }
  ]
};
