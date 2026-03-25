'use client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConfirmModalProps {
	open: boolean;
	title?: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	isMutating?: boolean;
}

export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel, isMutating }: ConfirmModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={onCancel}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
				</AlertDialogHeader>

				<p className="py-2 font-hanken text-dashboard-muted-foreground">
					Are you sure you want to delete <strong className="text-dashboard-foreground">" {message} " ?</strong>
				</p>

				<AlertDialogFooter className="flex justify-end gap-2 pt-3">
					<AlertDialogCancel asChild>
						<Button variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					</AlertDialogCancel>

					<AlertDialogAction asChild>
						<button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors" onClick={onConfirm}>
							{isMutating ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Delete'}
						</button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
