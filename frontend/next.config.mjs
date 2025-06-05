/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ["localhost"], // Разрешаем загрузку изображений с localhost
  },
};

export default nextConfig;
