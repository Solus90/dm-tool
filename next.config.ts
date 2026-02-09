import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add empty turbopack config to acknowledge we're using webpack (via next-pwa)
  // This silences the Turbopack/webpack warning in Next.js 16+
  turbopack: {},
};

// Only apply PWA wrapper in production to avoid Turbopack conflicts
// In development, PWA features are disabled anyway
let config = nextConfig;

if (process.env.NODE_ENV === "production") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const withPWA = require("next-pwa")({
      dest: "public",
      register: true,
      skipWaiting: true,
    });
    config = withPWA(nextConfig);
  } catch (error) {
    console.warn("PWA configuration skipped:", error);
  }
}

export default config;
