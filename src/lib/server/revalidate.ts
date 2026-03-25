'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export type RevalidateInput = {
	tags?: string[];
	paths?: string[];
};

export async function revalidateApp({ tags = [], paths = [] }: RevalidateInput) {
	for (const tag of tags) {
		revalidateTag(tag, 'default');
	}

	for (const path of paths) {
		revalidatePath(path);
	}
}
