import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8001',
				pathname: '/assets/images/**',
			},
			// {
			// 	protocol: 'https',
			// 	hostname: 'via.placeholder.com',
			// 	pathname: '/**',
			// },
			{
				protocol: 'https',
				hostname: '*',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: '*',
				pathname: '/**',
			},
		],
		minimumCacheTTL: 60,
		formats: ['image/avif', 'image/webp'],
		dangerouslyAllowLocalIP: true,
	},
	// output: 'standalone',
};

export default nextConfig;
