// import dotenv from 'dotenv';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // env: process.env
    output: "standalone",
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                poll: 1000, // 每秒检查一次变更
                aggregateTimeout: 300, // 延迟300ms再重新构建
            };
        }
        return config;
    },
};
// dotenv.config();
// console.log(process.env)
export default nextConfig;
