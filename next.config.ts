import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typedRoutes: false,
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};
export default nextConfig;
