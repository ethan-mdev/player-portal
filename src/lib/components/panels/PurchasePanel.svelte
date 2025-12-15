<script lang="ts">
    import type { AuthUser } from '$lib/server/auth';
    let { user }: { user: AuthUser } = $props();
</script>