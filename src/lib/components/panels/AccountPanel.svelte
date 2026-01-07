<script lang="ts">
	import type { AuthUser, Character } from '$lib/server/auth';
	import PopupModal from '$lib/components/PopupModal.svelte';

	let { user, characters }: { user: AuthUser; characters: Character[] } = $props();

	let loading = $state(false);
	let message = $state('');
	let showUnstuckModal = $state(false);
	let showResultModal = $state(false);
	let resultType = $state<'success' | 'error'>('success');
	let resultMessage = $state('');
	let selectedCharacter = $state('');

	function formatGold(amount: number): string {
		const gems = Math.floor(amount / 100000000);
		const gold = Math.floor((amount % 100000000) / 1000000);
		const silver = Math.floor((amount % 1000000) / 1000);
		const copper = amount % 1000;
		let parts = [];
		if (gems) parts.push(`${gems} gem${gems > 1 ? 's' : ''}`);
		if (gold) parts.push(`${gold} gold`);
		if (silver) parts.push(`${silver} silver`);
		if (copper) parts.push(`${copper} copper`);
		return parts.join(' ');
	}

	function formatClass(classId: number): string {
		const classes: Record<number, string> = {
			1: 'Fighter',
			2: 'Clever Fighter',
			3: 'Warrior',
			4: 'Gladiator',
			5: 'Knight',
			6: 'Cleric',
			7: 'High Cleric',
			8: 'Paladin',
			9: 'Holy Knight',
			10: 'Guardian',
			11: 'Archer',
			12: 'Hawk Archer',
			13: 'Scout',
			14: 'Sharp Shooter',
			15: 'Ranger',
			16: 'Mage',
			17: 'Wiz Mage',
			18: 'Enchanter',
			19: 'Warlock',
			20: 'Wizard',
			21: 'Trickster',
			22: 'Gambit',
			23: 'Renegade',
			24: 'Spectre',
			25: 'Reaper',
			26: 'Crusader',
			27: 'Templar'
		};
		return classes[classId] || 'Unknown';
	}

	function promptUnstuck(characterName: string) {
		selectedCharacter = characterName;
		showUnstuckModal = true;
	}

	async function handleUnstuck() {
		loading = true;

		try {
			const res = await fetch('/api/unstuck', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ character: selectedCharacter })
			});

			const result = await res.json();

			if (result.ok) {
				resultType = 'success';
				resultMessage = result.message;
			} else {
				resultType = 'error';
				resultMessage = result.error || 'Unstuck failed';
			}
			showResultModal = true;
		} catch {
			resultType = 'error';
			resultMessage = 'Something went wrong';
			showResultModal = true;
		} finally {
			loading = false;
		}
	}
</script>

<section class="space-y-6">
	<h2 class="text-xl font-bold">Account</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#if characters.length > 0}
			{#each characters as character}
				<div class="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 p-5">
					<h3 class="font-semibold text-gray-200">{character.name}</h3>
					<ul class="mt-1 text-sm text-gray-400 space-y-1">
						<li class="flex items-center gap-2">
							<span class="w-2 h-2 rounded-full bg-amber-500"></span>
							Lv. {character.level}
							{formatClass(character.classId)}
						</li>
						<li class="flex items-center gap-2">
							<span class="w-2 h-2 rounded-full bg-yellow-500"></span>
							Wealth: {character.money > 0 ? formatGold(character.money) : 'None'}
						</li>
					</ul>
					<button
						class="mt-4 w-full rounded-md bg-amber-500 hover:bg-amber-400 px-4 py-2 font-semibold text-white transition-colors"
						onclick={() => promptUnstuck(character.name)}
						disabled={loading}
					>
						Unstuck
					</button>
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

	{#if message}
		<p class="text-sm text-amber-400 mt-2">{message}</p>
	{/if}
</section>

<!-- Confirmation Modal -->
<PopupModal
	bind:show={showUnstuckModal}
	type="confirm"
	title="Confirm Unstuck"
	message="Are you sure you want to unstuck {selectedCharacter}? This will teleport them to a safe location. Please ensure you're logged out before proceeding."
	confirmText="Yes, Unstuck"
	cancelText="Cancel"
	onConfirm={handleUnstuck}
/>

<!-- Result Modal -->
<PopupModal
	bind:show={showResultModal}
	type={resultType}
	title={resultType === 'success' ? 'Success' : 'Error'}
	message={resultMessage}
	confirmText="OK"
/>
