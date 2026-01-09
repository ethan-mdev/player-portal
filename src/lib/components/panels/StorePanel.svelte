<script lang="ts">
	import type { DbStoreItem } from '$lib/server/db';
	import PopupModal from '$lib/components/PopupModal.svelte';

	let { balance = 0, store_items }: { balance: number; store_items: Array<DbStoreItem> } = $props();

	let activeFilter = $state('all');
	let purchasingItemId = $state<number | null>(null);
	let showConfirmModal = $state(false);
	let showResultModal = $state(false);
	let resultType = $state<'success' | 'error'>('success');
	let resultMessage = $state('');
	let selectedItem = $state<{ id: number; name: string; price: number } | null>(null);

	let filteredItems = $derived(
		activeFilter === 'all'
			? store_items
			: store_items.filter((item) => item.type === activeFilter)
	);

	const filterButtons = [
		{ label: 'All Items', value: 'all' },
		{ label: 'Costumes', value: 'costumes' },
		{ label: 'Boosts', value: 'boosts' },
		{ label: 'Bundles', value: 'bundles' }
	];

	function promptPurchase(itemId: number, itemName: string, price: number) {
		selectedItem = { id: itemId, name: itemName, price };
		showConfirmModal = true;
	}

	async function handlePurchase() {
		if (!selectedItem) return;

		purchasingItemId = selectedItem.id;

		try {
			const res = await fetch('/api/purchase', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ item_id: selectedItem.id, amount: 1 })
			});

			const result = await res.json();

			if (result.ok) {
				resultType = 'success';
				resultMessage = `${selectedItem.name} purchased successfully!`;
				balance = result.new_balance;
			} else {
				resultType = 'error';
				resultMessage = result.error || 'Purchase failed';
			}
			showResultModal = true;
		} catch {
			resultType = 'error';
			resultMessage = 'Something went wrong';
			showResultModal = true;
		} finally {
			purchasingItemId = null;
		}
	}
</script>

<section class="space-y-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold">Store</h2>
		<div class="bg-neutral-800/50 px-4 py-2 rounded-lg border border-neutral-700">
			<span class="text-sm text-gray-400">Balance: </span>
			<span class="text-amber-400 font-semibold">{balance.toLocaleString()} Coins</span>
		</div>
	</div>

	<div class="flex flex-wrap gap-2 mb-6 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700">
		{#each filterButtons as button}
			<button
				type="button"
				class="px-4 py-2 rounded-lg border text-sm transition {activeFilter === button.value
					? 'bg-amber-500 border-amber-500 text-white'
					: 'bg-neutral-800/50 border-neutral-700 text-gray-300 hover:bg-neutral-700'}"
				onclick={() => (activeFilter = button.value)}
			>
				{button.label}
			</button>
		{/each}
	</div>
	{#if filteredItems.length === 0}
		<div class="text-center py-8">
			<span class="text-gray-400">No items available in this category.</span>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each filteredItems as item}
				{@const canAfford = balance >= item.price}
				<div class="flex flex-col bg-neutral-900/50 rounded-lg border border-neutral-800 p-4">
					<div class="w-full h-32 bg-neutral-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
						<img 
							src={`https://placehold.co/300x200/262626/a3a3a3?text=${encodeURIComponent(item.name)}`} 
							alt={item.name} 
							class="w-full h-full object-cover" 
						/>
					</div>
					<h3 class="text-lg font-bold mb-2">{item.name}</h3>
					<p class="text-gray-400 text-sm mb-4 grow">{item.description}</p>
					<div class="flex items-center justify-between mt-auto">
						<span class="text-amber-400 font-semibold">{item.price.toLocaleString()} Coins</span>
						<button
							type="button"
							disabled={!canAfford || purchasingItemId === item.id}
							onclick={() => promptPurchase(item.id, item.name, item.price)}
							class="px-4 py-2 rounded-lg transition {canAfford && purchasingItemId !== item.id
								? 'bg-amber-500 hover:bg-amber-400 text-white'
								: 'bg-neutral-700 text-gray-500 cursor-not-allowed'}"
						>
							{purchasingItemId === item.id ? 'Buying...' : 'Buy'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- Purchase Confirmation Modal -->
<PopupModal
	bind:show={showConfirmModal}
	type="confirm"
	title="Confirm Purchase"
	message="Purchase {selectedItem?.name} for {selectedItem?.price.toLocaleString()} coins?"
	confirmText="Yes, Purchase"
	cancelText="Cancel"
	onConfirm={handlePurchase}
/>

<!-- Result Modal -->
<PopupModal
	bind:show={showResultModal}
	type={resultType}
	title={resultType === 'success' ? 'Success' : 'Error'}
	message={resultMessage}
	confirmText="OK"
/>