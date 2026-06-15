'use client';

interface WeightScaleItem {
	sku1: string;
	weight: number;
	height: number;
	length: number;
	width: number;
	volume: number;
	skuId: number;
}

interface ColumnItem {
	name: string;
	label: string;
	precision: number;
	fid?: number;
}

interface PieceWeightScaleInfoTableProps {
	data: WeightScaleItem[];
	columns: ColumnItem[];
}

export default function PieceWeightScaleInfoTable({ data, columns }: PieceWeightScaleInfoTableProps) {
	if (!data?.length || !columns?.length) return null;

	const formatValue = (value: number | string, precision: number) => {
		if (typeof value === 'number') {
			return precision > 0 ? value.toFixed(precision) : value.toString();
		}
		return value;
	};

	return (
		<div className="w-full overflow-x-auto rounded-lg border border-gray-200">
			<table className="w-full text-sm">
				{/* Header */}
				<thead>
					<tr className="bg-gray-50 border-b border-gray-200">
						{columns.map((col) => (
							<th key={col.name} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
								{col.label}
							</th>
						))}
					</tr>
				</thead>

				{/* Body */}
				<tbody>
					{data.map((item, index) => (
						<tr
							key={item.skuId}
							className={`border-b border-gray-100 transition-colors hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
						>
							{columns.map((col) => {
								const rawValue = item[col.name as keyof WeightScaleItem];
								return (
									<td key={col.name} className="px-4 py-3 text-gray-700 whitespace-nowrap">
										{col.name === 'sku1' ? (
											// Color name cell with a visual indicator
											<div className="flex items-center gap-2">
												<span className="w-2.5 h-2.5 rounded-full bg-orange-300 shrink-0" />
												<span className="font-medium">{rawValue}</span>
											</div>
										) : (
											formatValue(rawValue as number, col.precision)
										)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
