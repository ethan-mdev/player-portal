<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { setContext } from 'svelte';
	let { children, data } = $props();
	
	// Panel state management
	let currentPanel = $state('account');
	
	function handlePanelChange(panelId: string) {
		currentPanel = panelId;
	}
	
	// Make panel state available to children via context
	setContext('currentPanel', {
		get current() { return currentPanel; }
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-neutral-900 text-gray-100">
	{#if data.user}
		<!-- Authenticated layout with sidebar and header -->
		<Sidebar onPanelChange={handlePanelChange} />
		<div class="md:ml-64 min-h-screen flex flex-col">
			<Header user={data.user} />
			<main class="flex-1 p-6 overflow-y-auto">
				{@render children()}
			</main>
		</div>
	{:else}
		<!-- Unauthenticated layout (login/register pages) -->
		{@render children()}
	{/if}
</div>
