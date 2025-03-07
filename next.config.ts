import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        hostname: "**",
        
      },
    ]
  /* config options here */
}
};
export default nextConfig;
