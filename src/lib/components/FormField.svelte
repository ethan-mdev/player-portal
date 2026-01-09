<script lang="ts">
    let { 
        id, 
        name, 
        type = 'text', 
        label, 
        placeholder, 
        required = false, 
        value = $bindable(''),
        disabled = false
    } = $props();
</script>

<div>
    <label for={id} class="block text-sm font-medium text-gray-300 mb-2">
        {label}
    </label>
    <input
        {id}
        {name}
        {type}
        {required}
        {disabled}
        bind:value
        class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        {placeholder}
    />
</div>