<script lang="ts">
	import type { AuthUser } from '$lib/server/auth';
	import type { DbCharacter } from '$lib/server/db';

	let { user, characters }: { user: AuthUser; characters: DbCharacter[] } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-bold">Account</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#if characters.length > 0}
			{#each characters as character}
				<div
					class="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 p-5 shadow-[0_0_25px_rgba(251,191,36,0.12)]"
				>
					<h3 class="font-semibold text-gray-200">{character.name}</h3>
				</div>
			{/each}
		{:else}
			<div class="col-span-full text-center py-12 text-gray-400">
				<svg
					class="w-16 h-16 mx-auto mb-4 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
				<h3 class="text-lg font-semibold text-gray-300 mb-2">No Characters Found</h3>
				<p>Create a character in-game to get started!</p>
			</div>
		{/if}
	</div>

	<div class="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 overflow-hidden">
		<div class="px-5 py-3 border-b border-neutral-800">
			<h4 class="font-semibold text-gray-200">Account Settings</h4>
		</div>
		<div class="p-6 space-y-4">
			<div class="flex items-center justify-between py-3 border-b border-neutral-800">
				<div>
					<h5 class="font-semibold text-gray-200">Change Password</h5>
					<p class="text-sm text-gray-400">Update your account password</p>
				</div>
				<button
					id="change-password-btn"
					class="rounded-md bg-amber-500 hover:bg-amber-400 px-4 py-2 font-semibold text-white text-sm transition"
				>
					Change
				</button>
			</div>

			<div class="py-3 border-b border-neutral-800">
				<div class="mb-3">
					<h5 class="font-semibold text-gray-200">Redeem Voucher</h5>
					<p class="text-sm text-gray-400">Enter a gift voucher code to redeem a gift</p>
				</div>
				<div class="flex gap-3">
					<input
						type="text"
						id="voucher-code"
						placeholder="Enter voucher code..."
						class="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
					/>
					<button
						class="rounded-md bg-amber-500 hover:bg-amber-400 px-4 py-2 font-semibold text-white text-sm transition redeem-voucher-btn"
					>
						Redeem
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
