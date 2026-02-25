import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["bullmq", "ioredis", "pdf-parse"],
};

export default nextConfig;
