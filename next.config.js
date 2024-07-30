/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["images.unsplash.com", "tailwindui.com", "images.remotePatterns"],
    },
};

module.exports = nextConfig;