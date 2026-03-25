import React from 'react';

export default function TestPage() {
	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="py-20">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">Welcome to de bebe</h2>
					<p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">Premium quality baby products and clothing for your little ones</p>
					<button className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors">Shop Now</button>
				</div>
			</section>

			{/* Content Section - For Scroll Testing */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-3xl">
					<h3 className="text-2xl font-bold text-slate-900 mb-6">Scroll to Test Header</h3>
					<p className="text-slate-600 leading-relaxed mb-4">
						Scroll down to see the header hide, and scroll back up to see it reappear with a smooth animation. The header will stick to the top of the
						page and animate in when you scroll up.
					</p>

					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="mb-8">
							<h4 className="text-xl font-semibold text-slate-800 mb-3">Section {i}</h4>
							<p className="text-slate-600 leading-relaxed">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
								minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
								reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
								culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua.
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-20 bg-slate-50">
				<div className="container mx-auto px-4">
					<h3 className="text-2xl font-bold text-slate-900 mb-12 text-center">Featured Products</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[1, 2, 3].map((i) => (
							<div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
								<div className="bg-gradient-to-br from-slate-200 to-slate-300 h-48 flex items-center justify-center">
									<span className="text-slate-500 text-lg">Product Image {i}</span>
								</div>
								<div className="p-6">
									<h4 className="text-lg font-semibold text-slate-900 mb-2">Product {i}</h4>
									<p className="text-sm text-slate-600 mb-4">High-quality baby product with premium materials</p>
									<div className="flex items-center justify-between">
										<span className="text-lg font-bold text-slate-900">$49.99</span>
										<button className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm">Add to Cart</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* More content for scrolling */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-3xl">
					<h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose de bebe?</h3>
					{['Quality Assurance', 'Eco-Friendly Materials', 'Fast Shipping', 'Customer Support'].map((reason, idx) => (
						<div key={idx} className="mb-6 pb-6 border-b border-slate-200 last:border-0">
							<h4 className="text-lg font-semibold text-slate-800 mb-2">{reason}</h4>
							<p className="text-slate-600">
								We ensure every product meets our high standards for quality, safety, and sustainability. Our commitment to excellence means you can
								trust de bebe for your baby's needs.
							</p>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
