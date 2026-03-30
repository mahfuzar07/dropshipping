import { Bell } from 'lucide-react';
import React from 'react'

export default function NotificationContent() {
  return (
		<div className="w-80">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b">
				<p className="font-semibold text-sm">Notifications</p>
				<button className="text-xs text-blue-500 hover:underline">Mark all as read</button>
			</div>

			{/* Notification List */}
			<div className="max-h-80 overflow-y-auto">
				{/* Item 1 (unread) */}
				<div className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer bg-orange-50">
					<Bell size={22} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground mt-1" />
					<div className="flex-1">
						<p className="text-sm">
							<span className="font-medium">John Doe</span> placed a new order
						</p>
						<p className="text-xs text-muted-foreground mt-1">2 min ago</p>
					</div>
				</div>

				{/* Item 2 */}
				<div className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
					<Bell size={22} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground mt-1" />
					<div className="flex-1">
						<p className="text-sm">
							Your product <span className="font-medium">iPhone 15</span> was shipped
						</p>
						<p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
					</div>
				</div>

				{/* Item 3 */}
				<div className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
					<Bell size={22} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground mt-1" />
					<div className="flex-1">
						<p className="text-sm">
							New message from <span className="font-medium">Support Team</span>
						</p>
						<p className="text-xs text-muted-foreground mt-1">Yesterday</p>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="text-center py-2 border-t">
				<button className="text-sm text-blue-500 hover:underline">View all notifications</button>
			</div>
		</div>
	);
}
