/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint on these directories
    dirs: ['app', 'components', 'lib', 'utils'],
    // Don't stop the build on ESLint errors
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 