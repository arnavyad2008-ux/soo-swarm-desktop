"""
Project SOO - P2P Swarm Engine
Decentralized Auto-Discovery & Pipeline Parallelism Manager
"""

import socket
import json
import time
from typing import List, Dict, Any

class SwarmNode:
    def __init__(self, node_id: str, name: str, ip: str, role: str, ram_total_gb: float, ram_free_gb: float):
        self.node_id = node_id
        self.name = name
        self.ip = ip
        self.role = role
        self.ram_total_gb = ram_total_gb
        self.ram_free_gb = ram_free_gb
        self.layers_assigned = []
        self.last_heartbeat = time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.node_id,
            "name": self.name,
            "ip": self.ip,
            "role": self.role,
            "ramTotal": self.ram_total_gb,
            "ramUsed": round(self.ram_total_gb - self.ram_free_gb, 1),
            "layerRange": f"Layers {self.layers_assigned[0]} - {self.layers_assigned[-1]}" if self.layers_assigned else "Pending",
            "status": "active" if time.time() - self.last_heartbeat < 15 else "disconnected",
            "pingMs": 3
        }

class ExoSwarmOrchestrator:
    def __init__(self, local_port: int = 52415):
        self.local_port = local_port
        self.nodes: Dict[str, SwarmNode] = {}
        self._init_local_node()

    def _init_local_node(self):
        hostname = socket.gethostname()
        local_ip = "127.0.0.1"
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
        except Exception:
            pass

        leader_node = SwarmNode(
            node_id="local-leader",
            name=f"Localhost ({hostname})",
            ip=local_ip,
            role="Leader",
            ram_total_gb=16.0,
            ram_free_gb=11.2
        )
        self.nodes[leader_node.node_id] = leader_node
        self.rebalance_pipeline(total_layers=32)

    def rebalance_pipeline(self, total_layers: int = 32):
        """
        Dynamically shard LLM layers proportionally based on available RAM.
        Pipeline Parallelism (Bucket-Brigade routing).
        """
        active_nodes = [n for n in self.nodes.values() if n.status == "active"]
        if not active_nodes:
            return

        total_free_ram = sum(n.ram_free_gb for n in active_nodes)
        current_layer = 1

        for i, node in enumerate(active_nodes):
            if i == len(active_nodes) - 1:
                assigned_count = total_layers - current_layer + 1
            else:
                share = node.ram_free_gb / max(total_free_ram, 1)
                assigned_count = max(1, int(round(share * total_layers)))

            node.layers_assigned = list(range(current_layer, current_layer + assigned_count))
            current_layer += assigned_count

    def get_topology(self) -> List[Dict[str, Any]]:
        return [node.to_dict() for node in self.nodes.values()]
