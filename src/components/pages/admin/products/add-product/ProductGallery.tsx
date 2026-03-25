'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrayInput } from '@/components/ui/custom/array-input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { OptionsSettings, SettingsFormData } from '@/types/types';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { DragMultiUploadInput } from '@/components/ui/custom/DragMultiUploadInput';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';
import { useState } from 'react';

type Props = {
	formData: SettingsFormData;
	setFormData: React.Dispatch<React.SetStateAction<SettingsFormData>>;
	handleFormDataChange: (field: keyof SettingsFormData) => any;
};

export default function ProductGallery({ formData, setFormData, handleFormDataChange }: Props) {
	const [images, setImages] = useState<string[]>(['https://picsum.photos/200/300', 'https://picsum.photos/300/300']);
	const [files, setFiles] = useState<File[]>([]);
	return (
		<Card className="shadow border-none h-full">
			<CardHeader className="border-b !pb-3 font-hanken">
				<CardTitle>Product Images</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5 text-dashboard-muted">
				<DragMultiUploadInput
					values={images}
					onChange={(newFiles, previews) => {
						console.log('FILES:', newFiles);
						console.log('PREVIEWS:', previews);

						setFiles(newFiles);
						setImages(previews);
					}}
				/>
			</CardContent>
		</Card>
	);
}
