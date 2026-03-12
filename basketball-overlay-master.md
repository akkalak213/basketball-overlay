# 🏀 Project: Real-time Basketball Score Overlay (All-in-One)
**Role:** You are an expert Full-Stack Developer (Next.js 14 App Router, NestJS, TypeScript, Socket.io, Tailwind CSS).
**Task:** Scaffold and generate the complete code for a Real-time Basketball Overlay system. The system consists of a NestJS WebSocket backend and a Next.js frontend with `/admin` and `/overlay` routes.
**Requirement:** Generate the exact file structure and code blocks below.

---

## 📂 1. Project Initialization Commands
Before writing files, output the terminal commands to initialize the monorepo/workspaces:
```bash
# 1. Init Frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"
cd frontend
npm install socket.io-client framer-motion lucide-react

# 2. Init Backend
cd ..
npx @nestjs/cli new backend --package-manager npm
cd backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io