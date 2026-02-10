/** @type {import('next').NextConfig} */
const nextConfig = {
    serverComponentsExternalPackages: ['sequelize', 'sequelize-typescript', 'sqlite3', 'mongoose'],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
