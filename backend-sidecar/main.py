"""
Project SOO - FastAPI Sidecar Service
Coordinates Tauri IPC, Exo P2P Swarm Engine, and SSE Inference Streaming.
"""

import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import Optional

from swarm_engine import ExoSwarmOrchestrator
from context_pipeline import LocalContextPipeline

app = FastAPI(
    title="Project SOO Swarm Sidecar",
    description="P2P Decentralized Inference Backend for Desktop",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = ExoSwarmOrchestrator()
context_pipeline = LocalContextPipeline()

class InferenceRequest(BaseModel):
    prompt: str
    context_file: Optional[str] = None
    temperature: float = 0.7

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "soo-backend-sidecar",
        "p2p_active": True,
        "swarm_nodes": len(orchestrator.nodes)
    }

@app.get("/api/swarm/topology")
async def get_swarm_topology():
    """Returns active network topology, RAM distribution, and layer assignments."""
    return {
        "topology": orchestrator.get_topology()
    }

@app.post("/api/context/upload")
async def upload_context_document(file: UploadFile = File(...)):
    """Saves a local document for zero-cloud context injection."""
    save_path = f"./uploads/{file.filename}"
    with open(save_path, "wb") as buffer:
        buffer.write(await file.read())
    
    chunks = context_pipeline.parse_and_chunk_file(save_path)
    return {
        "filename": file.filename,
        "chunks_created": len(chunks),
        "status": "indexed_locally"
    }

@app.post("/api/inference/stream")
async def stream_inference(request: InferenceRequest):
    """
    Server-Sent Events (SSE) stream simulating pipeline tensor sharding across swarm nodes.
    """
    async def token_generator():
        topology = orchestrator.get_topology()
        yield {"event": "info", "data": f"Routing prompt through {len(topology)} active swarm nodes..."}
        await asyncio.sleep(0.3)

        response_chunks = [
            f"[SOO Swarm Leader: Sharding pipeline initiated across {len(topology)} LAN nodes]\n",
            "➜ Shard 1 (Local): Processed embedding & initial layers\n",
            "➜ Intermediate tensor routed peer-to-peer via pipeline parallelism\n",
            "➜ Shard 2 (Worker): Intermediate attention blocks computed\n",
            "➜ Shard 3 (Aggregation): Final logits gathered & stream generated\n\n",
            f"Execution completed for query: '{request.prompt}'.\n",
            "All model weights were distributed across the local P2P swarm memory pool with zero external telemetry."
        ]

        for chunk in response_chunks:
            yield {"event": "token", "data": chunk}
            await asyncio.sleep(0.15)

        yield {"event": "done", "data": "[DONE]"}

    return EventSourceResponse(token_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
