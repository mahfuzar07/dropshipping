'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Code, Globe, Smartphone, Database, Zap } from 'lucide-react';

import Image from 'next/image';

export default function PortfolioContent() {
	const projects = [
		{
			title: 'E-commerce Dashboard',
			description: 'A modern admin dashboard for managing products, orders, and customers with real-time analytics.',
			image: '/placeholder.svg?height=200&width=400',
			technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
			liveUrl: 'http://localhost:3001',
			githubUrl: 'https://github.com/yourusername/ecommerce-dashboard',
			status: 'In Development',
		},
		{
			title: 'Task Management App',
			description: 'A collaborative task management application with real-time updates and team collaboration features.',
			image: '/placeholder.svg?height=200&width=400',
			technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
			liveUrl: 'http://localhost:3002',
			githubUrl: 'https://github.com/yourusername/task-manager',
			status: 'Completed',
		},
		{
			title: 'Weather App',
			description: 'A beautiful weather application with location-based forecasts and interactive maps.',
			image: '/placeholder.svg?height=200&width=400',
			technologies: ['Vue.js', 'Vite', 'OpenWeather API', 'Chart.js'],
			liveUrl: 'http://localhost:5173',
			githubUrl: 'https://github.com/yourusername/weather-app',
			status: 'Completed',
		},
		{
			title: 'Blog Platform',
			description: 'A full-stack blog platform with markdown support, comments, and user authentication.',
			image: '/placeholder.svg?height=200&width=400',
			technologies: ['Django', 'Python', 'PostgreSQL', 'Bootstrap', 'Redis'],
			liveUrl: 'http://localhost:8000',
			githubUrl: 'https://github.com/yourusername/blog-platform',
			status: 'In Development',
		},
	];

	const skills = [
		{ name: 'Frontend', icon: Code, items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'] },
		{ name: 'Backend', icon: Database, items: ['Node.js', 'Express', 'PostgreSQL'] },
		{ name: 'Mobile', icon: Smartphone, items: ['React Native', 'iOS', 'Android'] },
		{ name: 'Tools', icon: Zap, items: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma'] },
	];

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 py-8 space-y-12">
				{/* Hero Section */}
				<section className="text-center space-y-4">
					<h2 className="text-4xl font-bold text-foreground">Md. Mahfuzar Rahman</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Full-stack developer passionate about creating beautiful, functional web applications that solve real-world problems.
					</p>
					<div className="flex justify-center gap-4">
						<Button asChild>
							<a href="#projects">View Projects</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="#contact">Get in Touch</a>
						</Button>
					</div>
				</section>

				{/* Skills Section */}
				<section id="skills" className="space-y-6">
					<h3 className="text-3xl font-bold text-center text-foreground">Skills & Technologies</h3>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{skills.map((skill) => (
							<Card key={skill.name} className="bg-card border-border">
								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2 text-card-foreground">
										<skill.icon className="h-8 w-8" />
										{skill.name}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-1">
										{skill.items.map((item) => (
											<Badge key={item} variant="secondary" className="text-xs">
												{item}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Projects Section */}
				<section id="projects" className="space-y-6">
					<h3 className="text-3xl font-bold text-center text-foreground">Featured Projects</h3>
					<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
						{projects.map((project) => (
							<Card key={project.title} className="bg-card border-border overflow-hidden">
								<div className="aspect-video bg-muted relative">
									<Image src={project.image || '/placeholder.svg'} fill alt={project.title} className="w-full h-full object-cover" />
									<div className="absolute top-2 right-2">
										<Badge variant={project.status === 'Completed' ? 'default' : 'secondary'} className="text-xs">
											{project.status}
										</Badge>
									</div>
								</div>
								<CardHeader>
									<CardTitle className="text-card-foreground">{project.title}</CardTitle>
									<CardDescription className="text-muted-foreground">{project.description}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex flex-wrap gap-1">
										{project.technologies.map((tech) => (
											<Badge key={tech} variant="outline" className="text-xs">
												{tech}
											</Badge>
										))}
									</div>
									<div className="flex gap-2">
										<Button size="sm" asChild>
											<a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
												<Globe className="h-4 w-4 mr-2" />
												Live Demo
											</a>
										</Button>
										<Button variant="outline" size="sm" asChild>
											<a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
												<Github className="h-4 w-4 mr-2" />
												Code
											</a>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* Contact Section */}
				<section id="contact" className="text-center space-y-6">
					<h3 className="text-3xl font-bold text-foreground">{"Let's Work Together"}</h3>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						{"I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like to collaborate!"}
					</p>
					<div className="flex justify-center gap-4">
						<Button asChild>
							<a href="mailto:john@example.com">Send Email</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="https://linkedin.com/in/johndoe" target="_blank" rel="noopener noreferrer">
								LinkedIn
							</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer">
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</a>
						</Button>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-border bg-muted/50 mt-12">
				<div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
					<p>&copy; 2024 John Doe. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
