import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Intelligence OS — Agentic Strategy Workspace",
  description: "Observable, directed acyclic graph (DAG) workspace for automated multi-agent creative strategy and video hook generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-studio-bg text-slate-100 flex flex-col h-screen w-screen overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
