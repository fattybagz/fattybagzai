import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Empty turbopack config to suppress warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Handle WASM files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Handle WASM file imports
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Exclude sync-ammo from server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('sync-ammo');
    }

    return config;
  },
};

export default nextConfig;
