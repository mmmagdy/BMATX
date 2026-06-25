/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal, self-contained server bundle for the Docker runtime image.
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
