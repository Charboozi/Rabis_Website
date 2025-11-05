import createNextIntlPlugin from "next-intl/plugin";

// Point to your config file
const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

const nextConfig = {
  reactStrictMode: true,
  // you can add any other settings here, like:
  // experimental: { serverActions: true }
};

export default withNextIntl(nextConfig);
