"""
Generates a valid, compliant, standalone PDF 1.4 resume file for Krishna Sharma
without external dependencies.
"""
import os
from pathlib import Path

def generate_pdf():
    dest_dir = Path(r"C:\Users\asus\.gemini\antigravity-ide\scratch\krishna-portfolio\assets\resume")
    dest_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = dest_dir / "Krishna_Sharma_Resume.pdf"

    # PDF Stream content
    stream_content = """BT
/F1 20 Tf
50 780 Td
(KRISHNA SHARMA) Tj
/F2 10 Tf
0 -16 Td
(B.Tech CSE - AI/ML | Python Developer | AI/ML Enthusiast) Tj
0 -14 Td
(Indore, Madhya Pradesh, India | Email: Krishna.123mrkpro@gmail.com | Phone: +91 6266471092) Tj
0 -12 Td
(GitHub: https://github.com/Sharmaji2209-bot | LinkedIn: https://www.linkedin.com/in/krishna-sharma-a08065326) Tj

/F3 11 Tf
0 -26 Td
(EDUCATION) Tj
/F2 9 Tf
0 -14 Td
(IES IPS Academy, Indore - Bachelor of Technology, Computer Science & Engineering Core (2024 - 2028)) Tj
0 -12 Td
(Current Standing: 3rd Year, 5th Semester | CGPA: 7.56) Tj
0 -12 Td
(Secondary Education: Class 10 - 75.6%) Tj

/F3 11 Tf
0 -24 Td
(INTERNSHIPS & EXPERIENCE) Tj
/F1 9 Tf
0 -14 Td
(Academy of Skill Development, Hyderabad - AI/ML Using Python Intern (12 July 2025 - 14 Sept 2025)) Tj
/F2 9 Tf
0 -12 Td
(- Researched and built AI agents and practical computer vision automation for employee attendance.) Tj
0 -11 Td
(- Explored multi-face detection algorithms, MTCNN, and real-time identification routines.) Tj

/F1 9 Tf
0 -16 Td
(Indian Institute of Technology Jodhpur (IIT Jodhpur) - Cybersecurity Intern (23 March 2023 - 25 April 2023)) Tj
/F2 9 Tf
0 -12 Td
(- Trained in software security solutions, defensive architectures, and endpoint threat protection.) Tj
0 -11 Td
(- Analyzed malware signature heuristics and secure coding practices.) Tj

/F3 11 Tf
0 -24 Td
(FEATURED PROJECTS) Tj
/F1 9 Tf
0 -14 Td
(Autonomous Depth Navigation Assistant for the Visually Impaired (Signature Capstone)) Tj
/F2 9 Tf
0 -12 Td
(- Sensorless monocular depth and obstacle system using YOLOv8-Nano + Intel MiDaS-Small.) Tj
0 -11 Td
(- Formulated inverse metric calibration d = alpha / (disparity + epsilon) with alpha = 450.0.) Tj
0 -11 Td
(- Engineered 80th-percentile (P80) disparity bounding-box slicing to prevent background bleed.) Tj
0 -11 Td
(- Designed 3-tier asynchronous pipeline: 60 FPS video streaming + 12-16 Hz deep-learning worker.) Tj
0 -11 Td
(- Built automatic forensic blackbox collision logger (<0.8m breach in Center Zone) and non-blocking SAPI5 audio.) Tj

/F1 9 Tf
0 -16 Td
(Smart Employee Attendance System Using AI (Team Leader)) Tj
/F2 9 Tf
0 -12 Td
(- Led team developing multi-face detection via MTCNN, Dlib, and CNN feature vector embeddings.) Tj
0 -11 Td
(- Conceptualized secure state database verification model with tokenized verification.) Tj

/F1 9 Tf
0 -16 Td
(AI-Based Autonomous Assistance System for Disabled People (Team Leader)) Tj
/F2 9 Tf
0 -12 Td
(- Integrated ROS 2, Cartographer SLAM, YOLO object recognition, Whisper AI voice, and MQTT alerts.) Tj

/F3 11 Tf
0 -24 Td
(TECHNICAL SKILLS) Tj
/F2 9 Tf
0 -14 Td
(Languages: Python, C, C++ | AI/ML: PyTorch, TensorFlow/Keras, YOLOv8-Nano, MiDaS, Scikit-learn, NumPy, Pandas) Tj
0 -12 Td
(Computer Vision: OpenCV, Dlib, MTCNN, CLAHE | Web & Tools: Flask, HTML5, CSS, JS, Git, GitHub, VS Code, Google Cloud) Tj

/F3 11 Tf
0 -24 Td
(CERTIFICATIONS & ACHIEVEMENTS) Tj
/F2 9 Tf
0 -14 Td
(- 1st Place: Yuva Utsav Science Exhibition | 2nd Place: Debate on AI for Kids (Global Skill Park Bhopal)) Tj
0 -12 Td
(- Google Cloud Program (2025 & 2026) | Google Student Ambassador (1st Round) | NSS B & C Certificate) Tj
ET"""

    stream_bytes = stream_content.encode('latin1')
    stream_len = len(stream_bytes)

    # Assemble PDF objects
    objs = []
    # 1: Catalog
    objs.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objs.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    objs.append(b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>")
    # 4: Contents Stream
    objs.append(b"<< /Length " + str(stream_len).encode('ascii') + b" >>\nstream\n" + stream_bytes + b"\nendstream")
    # 5: Font F1 (Helvetica-Bold)
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    # 6: Font F2 (Helvetica)
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    # 7: Font F3 (Helvetica-Bold)
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    # Build PDF with xref table
    out = [b"%PDF-1.4\n"]
    offsets = []
    for i, obj in enumerate(objs, start=1):
        offsets.append(sum(len(x) for x in out))
        out.append(f"{i} 0 obj\n".encode('ascii') + obj + b"\nendobj\n")

    xref_offset = sum(len(x) for x in out)
    out.append(b"xref\n0 " + str(len(objs) + 1).encode('ascii') + b"\n")
    out.append(b"0000000000 65535 f \n")
    for off in offsets:
        out.append(f"{off:010d} 00000 n \n".encode('ascii'))

    out.append(b"trailer\n<< /Size " + str(len(objs) + 1).encode('ascii') + b" /Root 1 0 R >>\n")
    out.append(b"startxref\n" + str(xref_offset).encode('ascii') + b"\n%%EOF\n")

    with open(pdf_path, "wb") as f:
        f.write(b"".join(out))

    print(f"Generated PDF at {pdf_path} ({pdf_path.stat().st_size} bytes)")

if __name__ == "__main__":
    generate_pdf()
