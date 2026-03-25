'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSettingsStore } from '@/z-store/global/useAppSettingsStore';
import { Moon, Sun, Palette } from 'lucide-react';

export default function Home() {
	const { theme, setTheme } = useAppSettingsStore();

	return (
		<main className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-4xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">Tailwind CSS v4 + Next.js</h1>
					<p className="mt-2 text-muted-foreground">Testing the new CSS-first configuration approach</p>
				</div>

				{/* Theme Toggle */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							Theme Controls
						</CardTitle>
						<CardDescription>Switch between light, dark, and system themes</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-2">
						<Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('light')}>
							<Sun className="h-4 w-4" />
							Light
						</Button>
						<Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('dark')}>
							<Moon className="h-4 w-4" />
							Dark
						</Button>
						<Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('system')}>
							System
						</Button>
					</CardContent>
				</Card>

				{/* Button Variants */}
				<Card>
					<CardHeader>
						<CardTitle>Button Components</CardTitle>
						<CardDescription>shadcn/ui buttons working with Tailwind v4</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="link">Link</Button>
						<Button variant="destructive">Destructive</Button>
					</CardContent>
				</Card>

				{/* New Tailwind v4 Features */}
				<Card>
					<CardHeader>
						<CardTitle>Tailwind v4 Features</CardTitle>
						<CardDescription>New utilities and improvements in v4</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="font-medium mb-2">Text Balance</h4>
							<p className="text-balance text-muted-foreground">
								This text uses the new text-balance utility for better typography and more balanced line breaks in headings and short paragraphs.
							</p>
						</div>
						<div>
							<h4 className="font-medium mb-2">CSS Custom Properties</h4>
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div>
									Background: <code className="bg-muted px-1 rounded">hsl(var(--color-background))</code>
								</div>
								<div>
									Foreground: <code className="bg-muted px-1 rounded">hsl(var(--color-foreground))</code>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
