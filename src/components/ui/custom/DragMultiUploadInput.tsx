'use client';

import { Trash2, Plus, CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { useId, useEffect, useState } from 'react';

interface DragMultiUploadInputProps {
	values?: string[]; // backend or initial urls
	accept?: string;
	onChange: (files: File[], previews: string[]) => void;
}

export function DragMultiUploadInput({ values = [], accept = 'image/png, image/jpeg', onChange }: DragMultiUploadInputProps) {
	const inputId = useId();
	const [previews, setPreviews] = useState<string[]>([]);
	const [files, setFiles] = useState<File[]>([]);

	// sync backend urls
	useEffect(() => {
		if (values?.length) {
			setPreviews(values);
		}
	}, [values]);

	const handleFiles = (fileList?: FileList | null) => {
		if (!fileList) return;

		const newFiles = Array.from(fileList);
		const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

		const allFiles = [...files, ...newFiles];
		const allPreviews = [...previews, ...newPreviews];

		setFiles(allFiles);
		setPreviews(allPreviews);
		onChange(allFiles, allPreviews);
	};

	const removeImage = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		const newPreviews = previews.filter((_, i) => i !== index);

		setFiles(newFiles);
		setPreviews(newPreviews);
		onChange(newFiles, newPreviews);
	};

	return (
		<div className="space-y-3">
			<div className="grid md:grid-cols-3 grid-cols-2 gap-3">
				{/* ===== IMAGES GRID ===== */}
				{previews.map((src, index) => (
					<div key={index} className="group relative w-full md:h-45 h-30 rounded-lg overflow-hidden border">
						<Image fill src={src} alt="preview" className="object-cover" unoptimized />

						{/* Hover Delete */}
						<div
							className="absolute group-hover:backdrop-blur-xs bg-black/50  inset-0
								opacity-0 group-hover:opacity-100
								flex z-10 items-center justify-center
								transition"
						>
							<button
								type="button"
								onClick={() => removeImage(index)}
								className="cursor-pointer
							"
							>
								<Trash2 className="text-white relative z-10" size={20} />
							</button>
						</div>
					</div>
				))}

				{/* ===== ADD MORE ===== */}
				<label
					htmlFor={inputId}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						e.preventDefault();
						handleFiles(e.dataTransfer.files);
					}}
					className="
						w-full md:h-45 h-30  border-2 border-dashed
						rounded-lg flex flex-col items-center
						justify-center cursor-pointer
						hover:border-dashboard-primary/30
						transition
					"
				>
					<CloudUpload className="text-dashboard-primary" size={35} />
					<p className="md:text-sm text-xs">
						Drop image or <span className="text-dashboard-primary underline">browse</span>
					</p>
					<p className="text-[10px] text-muted-foreground">PNG or JPG only allowed</p>

					<input id={inputId} type="file" accept={accept} multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
				</label>
			</div>
		</div>
	);
}
