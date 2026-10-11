import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project SOO | P2P Edge AI Swarm",
  description: "Decentralized offline LLM pipeline sharding across local laptops.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#090d16] text-gray-100">
        {children}
      </body>
    </html>
  );
}
