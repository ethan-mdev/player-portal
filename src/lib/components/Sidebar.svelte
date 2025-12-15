
<script lang="ts">
  let { onPanelChange = () => {} } = $props();
  let activePanel = $state('account');
  
  const navItems = [
    { id: 'account', label: 'Account' },
    { id: 'store', label: 'Store' },
    { id: 'vote', label: 'Vote' },
    { id: 'purchase', label: 'Purchase Credits' }
  ];
  
  function selectPanel(panelId: string) {
    activePanel = panelId;
    onPanelChange(panelId);
  }
</script>

<!-- Mobile Hamburger Button -->
<button
  id="mobile-menu-toggle"
  aria-label="Toggle mobile menu"
  class="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-neutral-800/80 backdrop-blur
     border border-neutral-700 text-gray-300 hover:text-white transition-colors"
>
  <svg
    class="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
</button>

<!-- Mobile Overlay -->
<div
  id="mobile-overlay"
  class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm hidden md:hidden"
>
</div>

<!-- Fixed Sidebar -->
<aside
  id="sidebar"
  class="fixed inset-y-0 left-0 w-64 bg-neutral-800/80 backdrop-blur
     border-r border-neutral-700 flex flex-col z-40
     transform -translate-x-full transition-transform duration-300 ease-in-out
     md:translate-x-0"
>
  <!-- Logo -->
  <div class="p-6 border-b border-neutral-700">
    <a href="/" class="block">
      <img src="/logo.png" alt="Game logo" class="w-28 mx-auto hover:opacity-80 transition-opacity" />
    </a>
  </div>

  <!-- Nav -->
  <nav class="flex-1 p-4 space-y-2">
    {#each navItems as item}
      <button
        onclick={() => selectPanel(item.id)}
        data-panel={item.id}
        class="nav-btn w-full flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors {
          activePanel === item.id 
            ? 'bg-amber-500 text-white hover:bg-amber-400' 
            : 'text-gray-300 hover:bg-neutral-700'
        }"
      >
        {item.label}
      </button>
    {/each}
  </nav>

  <!-- Sign Out Button -->
  <div class="p-4 border-t border-neutral-700">
    <button
      class="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold
         text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-red-500/30"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        ></path>
      </svg>
      <a href="/logout">Sign Out</a>
    </button>
  </div>

  <!-- Footer -->
  <div class="p-4 text-xs text-gray-400 text-center">
    2025 Ethan Moore. All rights reserved.
  </div>
</aside>