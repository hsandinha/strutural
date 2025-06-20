/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Mantemos o que já tínhamos
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // <-- ADICIONE ESTE NOVO BLOCO
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
