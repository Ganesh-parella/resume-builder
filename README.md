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

> Add UI screenshots or a demo GIF here  
> _Example_: Live preview panel, template selector, summary generation modal, etc.

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

markdown
Copy
Edit

---

### ✅ Next Steps:
- Replace `#` in `Live Demo` with your deployed link (when ready)
- Add screenshots under the `Screenshots` section
- Paste this `README.md` into your GitHub repo or `frontend/README.md` if using monorepo

Want me to:
- Generate screenshots?
- Write deploy steps for Vercel and Render?
- Add GitHub badges?

Let me know!
