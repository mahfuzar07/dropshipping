import React from 'react';

export default function BannerSection() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-5 px-4 mb-10">
			<div className="grid md:grid-cols-7 grid-cols-1 md:gap-5 gap-y-2">
				{/* Left Banner */}
				<div className="col-span-4 relative h-[240px] rounded-md overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{
							backgroundImage: "url('/assets/background/bg-animal.png')",
						}}
					>
						<div className="h-full w-full flex items-center justify-center text-center">
							<div className="max-w-xs mx-auto drop-shadow-lg">
								<h1 className="text-2xl md:text-3xl font-bold text-orange-600">Cute Animal Toys</h1>
								<p className="text-md mt-2">Adorable stuffed animals & handmade wooden toys</p>
								<button className="mt-4 px-6 py-2 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white font-semibold rounded-lg">SHOP NOW</button>
							</div>
						</div>
					</div>
				</div>

				{/* Right Banner */}
				<div className="col-span-3 relative h-[240px] rounded-md overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{
							backgroundImage: "url('/assets/background/bg-kid.png')",
						}}
					>
						<div className="h-full w-full flex items-center justify-center text-center relative">
							<div className="max-w-md absolute md:right-20 right-2 drop-shadow-lg">
								<h1 className="text-2xl md:text-3xl font-bold text-orange-600">Kids Games</h1>
								<p className="text-md mt-2">Spark Imagination & Creativity</p>
								<button className="mt-4 px-6 py-2 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white font-semibold rounded-lg">
									PLAY GAMES
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
