"""
Project SOO - Local Context Pipeline
Secure on-disk document parsing and zero-cloud context window injection.
"""

import os
from typing import List, Dict

class LocalContextPipeline:
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def parse_and_chunk_file(self, file_path: str, chunk_size: int = 500) -> List[Dict[str, str]]:
        """
        Extract text from local files (TXT, MD, PDF) and divide into semantic chunks.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Context document {file_path} not found.")

        ext = os.path.splitext(file_path)[1].lower()
        raw_text = ""

        if ext in [".txt", ".md", ".py", ".rs", ".json"]:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                raw_text = f.read()
        elif ext == ".pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                raw_text = "\n".join([page.extract_text() or "" for page in reader.pages])
            except ImportError:
                raw_text = f"[PDF Parsing Notice: pypdf not installed, file received: {os.path.basename(file_path)}]"
        else:
            raw_text = f"[Binary/Unsupported format: {os.path.basename(file_path)}]"

        words = raw_text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunk_content = " ".join(words[i : i + chunk_size])
            chunks.append({
                "chunk_id": len(chunks) + 1,
                "token_estimate": len(words[i : i + chunk_size]),
                "content": chunk_content
            })

        return chunks
