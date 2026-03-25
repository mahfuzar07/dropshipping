import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'placehold.co',
				pathname: '/**',
			},
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
	},
};

export default nextConfig;
