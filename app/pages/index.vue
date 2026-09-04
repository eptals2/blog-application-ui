<script setup lang="ts">

const api = useApi()

const { data, error, pending } = await useAsyncData(
    'posts',
    () => api('/posts')
)

</script>

<template>
    <div class="min-h-screen bg-gray-100">

        <header class="border-b bg-white">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                <NuxtLink to="/" class="text-2xl font-bold text-gray-900">
                    Blog App
                </NuxtLink>

                <nav class="flex gap-6">
                    <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900">
                        Login
                    </NuxtLink>
                </nav>

            </div>
        </header>

        <main class="mx-auto max-w-6xl px-6 py-10">

            <h1 class="mb-8 text-4xl font-bold text-gray-900">
               Posts
            </h1>

            <p v-if="pending" class="text-gray-600">
                Loading posts...
            </p>

            <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                Failed to load posts. {{ error.message }}
            </div>

            <div v-else-if="data?.length" class="grid gap-6 md:grid-cols-1 lg:grid-cols-1">

                <article v-for="post in data" :key="post.id"
                    class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                    <h2 class="text-xl font-bold text-gray-900">
                        {{ post.title }}
                    </h2>

                    <p class="mt-2 text-sm text-gray-500">
                        By {{ post.user?.name || 'Unknown' }}
                    </p>

                    <p class="mt-4 text-gray-600">
                        {{ post.content }}
                    </p>

                    <p class="mt-4 text-xs text-gray-400">
                        {{ new Date(post.created_at).toLocaleDateString() }}
                    </p>

                    <NuxtLink :to="`/posts/${post.id}`"
                        class="mt-5 inline-block font-medium text-blue-600 hover:text-blue-800">
                        Read More →
                    </NuxtLink>

                </article>

            </div>

            <div v-else class="rounded-xl bg-white p-10 text-center shadow-sm">
                <h2 class="text-xl font-semibold">
                    No posts found
                </h2>
            </div>

        </main>

    </div>
</template>