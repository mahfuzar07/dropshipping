'use client';

import { CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { useId, useEffect, useState } from 'react';

interface DragUploadInputProps {
	value?: string;
	accept?: string;
	onChange: (file: File | null, preview: string) => void;
	onRemove?: () => void;
}

export function DragUploadInput({ value, accept = 'image/png, image/jpeg', onChange, onRemove }: DragUploadInputProps) {
	const inputId = useId();
	const [preview, setPreview] = useState<string>(value || '');

	// Sync prop value changes (backend URL or reset)
	useEffect(() => {
		if (value) setPreview(value);
		else setPreview('');
	}, [value]);

	const handleFile = (file?: File) => {
		if (!file) return;
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
		onChange(file, objectUrl);
	};

	const handleRemove = () => {
		setPreview('');
		onChange(null, '');
		onRemove?.();
	};

	return (
		<div className="space-y-3">
			{/* ===== NO IMAGE ===== */}
			{!preview && (
				<label
					htmlFor={inputId}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						handleFile(e.dataTransfer.files?.[0]);
					}}
					className="
            border-2 border-dashed h-32 rounded-lg p-3
            flex items-center gap-5 cursor-pointer
            hover:border-dashboard-primary/30 transition
          "
				>
					<div className="w-12 md:w-14 2xl:w-16 aspect-square flex items-center justify-center">
						<CloudUpload className="text-dashboard-primary" size={35} />
					</div>

					<div className="text-center">
						<p className="md:text-base text-sm">
							Drop image here or <span className="text-dashboard-primary underline">browse</span>
						</p>
						<p className="text-[10px] text-muted-foreground">PNG or JPG only allowed</p>

						<input id={inputId} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
					</div>
				</label>
			)}

			{/* ===== WITH IMAGE ===== */}
			{preview && (
				<div className="flex h-32 gap-5 items-center border-dashed p-3 rounded-lg border-2 hover:border-dashboard-primary/30 ">
					<div className="w-28 h-24  relative rounded-lg overflow-hidden bg-background flex items-center justify-center">
						<Image fill src={preview} alt="preview" className="object-contain w-full h-full" unoptimized />
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor={inputId}
							className="
                text-xs px-3 py-2 border border-dashed
                rounded-md cursor-pointer hover:border-primary
              "
						>
							Change Image
							<input id={inputId} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
						</label>

						<button type="button" onClick={handleRemove} className="text-xs text-destructive cursor-pointer hover:underline w-max pl-2.5">
							Remove Image
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
