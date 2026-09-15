# 🥤 PEPSI-MAN 3D RUNNER (PS1 Retro Edition)

An action-packed 3D endless runner game inspired by the legendary PS1 classic **PEPSI-MAN**, built with **React**, **Three.js** (for 3D graphics), and a **Node.js + Express + Socket.io** backend for online leaderboards!

---

## 🌟 Features

- **3D Pepsi-Man Character**: Custom low-poly 3D runner with running leg/arm animations, jump height parabola, ducking stance, and glowing shield aura.
- **2 Playable Stages**:
  - 🏡 **Stage 1: Village Stage** (Dirt paths, thatched cottages, hay bales, wooden fence hurdles, and river bridges).
  - 🏙️ **Stage 2: City Stage** (Asphalt highway, neon skyscrapers, street lamps, traffic cones, and city buses).
- **Collectibles & Power-Ups**:
  - 🥤 **Pepsi Soda Cans**: Earn points & energy.
  - ⚡ **Golden Boost Cans**: High score bonus + instant speed burst.
  - 🛡️ **Invincibility Shield**: 8 seconds of crash protection.
- **Web Audio API Sound Engine**: 90s PS1 synth funk beat loop + retro sound effects (jump, slide, can pick, crash).
- **Node.js Backend**: Express REST API & Socket.io real-time high score leaderboards.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install & Start Backend Server
```bash
cd server
npm install
npm start
```
*Backend server runs on http://localhost:5000*

### 2. Install & Start Frontend App
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Frontend app runs on http://localhost:3000*

---

## 🎮 Game Controls

| Action | Keyboard | Touch / On-Screen UI |
| :--- | :--- | :--- |
| **Steer Left** | `A` or `←` | Left Arrow Button |
| **Steer Right** | `D` or `→` | Right Arrow Button |
| **Jump** | `W` or `↑` or `Space` | Top Gold Button |
| **Slide / Duck** | `S` or `↓` | Bottom Red Button |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Three.js, `@react-three/fiber`, `@react-three/drei`, Vite, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, Socket.io, Cors
- **Audio**: Web Audio API Procedural Synthesizer
"# PEPSI-MAN-GAME" 
