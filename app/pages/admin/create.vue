<script setup lang="ts">

definePageMeta({
  middleware: 'admin'
})

const api = useApi()
const toast = useToast()

const title = ref('')
const content = ref('')
const error = ref('')
const loading = ref(false)

const createPost = async () => {
  error.value = ''
  loading.value = true

  try {
    await api('/posts', {
      method: 'POST',
      body: {
        title: title.value,
        content: content.value
      }
    })
    toast.success('Post created successfully.')
    await navigateTo('/admin')
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to create post.'
    toast.error('Failed to create post.')
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <header class="border-b bg-white">
      <div class="mx-auto max-w-4xl px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">
          Create Post
        </h1>

        <p class="text-sm text-gray-500">
          Create a new blog post
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-10">

      <form class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" @submit.prevent="createPost">

        <div class="mb-6">
          <label for="title" class="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input id="title" v-model="title" type="text" required
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter post title" />
        </div>

        <div class="mb-6">
          <label for="content" class="mb-2 block text-sm font-medium text-gray-700">
            Content
          </label>

          <textarea id="content" v-model="content" rows="10" required
            class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Write your post..."></textarea>
        </div>

        <p v-if="error" class="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ error }}
        </p>

        <div class="flex items-center gap-3">
          <AppButton type="submit" :loading="loading" class="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            Create Post
          </AppButton>

          <NuxtLink to="/admin"
            class="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </NuxtLink>

        </div>

      </form>

    </main>

  </div>
</template>