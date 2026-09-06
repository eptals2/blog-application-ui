<script setup lang="ts">
defineProps<{
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
}>()

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 class="text-lg font-semibold text-gray-900">
                {{ title || 'Are you sure?' }}
            </h2>

            <p class="mt-2 text-sm text-gray-600">
                {{ message || 'This action cannot be undone.' }}
            </p>

            <div class="mt-6 flex justify-end gap-3">

                <button type="button" :disabled="loading"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    @click="emit('cancel')">
                    {{ cancelText || 'Cancel' }}
                </button>

                <button type="button" :disabled="loading"
                    class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    @click="emit('confirm')">
                    <span v-if="loading">Processing...</span>
                    <span v-else>{{ confirmText || 'Confirm' }}</span>
                </button>

            </div>

        </div>
    </div>
</template>