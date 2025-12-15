<script lang="ts">
	import type { DbCreditPurchase } from '$lib/server/db';

	let {
		balance = 0,
		purchaseHistory = []
	}: {
		balance: number;
		purchaseHistory: DbCreditPurchase[];
	} = $props();

	// Credit packages data
	const creditPackages = [
		{
			id: 1,
			name: 'Starter Pack',
			credits: 1000,
			bonus: 0,
			price: 4.99,
			popular: false,
			description: 'Perfect for new players'
		},
		{
			id: 2,
			name: 'Adventure Pack',
			credits: 2500,
			bonus: 250,
			price: 9.99,
			popular: false,
			description: 'Great value for regular players'
		},
		{
			id: 3,
			name: 'Hero Pack',
			credits: 5000,
			bonus: 750,
			price: 19.99,
			popular: true,
			description: 'Most popular choice!'
		},
		{
			id: 4,
			name: 'Legend Pack',
			credits: 10000,
			bonus: 2000,
			price: 34.99,
			popular: false,
			description: 'For dedicated adventurers'
		},
		{
			id: 5,
			name: 'Ultimate Pack',
			credits: 25000,
			bonus: 6250,
			price: 79.99,
			popular: false,
			description: 'Maximum value bundle'
		},
		{
			id: 6,
			name: 'Mega Pack',
			credits: 50000,
			bonus: 15000,
			price: 149.99,
			popular: false,
			description: 'For the ultimate experience'
		}
	];

	function handlePurchase(pkg: typeof creditPackages[0]) {
		console.log('Purchase clicked:', pkg);
		// TODO: Implement purchase logic
	}
</script>

<section class="space-y-6">
	<h2 class="text-xl font-bold">Purchase Credits</h2>

	<div>
		<div class="flex items-center justify-between mb-6">
			<div class="bg-neutral-800/50 px-4 py-2 rounded-lg border border-neutral-700">
				<span class="text-sm text-gray-400">Current Balance: </span>
				<span class="text-amber-400 font-semibold">{balance.toLocaleString()} Credits</span>
			</div>
		</div>

		<!-- Credit Packages Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each creditPackages as pkg}
				<div
					class="relative bg-neutral-900/80 ring-1 ring-neutral-800 rounded-xl p-6 transition-all hover:ring-amber-500/30 {pkg.popular
						? 'ring-amber-500/50'
						: ''}"
				>
					{#if pkg.popular}
						<div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
							<span class="bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-full">
								MOST POPULAR
							</span>
						</div>
					{/if}

					<div class="text-center mb-6">
						<h3 class="text-xl font-bold text-gray-100 mb-2">{pkg.name}</h3>
						<p class="text-gray-400 text-sm mb-4">{pkg.description}</p>

						<!-- Price Display -->
						<div class="mb-4">
							<span class="text-3xl font-bold text-amber-400">${pkg.price}</span>
						</div>

						<!-- Credits Display -->
						<div class="bg-neutral-800/50 rounded-lg p-4 mb-4">
							<div class="flex items-center justify-between text-sm">
								<span class="text-gray-400">Base Credits:</span>
								<span class="text-white font-semibold">{pkg.credits.toLocaleString()}</span>
							</div>
							{#if pkg.bonus > 0}
								<div class="flex items-center justify-between text-sm mt-2">
									<span class="text-gray-400">Bonus Credits:</span>
									<span class="text-green-400 font-semibold">+{pkg.bonus.toLocaleString()}</span>
								</div>
							{/if}
							<hr class="border-neutral-700 my-3" />
							<div class="flex items-center justify-between">
								<span class="text-amber-400 font-bold">Total Credits:</span>
								<span class="text-amber-400 font-bold text-lg"
									>{(pkg.credits + pkg.bonus).toLocaleString()}</span
								>
							</div>
						</div>

						<!-- Value Calculation -->
						<div class="text-xs text-gray-500 mb-4">
							${((pkg.price / (pkg.credits + pkg.bonus)) * 1000).toFixed(2)} per 1000 credits
						</div>
					</div>

					<button
						class="w-full bg-amber-500 hover:bg-amber-400 px-4 py-3 rounded-lg text-white font-semibold transition-colors"
						onclick={() => handlePurchase(pkg)}
					>
						Purchase Now
					</button>
				</div>
			{/each}
		</div>

		<!-- Purchase History Section -->
		<div class="mt-12">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-lg font-bold">Purchase History</h3>
			</div>

			{#if purchaseHistory.length > 0}
				<div class="bg-neutral-900/80 ring-1 ring-neutral-800 rounded-xl overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-neutral-800/50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
									>
										Credits
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
									>
										Amount
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
									>
										Date
									</th>
									<th
										class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
									>
										Status
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-neutral-800">
								{#each purchaseHistory as purchase}
									<tr>
										<td class="px-6 py-4 text-sm text-green-400 font-semibold">
											+{purchase.credits.toLocaleString()}
										</td>
										<td class="px-6 py-4 text-sm text-gray-300">
											${parseFloat(purchase.amount_paid).toFixed(2)}
										</td>
										<td class="px-6 py-4 text-sm text-gray-400">
											{new Date(purchase.purchased_at).toLocaleDateString()}
										</td>
										<td class="px-6 py-4 text-sm">
											<span
												class="px-2 py-1 rounded text-xs font-medium {purchase.status === 'completed'
													? 'bg-green-500/20 text-green-400'
													: purchase.status === 'pending'
														? 'bg-yellow-500/20 text-yellow-400'
														: 'bg-red-500/20 text-red-400'}"
											>
												{purchase.status}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{:else}
				<!-- Empty History State -->
				<div class="text-center py-12 text-gray-400">
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
							d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
						></path>
					</svg>
					<h3 class="text-lg font-semibold text-gray-300 mb-2">No Purchase History</h3>
					<p>Your credit purchases will appear here once you make your first purchase.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
