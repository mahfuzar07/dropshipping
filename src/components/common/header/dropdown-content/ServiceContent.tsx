import React from 'react';
import { Truck, ShoppingCart, FileText, Camera, ArrowRight, Calculator } from 'lucide-react';

export default function ServiceContent() {
	return (
		<div className="w-[700px] bg-white rounded-2xl shadow-2xl p-6">
			{/* Services Grid */}
			<div className="grid grid-cols-2 gap-4">
				{/* Item */}
				<div className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
					<div className="w-11 h-11 bg-slate-100 text-orange-400 rounded flex items-center justify-center group-hover:scale-105 transition">
						<ShoppingCart size={20} />
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition">Buy & Ship For Me</h4>
						<p className="text-sm text-gray-500">Customized buying and shipping.</p>
					</div>
				</div>

				<div className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
					<div className="w-11 h-11 bg-slate-100 text-orange-400 rounded flex items-center justify-center">
						<Truck size={20} />
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Ship For Me</h4>
						<p className="text-sm text-gray-500">Hassle-free shipping solutions.</p>
					</div>
				</div>

				<div className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
					<div className="w-11 h-11 bg-slate-100 text-orange-400 rounded flex items-center justify-center">
						<FileText size={20} />
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">Request For Quotation</h4>
						<p className="text-sm text-gray-500">Precise quotation management.</p>
					</div>
				</div>

				<div className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
					<div className="w-11 h-11 bg-slate-100 text-orange-400 rounded flex items-center justify-center">
						<Camera size={20} />
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition">Image Lens</h4>
						<p className="text-sm text-gray-500">Intelligent image-based search.</p>
					</div>
				</div>

				<div className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
					<div className="w-11 h-11 bg-slate-100 text-orange-400 rounded flex items-center justify-center">
						<Calculator size={20} />
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition">Cost Calculator</h4>
						<p className="text-sm text-gray-500">Accurate financial planning tools.</p>
					</div>
				</div>
			</div>

			{/* Bottom Section */}
			<div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">Associate Services</h3>
					<p className="text-sm text-gray-500">Explore our associate services to level up your business</p>
				</div>

				<button className="flex items-center gap-1 text-sm font-medium text-green-600 hover:gap-2 transition">
					Explore <ArrowRight size={16} />
				</button>
			</div>
		</div>
	);
}
