# 🧠 ResuCraft – AI-Powered Resume Builder

ResuCraft is a powerful web application that helps users craft modern, ATS-friendly resumes with ease. Built with **React**, **Strapi**, and **Tailwind CSS**, it features a seamless interface, real-time preview, AI-powered summary generation, and multiple professional templates.

---

## 🚀 Features

- 🎨 Multiple customizable resume layouts & templates
- 🧠 AI-generated resume summary (powered by Gemini AI)
- ✍️ Markdown editor for work experience and education
- 📄 Real-time resume preview and PDF export
- 🔐 Authentication with Clerk
- 💾 Persistent resume data with Strapi CMS
- 🌈 Clean, modern UI built with Tailwind CSS & Shadcn UI
- 🔧 Modular & scalable codebase

---

## 🛠️ Tech Stack

| Frontend        | Backend          | AI & Auth          |
|-----------------|------------------|--------------------|
| React + Vite    | Strapi CMS       | Gemini AI (Summary)|
| Tailwind CSS    | REST API         | Clerk Auth         |
| Shadcn UI       | JSON Resume Model|                    |

---

## 📦 Folder Structure

resucraft/
├── frontend/ # React (Vite) client
├── backend/ # Strapi CMS backend
├── README.md
└── ...

yaml
Copy
Edit

---

## 📸 Screenshots
<p align="center">
  <img src="https://github.com/user-attachments/assets/cef86c67-2b00-4cbd-96d6-a613ae485b2e" width="800"/>
  <img src="https://github.com/user-attachments/assets/2bcb67c0-8469-4cc7-9627-960cf17b10b8" width="800"/>
  <img src="https://github.com/user-attachments/assets/c4a4436f-6903-47f7-856c-bf387642b6ab" width="800"/>
  <img src="https://github.com/user-attachments/assets/cb821d90-9626-4745-be40-a86873d176c0" width="800"/>
  <img src="https://github.com/user-attachments/assets/1dbbf985-9969-41d4-b845-7bed23ad3e53" width="800"/>
  <img src="https://github.com/user-attachments/assets/fa3e5153-0e99-4ae3-aad3-5dc3cb5c3832" width="800"/>
  <img src="https://github.com/user-attachments/assets/800e1795-da90-42cf-95cd-d4e964065cc4" width="800"/>
  <img src="https://github.com/user-attachments/assets/7c35e4b0-0e5b-4385-825a-08f2b5a90254" width="800"/>
</p>



---

## ⚙️ Getting Started

### 🔑 Prerequisites

- Node.js ≥ 18
- Yarn or npm
- Strapi CLI
- Clerk API key (for auth)
- Gemini API key (for AI summary)

---

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
Update .env with your Clerk and Gemini credentials.

🧩 Backend Setup (Strapi)
bash
Copy
Edit
cd backend
npm install
npm run develop
Set up a Resume content type in Strapi with JSON fields:

Personal Info

Experience

Education

Projects

Skills

Summary

Certifications

Languages

Layout/Theme preferences

🌐 Deployment
Layer	Platform
Frontend	Vercel / Netlify
Backend	Render / Railway

Need help? Ask me to generate deployment steps for Vercel & Render!

🤝 Contributing
Contributions are welcome! To get started:

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit your changes

Push to your fork

Open a pull request

📜 License
MIT License

💡 Inspiration
ResuCraft was built to help job-seekers create standout, modern resumes with minimal effort using automation, clean design, and AI assistance.

🔗 Links
🔗 Live Demo (Coming Soon)

📘 Strapi Docs

🎨 Tailwind CSS

🤖 Gemini AI

🔐 Clerk

Created with 💙 by Ganesh Parella



