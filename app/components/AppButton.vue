<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    loading: false,
    disabled: false,
    type: 'button'
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <span
      v-if="loading"
      class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
    ></span>

    <span v-if="loading">
      Loading...
    </span>

    <slot v-else />
  </button>
</template>