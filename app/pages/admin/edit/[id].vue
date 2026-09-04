<script setup lang="ts">

definePageMeta({
  middleware: 'admin'
})

const route = useRoute()
const api = useApi()

const title = ref('')
const content = ref('')
const error = ref('')
const loading = ref(false)

const postId = route.params.id

// Load existing post
const { data: post, pending } = await useAsyncData(
  `edit-post-${postId}`,
  () => api(`/posts/${postId}`)
)

if (post.value) {
  title.value = post.value.title
  content.value = post.value.content
}

const updatePost = async () => {
  error.value = ''
  loading.value = true

  try {
    await api(`/posts/${postId}`, {
      method: 'PUT',
      body: {
        title: title.value,
        content: content.value
      }
    })

    await navigateTo('/admin')

  } catch (err: any) {
    error.value =
      err?.data?.message || 'Failed to update post.'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <NuxtLink
          to="/admin"
          class="text-2xl font-bold text-gray-900"
        >
          Admin Dashboard
        </NuxtLink>

        <NuxtLink
          to="/admin"
          class="text-gray-600 hover:text-gray-900"
        >
          Back to Dashboard
        </NuxtLink>

      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-3xl px-6 py-10">

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        <h1 class="text-3xl font-bold text-gray-900">
          Edit Post
        </h1>

        <p class="mt-2 text-gray-600">
          Update your blog post.
        </p>

        <!-- Loading -->
        <p
          v-if="pending"
          class="mt-6 text-gray-600"
        >
          Loading post...
        </p>

        <!-- Error -->
        <div
          v-else-if="error"
          class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600"
        >
          {{ error }}
        </div>

        <!-- Form -->
        <form
          v-else
          @submit.prevent="updatePost"
          class="mt-8 space-y-6"
        >

          <!-- Title -->
          <div>
            <label
              for="title"
              class="mb-2 block font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              v-model="title"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter post title"
            />
          </div>

          <!-- Content -->
          <div>
            <label
              for="content"
              class="mb-2 block font-medium text-gray-700"
            >
              Content
            </label>

            <textarea
              id="content"
              v-model="content"
              rows="10"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Write your post..."
            ></textarea>
          </div>

          <!-- Error message -->
          <div
            v-if="error"
            class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600"
          >
            {{ error }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">

            <button
              type="submit"
              :disabled="loading"
              class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update Post' }}
            </button>

            <NuxtLink
              to="/admin"
              class="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </NuxtLink>

          </div>

        </form>

      </div>

    </main>

  </div>
</template>