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
	
	// Component mapping
	const panels = {
		account: AccountPanel,
		store: StorePanel,
		vote: VotePanel,
		purchase: PurchasePanel
	} as const;
	
	// Get the current component
	let Component = $derived(panels[currentPanel as keyof typeof panels]);
</script>

<div class="space-y-6">
	{#if Component && data.user}
		<Component user={data.user} characters={data.user.characters} store_items={data.store_items} />
	{/if}
</div>