'use client';
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSettingsStore } from '@/z-store/global/useAppSettingsStore';

export default function Header() {
	const { theme, setTheme, language, setLanguage } = useAppSettingsStore();

	return (
		<header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<Button className="cursor-pointer py-1" variant="outline" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
							{theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
							{theme === 'light' ? 'Dark' : 'Light'}
						</Button>
					</div>
					<div className="">
						<select
							value={language}
							onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
							className="px-2  border py-1 rounded-md cursor-pointer"
						>
							<option value="en" className="text-muted-foreground leading-relaxed">
								English
							</option>
							<option value="bn" className="text-muted-foreground leading-relaxed">
								বাংলা
							</option>
						</select>
					</div>
				</div>
			</div>
		</header>
	);
}
