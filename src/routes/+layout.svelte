<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-neutral-900 text-gray-100">
	{#if data.user}
		<!-- Authenticated layout with sidebar and header -->
		<Sidebar />
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
