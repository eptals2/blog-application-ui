<script setup lang="ts">

definePageMeta({
  middleware: 'admin'
})

const api = useApi()

const {
  data: posts,
  error,
  pending,
  refresh
} = await useAsyncData(
  'admin-posts',
  () => api('/posts')
)

const deletePost = async (id: number) => {

  if (!confirm('Are you sure you want to delete this post?')) {
    return
  }

  try {
    await api(`/posts/${id}`, {
      method: 'DELETE'
    })

    await refresh()
  } catch (err: any) {
    alert(
      err?.data?.message ||
      'Failed to delete post.'
    )
  }
}

const auth = useAuth()

const logout = async () => {
  await api('/logout', {
    method: 'POST'
  })

  auth.logout()
}

</script>

<template>

  <div class="min-h-screen bg-gray-100">

    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p class="text-sm text-gray-500">
            Manage blog posts
          </p>
        </div>

        <button type="button" class="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white hover:bg-gray-700"
          @click="logout">
          Logout
        </button>

      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-10">

      <div class="mb-6 flex items-center justify-end gap-4">
        <NuxtLink to="/admin/create" class="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
          Create Post
        </NuxtLink>
      </div>

      <p v-if="pending" class="text-gray-600">
        Loading posts...
      </p>

      <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load posts.
      </div>

      <div v-else-if="posts?.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <article v-for="post in posts" :key="post.id" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 class="text-xl font-bold text-gray-900">
            {{ post.title }}
          </h2>

          <p class="mt-3 text-gray-600">
            {{ post.content }}
          </p>

          <p class="mt-4 text-sm text-gray-400">
            Posted by {{ post.user?.name || 'Unknown' }}
          </p>

          <p class="mt-4 text-sm text-gray-400">
            {{ post.created_at ? `(Created on ${new Date(post.created_at).toLocaleDateString()})` : '' }}
          </p>
          <p class="mt-1 text-sm text-gray-400">
            {{ post.updated_at ? `(Updated on ${new Date(post.updated_at).toLocaleDateString()})` : '' }}
          </p>

          <div class="mt-6 flex gap-3">

            <NuxtLink :to="`/admin/${post.id}/edit`"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit
            </NuxtLink>

            <button type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              @click="deletePost(post.id)">
              Delete
            </button>

          </div>

        </article>

      </div>

      <div v-else class="rounded-xl bg-white p-10 text-center shadow-sm">
        <h2 class="text-xl font-semibold text-gray-900">
          No posts found
        </h2>

        <p class="mt-2 text-gray-500">
          Create your first blog post.
        </p>
      </div>

    </main>

  </div>

</template>