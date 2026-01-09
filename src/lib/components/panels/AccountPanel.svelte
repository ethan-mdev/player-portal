<script lang="ts">
	import type { AuthUser, Character } from '$lib/server/auth';
	import PopupModal from '$lib/components/PopupModal.svelte';
	import FormField from '$lib/components/FormField.svelte';

	let { user, characters }: { user: AuthUser; characters: Character[] } = $props();

	let loading = $state(false);
	let message = $state('');
	let showUnstuckModal = $state(false);
	let showResultModal = $state(false);
	let showPasswordModal = $state(false);
	let resultType = $state<'success' | 'error'>('success');
	let resultMessage = $state('');
	let selectedCharacter = $state('');
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let shouldLogoutAfterModal = $state(false);
	let voucherCode = $state('');

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

	function promptChangePassword() {
		oldPassword = '';
		newPassword = '';
		confirmPassword = '';
		passwordError = '';
		showPasswordModal = true;
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

	async function handleChangePassword() {
		// Validate inputs
		passwordError = '';
		
		if (!oldPassword || !newPassword || !confirmPassword) {
			passwordError = 'All fields are required';
			return;
		}

		if (newPassword.length < 6) {
			passwordError = 'New password must be at least 6 characters';
			return;
		}

		if (newPassword !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					old_password: oldPassword,
					new_password: newPassword
				})
			});

			const result = await res.json();

			if (res.ok) {
				showPasswordModal = false;
				resultType = 'success';
				resultMessage = 'Password changed successfully. Please log in again with your new password.';
				shouldLogoutAfterModal = true;
				showResultModal = true;
			} else {
				passwordError = result.error || 'Failed to change password';
			}
		} catch {
			passwordError = 'Something went wrong';
		} finally {
			loading = false;
		}
	}

	async function handleRedeemVoucher() {
		if (!voucherCode.trim()) {
			resultType = 'error';
			resultMessage = 'Please enter a voucher code';
			showResultModal = true;
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/redeem-voucher', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: voucherCode })
			});

			const result = await res.json();

			if (result.ok) {
				resultType = 'success';
				resultMessage = result.message || 'Voucher redeemed successfully!';
				voucherCode = ''; // Clear input on success
			} else {
				resultType = 'error';
				resultMessage = result.error || 'Redemption failed';
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
					onclick={promptChangePassword}
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
						bind:value={voucherCode}
						placeholder="Enter voucher code..."
						disabled={loading}
						class="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
					/>
					<button
						onclick={handleRedeemVoucher}
						disabled={loading}
						class="rounded-md bg-amber-500 hover:bg-amber-400 px-4 py-2 font-semibold text-white text-sm transition disabled:opacity-50 disabled:cursor-not-allowed redeem-voucher-btn"
					>
						{loading ? 'Redeeming...' : 'Redeem'}
					</button>
				</div>
			</div>
		</div>
	</div>

	{#if message}
		<p class="text-sm text-amber-400 mt-2">{message}</p>
	{/if}
</section>

<!-- Unstuck Confirmation Modal -->
<PopupModal
	bind:show={showUnstuckModal}
	type="confirm"
	title="Confirm Unstuck"
	message="Are you sure you want to unstuck {selectedCharacter}? This will teleport them to a safe location. Please ensure you're logged out before proceeding."
	confirmText="Yes, Unstuck"
	cancelText="Cancel"
	onConfirm={handleUnstuck}
/>

<!-- Change Password Modal -->
{#if showPasswordModal}
	<div 
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
		onclick={(e) => e.target === e.currentTarget && (showPasswordModal = false)}
		onkeydown={(e) => e.key === 'Escape' && (showPasswordModal = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="bg-neutral-900 rounded-xl border-t-4 border-x border-b border-neutral-700 border-t-amber-500 p-6 w-full max-w-md">
			<!-- Title -->
			<h3 class="text-lg font-semibold mb-4 text-center">Change Password</h3>
			
			<!-- Form -->
			<div class="space-y-4 mb-6">
				<FormField
					id="old-password"
					name="old-password"
					type="password"
					label="Current Password"
					placeholder="Enter current password"
					bind:value={oldPassword}
					disabled={loading}
				/>

				<FormField
					id="new-password"
					name="new-password"
					type="password"
					label="New Password"
					placeholder="Enter new password"
					bind:value={newPassword}
					disabled={loading}
				/>

				<FormField
					id="confirm-password"
					name="confirm-password"
					type="password"
					label="Confirm New Password"
					placeholder="Confirm new password"
					bind:value={confirmPassword}
					disabled={loading}
				/>

				{#if passwordError}
					<p class="text-sm text-red-400">{passwordError}</p>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => (showPasswordModal = false)}
					class="flex-1 px-4 py-2 rounded-lg border border-neutral-700 text-gray-300 hover:bg-neutral-800 transition-colors"
					disabled={loading}
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleChangePassword}
					class="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={loading}
				>
					{loading ? 'Changing...' : 'Change Password'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Result Modal -->
<PopupModal
	bind:show={showResultModal}
	type={resultType}
	title={resultType === 'success' ? 'Success' : 'Error'}
	message={resultMessage}
	confirmText="OK"
	onClose={() => {
		if (shouldLogoutAfterModal) {
			window.location.href = '/logout';
		}
	}}
/>