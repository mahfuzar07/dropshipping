// Handles the mismatched category tree shape coming from different sources:
// - our own category API might use `subcategories`
// - the 1688.com-derived JSON uses `items` at the leaf-parent level
// - some nodes have `id`, some (items) only have `name`
export function getCategoryChildren(node: any): any[] {
	if (!node) return [];
	return node.subcategories ?? node.items ?? [];
}

export function getCategoryKey(node: any): string | number | undefined {
	return node?.id ?? node?.name;
}
