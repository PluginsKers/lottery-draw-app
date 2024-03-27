/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  env: {
    CORP_ID: process.env.CORP_ID,
    BASE_PATH: process.env.BASE_PATH,
  },
};

export default nextConfig;
