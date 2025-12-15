<script lang="ts">
	import { getContext } from 'svelte';
	import AccountPanel from '$lib/components/panels/AccountPanel.svelte';
	import StorePanel from '$lib/components/panels/StorePanel.svelte';
	import VotePanel from '$lib/components/panels/VotePanel.svelte';
	import PurchasePanel from '$lib/components/panels/PurchasePanel.svelte';
	
	let { data } = $props();
	
	// Get current panel from context
	const panelContext = getContext<{current: string}>('currentPanel');
	let currentPanel = $derived(panelContext?.current || 'account');
</script>

<div class="space-y-6">
	{#if data.user}
		{#if currentPanel === 'account'}
			<AccountPanel user={data.user} characters={data.user.characters} />
		{:else if currentPanel === 'store'}
			<StorePanel user={data.user} store_items={data.store_items} />
		{:else if currentPanel === 'vote'}
			<VotePanel />
		{:else if currentPanel === 'purchase'}
			<PurchasePanel balance={data.balance} purchaseHistory={data.purchase_history} />
		{/if}
	{/if}
</div>