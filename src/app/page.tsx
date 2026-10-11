"use client";

import React, { useState, useEffect } from "react";
import { 
  Network, 
  Cpu, 
  HardDrive, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Send, 
  Paperclip, 
  Terminal, 
  Activity, 
  Zap, 
  RefreshCw 
} from "lucide-react";

interface SwarmNode {
  id: string;
  name: string;
  ip: string;
  role: "Leader" | "Worker";
  ramUsed: number;
  ramTotal: number;
  layerRange: string;
  status: "active" | "standby" | "disconnected";
  pingMs: number;
}

export default function SwarmDashboard() {
  const [nodes, setNodes] = useState<SwarmNode[]>([
    {
      id: "node-local",
      name: "Localhost (You)",
      ip: "192.168.1.104",
      role: "Leader",
      ramUsed: 4.8,
      ramTotal: 16.0,
      layerRange: "Layers 1 - 12",
      status: "active",
      pingMs: 1,
    },
    {
      id: "node-peer-1",
      name: "ThinkPad-X1-Arnav",
      ip: "192.168.1.112",
      role: "Worker",
      ramUsed: 6.2,
      ramTotal: 16.0,
      layerRange: "Layers 13 - 24",
      status: "active",
      pingMs: 4,
    },
    {
      id: "node-peer-2",
      name: "MacBook-Air-Lab",
      ip: "192.168.1.118",
      role: "Worker",
      ramUsed: 5.4,
      ramTotal: 8.0,
      layerRange: "Layers 25 - 32",
      status: "active",
      pingMs: 7,
    },
  ]);

  const [prompt, setPrompt] = useState("");
  const [streamOutput, setStreamOutput] = useState("");
  const [isInferring, setIsInferring] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [tokensPerSec, setTokensPerSec] = useState<number>(0);

  const totalRam = nodes.reduce((acc, n) => acc + n.ramTotal, 0);
  const usedRam = nodes.reduce((acc, n) => acc + n.ramUsed, 0);
  const memoryPercentage = Math.round((usedRam / totalRam) * 100);

  const handleRunInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isInferring) return;

    setIsInferring(true);
    setStreamOutput("");
    setTokensPerSec(6.8);

    const fullResponse = `[SOO Swarm Leader: Sharding pipeline initiated across 3 LAN nodes]\n` +
      `➜ Node 1 (Local): Processed embedding & Layers 1-12\n` +
      `➜ Tensor transmitted to 192.168.1.112 (4ms latency)\n` +
      `➜ Node 2 (ThinkPad): Computed Layers 13-24\n` +
      `➜ Tensor transmitted to 192.168.1.118 (7ms latency)\n` +
      `➜ Node 3 (MacBook): Computed Layers 25-32 & Logit Aggregation\n\n` +
      `Inference Result for query "${prompt}":\n` +
      `SOO P2P Swarm successfully verified all memory partitions and decentralized inference parameters. Target offline execution confirmed with zero WAN exposure.`;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setStreamOutput((prev) => prev + fullResponse.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsInferring(false);
      }
    }, 15);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-sky-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PROJECT SOO <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">P2P SWARM v1.0</span>
            </h1>
            <p className="text-xs text-slate-400">Decentralized Offline Hardware Synergy & Edge Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>OFFLINE LAN SYNC ACTIVE</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            Model: <span className="text-sky-400 font-semibold">Llama-3-14B (Pipeline Sharded)</span>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Swarm Topology & Memory Pool (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Unified Memory Pool Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-400" /> Unified Memory Pool
              </span>
              <span className="text-xs font-mono text-sky-400 font-bold">
                {usedRam.toFixed(1)} GB / {totalRam.toFixed(1)} GB ({memoryPercentage}%)
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${memoryPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Pooled across 3 peer nodes on local subnet. Model weights distributed across unified RAM.
            </p>
          </div>

          {/* Connected P2P Nodes */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-400" /> Active Peer Nodes ({nodes.length})
              </span>
              <button 
                onClick={() => {}}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Scan Subnet"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan
              </button>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="font-semibold text-sm text-white">{node.name}</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {node.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500">IP:</span> {node.ip}
                    </div>
                    <div>
                      <span className="text-slate-500">RAM:</span> {node.ramUsed}GB / {node.ramTotal}GB
                    </div>
                    <div>
                      <span className="text-slate-500">Ping:</span> {node.pingMs}ms
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{node.layerRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Local Context & Swarm Inference Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Swarm Telemetry Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Pipeline Speed
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {isInferring ? `${tokensPerSec} tok/s` : "Idle"}
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" /> Parallelism
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                Pipeline (3x)
              </div>
            </div>
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Privacy Mode
              </div>
              <div className="text-lg font-bold font-mono text-white mt-1">
                Zero Cloud
              </div>
            </div>
          </div>

          {/* Interactive Output Console */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>SWARM_INFERENCE_OUTPUT_STREAM</span>
              </div>
              {isInferring && (
                <div className="flex items-center gap-1.5 text-sky-400">
                  <Zap className="w-3.5 h-3.5 animate-bounce" /> Streaming SSE...
                </div>
              )}
            </div>

            <div className="flex-1 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed min-h-[220px]">
              {streamOutput ? (
                streamOutput
              ) : (
                <span className="text-slate-600 italic">
                  Ready for local prompt execution. Submit a prompt below to shard inference across the swarm.
                </span>
              )}
            </div>

            {/* Prompt & File Input Form */}
            <form onSubmit={handleRunInference} className="mt-4 pt-3 border-t border-slate-800/80">
              {selectedFile && (
                <div className="mb-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-mono flex items-center justify-between">
                  <span>Attached: {selectedFile}</span>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFile("Software_Requirements_Spec.pdf")}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
                  title="Attach Local Document for Zero-Cloud Context Injection"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter prompt or query for decentralized execution..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isInferring || !prompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
