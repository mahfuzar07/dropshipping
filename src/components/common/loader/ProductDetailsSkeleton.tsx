'use client';

export default function ProductDetailsSkeleton() {
	return (
		<div className="animate-pulse py-3">
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
				{/* LEFT */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:col-span-9">
					{/* Image */}
					<div className="col-span-12 md:col-span-5">
						<div className="h-[320px] rounded-xl bg-gray-200 md:h-[500px]" />

						<div className="mt-4 flex gap-3 overflow-hidden">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-16 w-16 rounded-lg bg-gray-200 md:h-20 md:w-20" />
							))}
						</div>
					</div>

					{/* Product Info */}
					<div className="col-span-12 md:col-span-7">
						<div className="mb-5 h-8 w-4/5 rounded bg-gray-200" />
						<div className="mb-6 h-5 w-24 rounded bg-gray-200" />

						<div className="mb-8 h-10 w-40 rounded bg-gray-200" />

						{/* Color Options */}
						<div className="mb-3 h-5 w-20 rounded bg-gray-200" />

						<div className="mb-6 flex flex-wrap gap-2">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="h-12 w-12 rounded-full bg-gray-200" />
							))}
						</div>

						{/* Table */}
						<div className="overflow-hidden rounded-xl border">
							<div className="grid grid-cols-4 gap-4 border-b p-4">
								<div className="h-4 rounded bg-gray-200" />
								<div className="h-4 rounded bg-gray-200" />
								<div className="h-4 rounded bg-gray-200" />
								<div className="h-4 rounded bg-gray-200" />
							</div>

							<div className="grid grid-cols-4 gap-4 p-4">
								<div className="h-6 rounded bg-gray-200" />
								<div className="h-6 rounded bg-gray-200" />
								<div className="h-6 rounded bg-gray-200" />
								<div className="h-6 rounded bg-gray-200" />
							</div>
						</div>
					</div>

					{/* Seller */}
					<div className="col-span-12 rounded-xl border p-5">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex flex-col items-center gap-4 md:flex-row">
								<div className="h-20 w-20 rounded-xl bg-gray-200" />

								<div className="space-y-4">
									<div className="h-6 w-40 rounded bg-gray-200" />

									<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="h-10 w-28 rounded-lg bg-gray-200" />
										))}
									</div>
								</div>
							</div>

							<div className="h-11 w-full rounded-full bg-gray-200 lg:w-40" />
						</div>

						{/* Tabs */}
						<div className="mt-8">
							<div className="mb-5 flex gap-4">
								<div className="h-8 w-24 rounded bg-gray-200" />
								<div className="h-8 w-24 rounded bg-gray-200" />
							</div>

							<div className="space-y-3">
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="h-4 w-full rounded bg-gray-200" />
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="hidden lg:block lg:col-span-3">
					<div className="rounded-xl border p-5">
						<div className="mb-5 h-6 w-40 rounded bg-gray-200" />

						<div className="mb-6 flex gap-3">
							<div className="h-24 flex-1 rounded-xl bg-gray-200" />
							<div className="h-24 flex-1 rounded-xl bg-gray-200" />
						</div>

						<div className="space-y-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="flex justify-between">
									<div className="h-4 w-24 rounded bg-gray-200" />
									<div className="h-4 w-12 rounded bg-gray-200" />
								</div>
							))}
						</div>

						<div className="my-6 h-28 rounded-xl bg-gray-200" />

						<div className="space-y-3">
							<div className="h-12 rounded-full bg-gray-200" />
							<div className="h-12 rounded-full bg-gray-200" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
