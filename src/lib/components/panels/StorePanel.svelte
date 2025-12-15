<script lang="ts">
	import type { AuthUser } from '$lib/server/auth';
	import type { DbStoreItem } from '$lib/server/db';

    let { user, store_items }: { user: AuthUser; store_items: Array<DbStoreItem> } = $props();
        
	const filterButtons = [
		{ label: 'All Items', value: 'all' },
		{ label: 'Costumes', value: 'costumes' },
		{ label: 'Boosts', value: 'boosts' },
		{ label: 'Bundles', value: 'bundles' }
	];
</script>

<section class="space-y-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold">Store</h2>
		<div class="bg-neutral-800/50 px-4 py-2 rounded-lg border border-neutral-700">
			<span class="text-sm text-gray-400">Balance: </span>
			<span class="text-amber-400 font-semibold">0 Coins</span>
		</div>
	</div>
	<div class="flex flex-wrap gap-2 mb-6 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700">
		{#each filterButtons as button}
			<button
				type="button"
				class="px-4 py-2 bg-neutral-800/50 rounded-lg border border-neutral-700 text-sm text-gray-300 hover:bg-neutral-700 transition"
                data-filter="{button.value}"
			>
				{button.label}
			</button>
		{/each}
	</div>
    <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <p class="mt-4 text-gray-400">Loading store items...</p>
    </div>
</section>