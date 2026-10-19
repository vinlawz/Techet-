import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray lockfile in C:\Users\vinla made Next scan the wrong root; pin it to this project.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
