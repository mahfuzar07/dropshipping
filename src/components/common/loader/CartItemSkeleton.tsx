export const CartItemSkeleton = () => {
	return (
		<div className="flex gap-3 p-3 animate-pulse">
			<div className="w-12 h-12 bg-gray-200 rounded" />

			<div className="flex-1 space-y-2">
				<div className="h-3 w-2/3 bg-gray-200 rounded" />
				<div className="h-2 w-1/3 bg-gray-200 rounded" />

				<div className="flex justify-between mt-3">
					<div className="h-8 w-24 bg-gray-200 rounded" />
					<div className="h-4 w-12 bg-gray-200 rounded" />
				</div>
			</div>
		</div>
	);
};
