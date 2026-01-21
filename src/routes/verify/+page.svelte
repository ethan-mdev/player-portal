<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    const AUTH_SERVER = data.authServerUrl;
    
    let loading = $state(true);
    let error = $state('');
    let success = $state(false);
    
    onMount(async () => {
        await completeVerification();
    });
    
    async function completeVerification() {
        loading = true;
        error = '';
        
        try {
            const response = await fetch(`${AUTH_SERVER}/discord/verify?token=${data.token}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                success = true;
                // Wait a moment then redirect to dashboard
                setTimeout(() => {
                    goto('/?verified=true');
                }, 2000);
            } else {
                const result = await response.json();
                error = result.message || 'Verification failed';
            }
        } catch (e) {
            error = 'Failed to connect to server. Please try again.';
        }
        
        loading = false;
    }
</script>

<svelte:head>
    <title>Discord Verification - Game Dashboard</title>
</svelte:head>

<main class="min-h-screen bg-neutral-900 text-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
        <div class="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 p-8">
            {#if loading}
                <div class="text-center">
                    <div class="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 class="text-2xl font-bold text-amber-400 mb-2">Verifying...</h2>
                    <p class="text-gray-400">Creating your game account</p>
                </div>
            {:else if success}
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-green-400 mb-2">Verification Complete!</h2>
                    <p class="text-gray-400 mb-4">Your Discord account has been linked and your game account created.</p>
                    <p class="text-sm text-gray-500">Redirecting to dashboard...</p>
                </div>
            {:else if error}
                <div class="text-center">
                    <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
                    <p class="text-gray-400 mb-6">{error}</p>
                    <div class="space-y-2">
                        <a 
                            href="/" 
                            class="block w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold rounded-lg transition text-center"
                        >
                            Go to Dashboard
                        </a>
                        <button
                            onclick={() => window.location.reload()}
                            class="block w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-gray-100 font-semibold rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>
