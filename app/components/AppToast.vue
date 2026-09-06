<script setup lang="ts">
const toast = useToast()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
      v-if="toast.visible.value"
      class="fixed right-5 top-5 z-50 w-80 rounded-lg border bg-white p-4 shadow-lg"
    >
      <div class="flex items-start gap-3">

        <!-- Success -->
        <div
          v-if="toast.type.value === 'success'"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"
        >
          ✓
        </div>

        <!-- Error -->
        <div
          v-else
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
        >
          !
        </div>

        <div class="flex-1">
          <p class="font-medium text-gray-900">
            {{ toast.type.value === 'success' ? 'Success' : 'Error' }}
          </p>

          <p class="mt-1 text-sm text-gray-600">
            {{ toast.message.value }}
          </p>
        </div>

        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="toast.hide()"
        >
          ×
        </button>

      </div>
    </div>
  </Transition>
</template>