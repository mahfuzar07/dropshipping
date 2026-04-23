import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

/* ================= TYPES ================= */

interface FieldErrorProps {
	msg?: string;
}

interface FormFieldProps {
	label: string;
	htmlFor?: string;
	error?: string;
	children: ReactNode;
}

/* ================= COMPONENTS ================= */

function FieldError({ msg }: FieldErrorProps) {
	if (!msg) return null;
	return <p className="text-[11px] text-red-500 mt-1">{msg}</p>;
}

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
	return (
		<div className="space-y-1.5">
			<Label htmlFor={htmlFor} className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
				{label}
			</Label>

			{children}

			<FieldError msg={error} />
		</div>
	);
}
