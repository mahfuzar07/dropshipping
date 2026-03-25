import { Metadata } from "next";

// app/not-found.tsx
export const metadata: Metadata = {
	title: '404 - Not Found',
};

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold">404</h1>
				<p>Page not found</p>
			</div>
		</div>
	);
}
