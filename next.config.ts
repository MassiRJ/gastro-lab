import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Esto permite que el build continúe aunque haya advertencias de estilo
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
