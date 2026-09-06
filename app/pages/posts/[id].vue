<script setup lang="ts">

const route = useRoute()
const api = useApi()

const {
    data: post,
    error,
    pending
} = await useAsyncData(
    `post-${route.params.id}`,
    () => api(`/posts/${route.params.id}`)
)

</script>

<template>

    <div class="min-h-screen bg-gray-100">

        <Navbar />

        <main class="mx-auto max-w-4xl px-6 py-10">

            <AppLoading v-if="pending" message="Loading post" />

            <div v-else-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                Failed to load post.
            </div>

            <article v-else-if="post" class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

                <h1 class="text-4xl font-bold text-gray-900">
                    {{ post.title }}
                </h1>


                <div class="mt-4 text-sm text-gray-500">

                    <span>
                        By {{ post.user?.name || 'Unknown' }}
                    </span>

                    <span class="mx-2">
                        •
                    </span>

                    <span>
                        {{ new Date(post.created_at).toLocaleDateString() }}
                    </span>

                </div>


                <div class="my-8 border-t border-gray-200"></div>


                <p class="whitespace-pre-line text-lg leading-8 text-gray-700">
                    {{ post.content }}
                </p>


                <div class="mt-10">

                    <NuxtLink to="/" class="font-medium text-blue-600 hover:text-blue-800">
                        ← Back to Blogs
                    </NuxtLink>

                </div>

            </article>

        </main>

    </div>

</template>