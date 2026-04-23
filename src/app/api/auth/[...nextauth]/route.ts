import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

/* ================= TYPES ================= */

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
	}

	interface User {
		access?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		user?: any;
	}
}

/* ================= CONFIG ================= */

export const authOptions: NextAuthOptions = {
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
					const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login/`, {
						login_identifier: credentials.email,
						password: credentials.password,
					});

					const data = response.data;

					if (data?.access) {
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
				token.accessToken = (user as any).access;
				token.user = user;
			}
			return token;
		},

		async session({ session, token }) {
			session.accessToken = token.accessToken;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
