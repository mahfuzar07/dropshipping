import axios from 'axios';

import { apiEndpoint } from './constants/apiEndpoint';
import { BACKEND_URL } from '@/config/config';

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else resolve(null);
	});
	failedQueue = [];
};

//client Api instance
export const nextApi = axios.create({
	baseURL: process.env.BACKEND_URL || 'http://localhost:8000',
});

// Public API
export const api = axios.create({
	baseURL: BACKEND_URL,
	withCredentials: true,
});

// Auth API with interceptor
export const authApi = axios.create({
	baseURL: BACKEND_URL,
	withCredentials: true,
});

authApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => authApi(originalRequest))
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			return new Promise(async (resolve, reject) => {
				try {
					// Refresh access token
					await api.post(apiEndpoint.auth.refreshToken);
					const { useAuthStore } = await import('@/z-store/global/useAuthStore');
					await useAuthStore.getState().checkAuth();

					processQueue(null, null);
					resolve(authApi(originalRequest));
				} catch (err) {
					processQueue(err, null);
					reject(err);
				} finally {
					isRefreshing = false;
				}
			});
		}

		return Promise.reject(error);
	},
);
