# Project SOO: P2P Edge AI Swarm Desktop

> **Decentralized P2P Edge Intelligence Monorepo**  
> *Track: AI Synergy & Human-Computer Symbiosis*

Project SOO breaks through the consumer hardware compute barrier by pooling local laptop resources peer-to-peer. Using **Pipeline Parallelism** and decentralized node auto-discovery (Exo engine + FastAPI sidecar), SOO shards large language models (8B–70B parameters) across standard consumer machines on local LAN/Wi-Fi without centralized cloud infrastructure.

---

## 🏗 Architecture Overview

The monorepo connects three core tiers:

```
┌────────────────────────────────────────────────────────┐
│                   Desktop Shell                        │
│          Tauri v2 (Rust Container & IPC)               │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌────────────────────────┐      ┌────────────────────────┐
│     Next.js 15 UI      │◄────►│  FastAPI Sidecar       │
│  - Real-time Topology  │(SSE) │  - Exo Swarm Engine    │
│  - Memory Pool Matrix  │      │  - Context Pipeline    │
│  - Streaming Chat      │      │  - Peer Discovery UDP  │
└────────────────────────┘      └───────────┬────────────┘
                                            │ (P2P Wi-Fi / LAN)
                                            ▼
                                ┌────────────────────────┐
                                │ Peer Laptops (Swarm)   │
                                │ Node A ──► Node B ──► C│
                                └────────────────────────┘
```

1. **Frontend (`src/`)**: Next.js 15 + Tailwind CSS interactive dashboard displaying live peer topologies, unified VRAM/RAM allocations, and real-time SSE token streams.
2. **Desktop Shell (`src-tauri/`)**: Lightweight Tauri v2 Rust runtime managing window lifecycle and spawning the background sidecar.
3. **Backend Sidecar (`backend-sidecar/`)**: Python FastAPI engine featuring:
   - **Exo Engine Integration**: Subnet UDP auto-discovery & tensor routing.
   - **Dynamic Memory Topology**: Pipeline partitioning based on peer RAM capacity.
   - **Local Context Pipeline**: Zero-cloud document chunking and prompt synthesis.

---

## 📁 Repository Structure

```
soo-swarm-desktop/
├── backend-sidecar/          # Python FastAPI sidecar & Exo swarm engine
│   ├── main.py               # FastAPI REST & SSE endpoints
│   ├── swarm_engine.py       # P2P discovery & pipeline parallelism
│   ├── context_pipeline.py   # Local file parsing & prompt injection
│   └── requirements.txt      # Python dependencies
├── src/                      # Next.js 15 frontend
│   └── app/
│       ├── layout.tsx        # Root layout & font definition
│       ├── page.tsx          # Real-time Swarm Topology & Chat UI
│       └── globals.css       # Tailwind CSS configuration
├── src-tauri/                # Tauri v2 desktop application shell
│   ├── src/
│   │   └── main.rs           # Rust entrypoint & sidecar supervisor
│   ├── Cargo.toml            # Rust dependencies & metadata
│   └── tauri.conf.json       # Tauri window & bundle configuration
├── .gitignore                # Comprehensive exclusions for Node, Rust & Python
├── package.json              # Monorepo scripts & dependencies
├── tsconfig.json             # TypeScript configuration
└── next.config.mjs           # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ & npm/pnpm
- **Rust**: 1.75+ (for Tauri v2)
- **Python**: 3.10+ (for FastAPI sidecar)

### Local Development

1. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Python Sidecar:**
   ```bash
   cd backend-sidecar
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run in Desktop Mode (Tauri + Next.js + Sidecar):**
   ```bash
   npm run tauri:dev
   ```

4. **Run Web UI Standalone:**
   ```bash
   npm run dev
   ```

---

## 🛡 System Constraints & Resilience

- **100% Offline-First**: All model shards and context remain strictly within local RAM/VRAM.
- **Fault-Tolerant Re-sharding**: Dynamic re-partitioning if a peer closes their laptop lid or disconnects.
- **Subnet Security**: Zero WAN exposure; operations occur strictly over authorized local subnets.

---

## 📜 License
MIT © 2026 Arnav Yadav
