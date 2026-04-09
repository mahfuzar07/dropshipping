import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					// Uncomment below to use real API
					const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login/`, {
						login_identifier: credentials.email,
						password: credentials.password,
					});
					// console.log('Login response:', response?.data);
					const data = response.data;

					if (data && data.access) {
						return data;
					}

					return null;
				} catch (error) {
					console.error('Login error:', error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.access;
				// Store additional user info
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			// Store user info in session
			session.user = {
				...session.user,
				...token.user,
			};
			return session;
		},
	},
	pages: {
		signIn: '/auth/sign-in',
	},
});

export { handler as GET, handler as POST };
