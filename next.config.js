/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "cbor2",
      "@lit-protocol/vincent-contracts-sdk",
      "@lit-protocol/vincent-ability-sdk",
      "@lit-protocol/vincent-app-sdk",
      "@lit-protocol/vincent-ability-erc20-approval",
    ],
    esmExternals: "loose",
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      buffer: false,
    };

    config.module.rules.push({
      test: /\.test\.(ts|js)x?$/,
      loader: 'ignore-loader',
    });

    // Handle ESM packages that should be external
    if (isServer) {
      config.externals = [...(config.externals || [])];

      // Add function to handle cbor2 and other problematic ESM packages
      config.externals.push(({ request, context }, callback) => {
        // Handle cbor2 specifically
        if (request === "cbor2" || request.includes("cbor2")) {
          return callback(null, `require("${request}")`);
        }

        // Handle other ESM packages from Lit Protocol
        if (
          request &&
          request.includes("@lit-protocol/vincent-contracts-sdk")
        ) {
          return callback();
        }

        callback();
      });
    }

    return config;
  },
};

module.exports = nextConfig;
