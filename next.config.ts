/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora errores de estilo (variables no usadas, etc.)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora errores de tipos (ya que pasamos a JS)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;