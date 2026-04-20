// ProductImageGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/ui/lens';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';

interface ProductImageGalleryProps {
	images: string[];
	productName: string;
	selectedImageIndex?: number;
	onSelectImage?: (index: number) => void;
}

export default function ProductImageGallery({ images, productName, selectedImageIndex, onSelectImage }: ProductImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

	useEffect(() => {
		if (selectedImageIndex !== undefined && selectedImageIndex !== selectedImage) {
			setSlideDirection(selectedImageIndex > selectedImage ? 'right' : 'left');
			setSelectedImage(selectedImageIndex);
		}
	}, [selectedImageIndex, selectedImage]);

	const selectImage = (newIndex: number) => {
		if (newIndex === selectedImage) return;
		setSlideDirection(newIndex > selectedImage ? 'right' : 'left');
		setSelectedImage(newIndex);
		onSelectImage?.(newIndex);
	};

	const nextImage = () => {
		const next = (selectedImage + 1) % images.length;
		setSlideDirection('right');
		setSelectedImage(next);
		onSelectImage?.(next);
	};

	const prevImage = () => {
		const prev = (selectedImage - 1 + images.length) % images.length;
		setSlideDirection('left');
		setSelectedImage(prev);
		onSelectImage?.(prev);
	};

	const slideVariants = {
		enter: (direction: string) => ({ x: direction === 'right' ? 300 : -300, opacity: 0 }),
		center: { zIndex: 1, x: 0, opacity: 1 },
		exit: (direction: string) => ({ zIndex: 0, x: direction === 'right' ? -300 : 300, opacity: 0 }),
	};

	return (
		<div className="space-y-4">
			{/* Main Image with Lens Zoom */}
			<div className="relative h-[350px] md:h-[400px] xl:h-[520px] w-full overflow-hidden group bg-white rounded-xl">
				<AnimatePresence mode="wait" custom={slideDirection}>
					<motion.div
						key={selectedImage}
						custom={slideDirection}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }}
						className="absolute inset-0"
					>
						<Lens zoomFactor={2} lensSize={200}>
							<div className="relative h-[350px] md:h-[400px] xl:h-[520px] w-full flex items-center justify-center p-4 md:p-8">
								<Image
									fill
									src={images[selectedImage] || '/placeholder.svg'}
									alt={`${productName} - Image ${selectedImage + 1}`}
									className="object-cover h-full w-full"
								/>
							</div>
						</Lens>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Arrows */}
				<Button
					variant="outline"
					size="icon"
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
					onClick={prevImage}
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
					onClick={nextImage}
				>
					<ChevronRight className="h-5 w-5" />
				</Button>
			</div>

			{/* Thumbnails */}
			<div className="relative overflow-hidden">
				<Swiper
					spaceBetween={12}
					modules={[Navigation]}
					breakpoints={{
						320: { slidesPerView: 3 },
						480: { slidesPerView: 4 },
						768: { slidesPerView: 6 },
						1024: { slidesPerView: 7 },
					}}
				>
					{images.map((image, index) => (
						<SwiperSlide key={index}>
							<div
								onClick={() => selectImage(index)}
								className={`aspect-square relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
									selectedImage === index ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-border hover:border-primary/50'
								}`}
							>
								<Image
									fill
									src={image || '/placeholder.svg'}
									alt={`${productName} thumbnail ${index + 1}`}
									className="object-contain p-1 w-full h-full"
								/>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
