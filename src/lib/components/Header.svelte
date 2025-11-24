<script lang="ts">
	import type { AuthenticatedUser } from '$lib/server/auth';
    import ProfileModal from '$lib/components/ProfileModal.svelte';
	let { user }: { user: AuthenticatedUser } = $props();
    let showProfileModal = $state(false);
    
    function openProfileModal() {
        showProfileModal = true;
    }

    function closeProfileModal() {
        showProfileModal = false;
    }
</script>

<header>
	<div>
		<span class="text-sm text-gray-400">
			Welcome, <span class="text-sky-400">{user.username}</span>
		</span>
		<div>

        </div>
		<button
			id="profile-image-btn"
            onclick={openProfileModal}
			class="w-8 h-8 rounded-full border border-neutral-700 hover:border-amber-500 transition-colors overflow-hidden"
		>
			<img src={user.profile_image ? `/avatars/${user.profile_image}` : '/avatars/avatar-1.png'} alt="User profile" class="w-full h-full object-cover" />
		</button>
	</div>
</header>

{#if showProfileModal}
    <ProfileModal isOpen={showProfileModal} user={user} onClose={closeProfileModal} />
{/if}
