import Link from 'next/link';
import { Star, Sparkles, Heart, UndoDot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPageContent() {
	return (
		<main className="min-h-screen bg-gradient-to-b from-twinkle-blue-light to-twinkle-yellow-light">
			{/* Navigation */}
			<nav className="p-6 md:p-8">
				<Link href="/" className="inline-flex items-center gap-2 text-twinkle-dark hover:text-twinkle-accent transition-colors">
					<UndoDot />
					<span className="font-semibold">Back</span>
				</Link>
			</nav>

			{/* Hero section */}
			<section className="px-4 md:px-8 py-12 md:py-20">
				<div className="max-w-3xl mx-auto text-center mb-16">
					<h1 className="text-4xl md:text-5xl font-bold text-twinkle-dark mb-6 leading-tight text-balance">Growing Joyful Moments for Kids</h1>
					<p className="text-lg text-twinkle-dark-muted leading-relaxed">
						TwinkleBud is a kids-focused brand dedicated to crafting safe, delightful, and imagination-inspiring products for little dreamers.
					</p>
				</div>

				{/* Hero image placeholder */}
				<div className="max-w-2xl mx-auto mb-16">
					<div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 flex items-center justify-center min-h-80">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-twinkle-purple rounded-full mb-4">
								<Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
							</div>
							<p className="text-twinkle-dark-muted text-sm">Magical illustrations come here</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features section */}
			<section className="px-4 md:px-8 py-12 md:py-20 bg-white bg-opacity-50">
				<div className="max-w-4xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{/* Safe & Quality-Driven */}
						<div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-twinkle-purple rounded-full mb-6">
								<Star className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-twinkle-dark mb-3">Safe & Quality-Driven</h3>
							<p className="text-twinkle-dark-muted leading-relaxed">
								Every product is designed with safety as our top priority, ensuring peace of mind for parents and joy for children.
							</p>
						</div>

						{/* Designed with Love */}
						<div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-twinkle-pink rounded-full mb-6">
								<Heart className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-twinkle-dark mb-3">Designed with Love</h3>
							<p className="text-twinkle-dark-muted leading-relaxed">
								Each product is thoughtfully created by a team passionate about bringing smiles to children's faces worldwide.
							</p>
						</div>

						{/* Inspired by Childhood Wonder */}
						<div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-twinkle-blue rounded-full mb-6">
								<Sparkles className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-twinkle-dark mb-3">Inspired by Childhood Wonder</h3>
							<p className="text-twinkle-dark-muted leading-relaxed">
								We celebrate imagination and creativity, designing products that spark joy and inspire endless adventures.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA section */}
			<section className="px-4 md:px-8 py-12 md:py-20 text-center bg-gradient-to-b from-twinkle-blue-light to-twinkle-yellow-light">
				<div className="max-w-2xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-twinkle-dark mb-6">Ready to Join the Magic?</h2>
					<p className="text-lg text-twinkle-dark-muted mb-8 leading-relaxed">
						Stay tuned for exciting announcements and exclusive early access to our first collection.
					</p>
					<Button className="bg-twinkle-accent hover:bg-twinkle-accent-dark text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
						Notify Me
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-twinkle-accent border-opacity-20 px-4 md:px-8 py-8 text-center text-twinkle-dark-muted">
				<p>© 2025 TwinkleBud. Little Wonders, Big Smiles.</p>
			</footer>
		</main>
	);
}
