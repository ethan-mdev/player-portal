<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    
    type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';
    
    interface Props {
        show: boolean;
        type?: ModalType;
        title?: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
        onClose?: () => void;
    }
    
    let {
        show = $bindable(false),
        type = 'info',
        title = '',
        message,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm,
        onCancel,
        onClose
    }: Props = $props();
    
    const topBorderColors = {
        info: 'border-t-blue-500',
        success: 'border-t-green-500',
        warning: 'border-t-amber-500',
        error: 'border-t-red-500',
        confirm: 'border-t-amber-500'
    };
    
    const buttonColors = {
        info: 'bg-blue-500 hover:bg-blue-600',
        success: 'bg-green-500 hover:bg-green-600',
        warning: 'bg-amber-500 hover:bg-amber-600',
        error: 'bg-red-500 hover:bg-red-600',
        confirm: 'bg-amber-500 hover:bg-amber-600'
    };
    
    function handleClose() {
        show = false;
        onClose?.();
    }
    
    function handleConfirm() {
        onConfirm?.();
        handleClose();
    }
    
    function handleCancel() {
        onCancel?.();
        handleClose();
    }
    
    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={handleBackdropClick}
        onkeydown={(e) => e.key === 'Escape' && handleClose()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="bg-neutral-900 rounded-xl border-t-4 border-x border-b border-neutral-700 {topBorderColors[type]} p-6 w-full max-w-md"
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Title -->
            {#if title}
                <h3 class="text-lg font-semibold mb-4 text-center">{title}</h3>
            {/if}
            
            <!-- Message -->
            <p class="text-gray-400 mb-6">{message}</p>
            
            <!-- Actions -->
            <div class="flex gap-3">
                {#if type === 'confirm'}
                    <button
                        type="button"
                        onclick={handleCancel}
                        class="flex-1 px-4 py-2 rounded-lg border border-neutral-700 text-gray-300 hover:bg-neutral-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                {/if}
                
                <button
                    type="button"
                    onclick={handleConfirm}
                    class="flex-1 px-4 py-2 rounded-lg {buttonColors[type]} text-white transition-colors"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    </div>
{/if}