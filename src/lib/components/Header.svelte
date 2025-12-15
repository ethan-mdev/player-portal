<script lang="ts">
	import type { AuthUser } from '$lib/server/auth';
	import ProfileModal from '$lib/components/ProfileModal.svelte';

	let { user }: { user: AuthUser & { profile_image?: string | null } } = $props();
	let showProfileModal = $state(false);

	function openProfileModal() {
		showProfileModal = true;
	}

	function closeProfileModal() {
		showProfileModal = false;
	}
</script>

<header
	class="h-16 flex items-center justify-end px-6 bg-neutral-900/80 border-neutral-800 border-b backdrop-blur"
>
	<div class="flex items-center space-x-2">
		<span class="text-sm text-gray-400">
			Welcome, <span class="text-sky-400">{user.username}</span>
		</span>
		<span class="px-2 py-0.5 bg-slate-500/20 text-slate-300 text-xs font-semibold rounded">
			MEMBER
		</span>
		<button
			onclick={openProfileModal}
			class="w-8 h-8 rounded-full border border-neutral-700 hover:border-amber-500 transition-colors overflow-hidden"
		>
			<img
				src={user.profile_image ? `/avatars/${user.profile_image}` : '/avatars/avatar-1.png'}
				alt="User profile"
				class="w-full h-full object-cover"
			/>
		</button>
	</div>
</header>

{#if showProfileModal}
	<ProfileModal isOpen={showProfileModal} {user} onClose={closeProfileModal} />
{/if}
