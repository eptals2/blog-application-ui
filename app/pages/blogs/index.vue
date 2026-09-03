<script setup lang="ts">
type Post = {
	id: number
	title: string
	slug?: string
	excerpt?: string
	content?: string
	image?: string
	created_at?: string
}

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl || 'http://localhost:8000/api'

const { data, pending, error } = await useFetch<{ data?: Post[] } | Post[]>(
	`${apiUrl}/posts`,
)

const posts = computed<Post[]>(() => {
	const response = data.value
	return Array.isArray(response) ? response : response?.data || []
})

const postExcerpt = (post: Post) => {
	const text = post.excerpt || post.content || ''
	return text.replace(/<[^>]*>/g, '').slice(0, 160)
}
</script>

<template>
	<main class="blogs-page">
		<header class="page-header">
			<p class="eyebrow">Our blog</p>
			<h1>Latest posts</h1>
			<p>Read the latest stories, ideas, and updates.</p>
		</header>

		<p v-if="pending" class="state">Loading posts...</p>
		<p v-else-if="error" class="state error">Unable to load posts.</p>
		<p v-else-if="!posts.length" class="state">No posts found.</p>

		<section v-else class="posts-grid" aria-label="Blog posts">
			<article v-for="post in posts" :key="post.id" class="post-card">
				<img v-if="post.image" :src="post.image" :alt="post.title" class="post-image" />
				<div class="post-body">
					<time v-if="post.created_at" :datetime="post.created_at">
						{{ new Date(post.created_at).toLocaleDateString() }}
					</time>
					<h2>{{ post.title }}</h2>
					<p>{{ postExcerpt(post) }}</p>
					<NuxtLink :to="`/blogs/${post.slug || post.id}`">Read more</NuxtLink>
				</div>
			</article>
		</section>
	</main>
</template>

<style scoped>
.blogs-page { max-width: 1200px; margin: 0 auto; padding: 3rem 1.25rem; }
.page-header { margin-bottom: 2rem; }
.eyebrow { color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
h1 { margin: .25rem 0; font-size: clamp(2rem, 5vw, 3.5rem); }
.posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.post-card { overflow: hidden; border: 1px solid #e5e7eb; border-radius: 12px; background: white; }
.post-image { width: 100%; height: 190px; object-fit: cover; }
.post-body { padding: 1.25rem; }
.post-body time { color: #6b7280; font-size: .875rem; }
h2 { margin: .5rem 0; }
.post-body a { color: #2563eb; font-weight: 600; }
.state { padding: 2rem 0; }
.error { color: #dc2626; }
</style>
