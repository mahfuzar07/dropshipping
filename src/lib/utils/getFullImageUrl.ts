// utils/getFullImageUrl.ts
export default function getFullImageUrl(path?: string) {
	if (!path) return '';

	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

	return `${baseUrl.replace(/\/$/, '')}/public/${path.replace(/^\/+/, '')}`;
}
