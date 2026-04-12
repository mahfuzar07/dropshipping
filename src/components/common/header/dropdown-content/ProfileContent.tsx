import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';
import React from 'react';
import { redirect } from 'next/navigation';

export default function ProfileContent({ isAuthenticated, user }: { isAuthenticated: boolean; user: { phone: string } | null }) {
	return (
		<div className="px-3 py-5">
			{isAuthenticated ? (
				<div className="flex items-center gap-3 p-2">
					<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
						<User className="h-5 w-5 text-primary" />
					</div>
					<div>
						<p className="text-sm font-semibold">Welcome back 👋</p>
						<p className="text-xs text-muted-foreground">{user?.phone}</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<Button
						onClick={() => {
							redirect('/sign-in');
						}}
					>
						Sign In
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							redirect('/sign-up');
						}}
					>
						Registration
					</Button>
				</div>
			)}

			<div className="my-3 border-t" />

			<div className="flex flex-col gap-1 text-sm">
				<div
					onClick={() => {
						redirect('/customer/profile');
					}}
					className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
				>
					<User className="h-4 w-4" /> My Profile
				</div>
				<div
					onClick={() => {
						redirect('/customer/settings');
					}}
					className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2"
				>
					<Settings className="h-4 w-4" /> Settings
				</div>
			</div>
		</div>
	);
}
