/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/app/lottery',
    env: {
      CORP_ID: process.env.CORP_ID
    },
};

export default nextConfig;
