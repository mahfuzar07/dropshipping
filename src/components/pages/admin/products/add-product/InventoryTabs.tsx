'use client';

import React from 'react';

import { useState } from 'react';
import { cn } from '@/lib/utils/utils';
import { LucideIcon } from 'lucide-react';

interface TabItem {
	id: string;
	label: string;
	icon: LucideIcon;
	content: React.ReactNode;
}

interface InventoryTabsProps {
	tabs: TabItem[];
}

export default function InventoryTabs({ tabs }: InventoryTabsProps) {
	const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

	const activeTabContent = tabs.find((tab) => tab.id === activeTab);

	return (
		<div className="w-full">
			{/* Mobile Tabs - Horizontal icons only */}
			<div className="md:hidden flex md:gap-2 overflow-x-auto  border-b">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							type="button"
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								'flex-shrink-0 cursor-pointer p-3 md:rounded-lg transition-colors flex-1 flex items-center justify-center',
								activeTab === tab.id ? 'bg-dashboard-primary text-white' : 'bg-gray-100 text-dashboard-muted hover:bg-gray-200',
							)}
							title={tab.label}
						>
							<Icon className="w-4 h-6" />
						</button>
					);
				})}
			</div>

			{/* Desktop Tabs - Sidebar style with icon + text */}
			<div className="hidden md:flex gap-0">
				<div className="w-64 border-r bg-gray-50 ">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								type="button"
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									'w-full flex cursor-pointer items-center gap-3 px-4 py-4 text-left transition-all border-l-4 font-medium border-b text-sm last:border-none',
									activeTab === tab.id
										? 'border-l-dashboard-primary bg-dashboard-primary/10 text-dashboard-primary'
										: 'border-l-transparent bg-gray-50 text-dashboard-muted hover:bg-slate-100',
								)}
							>
								<Icon className="w-5 h-5 flex-shrink-0" />
								<span>{tab.label}</span>
							</button>
						);
					})}
				</div>

				{/* Content Area */}
				<div className="flex-1 p-5">{activeTabContent && activeTabContent.content}</div>
			</div>

			{/* Mobile Content Area */}
			<div className="md:hidden p-3">{activeTabContent && activeTabContent.content}</div>
		</div>
	);
}
