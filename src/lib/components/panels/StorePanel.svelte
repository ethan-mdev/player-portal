<script lang="ts">
	import type { AuthUser } from '$lib/server/auth';
	import type { DbStoreItem } from '$lib/server/db';

    let { user, store_items }: { user: AuthUser & { balance?: number | null }; store_items: Array<DbStoreItem> } = $props();
        
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
			<span class="text-amber-400 font-semibold">{user.balance ?? 0} Coins</span>
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
	{#if store_items.length === 0}
    <div class="text-center py-8">
        <span class="text-gray-400">No items available in the store.</span>
    </div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each store_items as item}
				<div class="bg-neutral-900/50 rounded-lg border border-neutral-700 p-4">
					<img src={`/assets/${item.image}`} alt="{item.name}" class="w-full h-32 object-cover rounded-lg mb-4" />
					<h3 class="text-lg font-bold mb-2">{item.name}</h3>
					<p class="text-gray-400 mb-4">{item.description}</p>
					<div class="flex items-center justify-between">
						<span class="text-amber-400 font-semibold">{item.price} Coins</span>
						<button
							type="button"
							class="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition"
						>
							Buy
						</button>
					</div>
				</div>
			{/each}
		</div>
    {/if}
</section>