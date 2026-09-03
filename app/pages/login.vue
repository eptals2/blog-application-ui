<script setup lang="ts">
const config = useRuntimeConfig()
const credentials = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function login() {
	loading.value = true
	error.value = ''

	try {
		await $fetch('/sanctum/csrf-cookie', {
			baseURL: config.public.apiBase,
			credentials: 'include',
		})

		await $fetch('/api/login', {
			method: 'POST',
			baseURL: config.public.apiBase,
			body: credentials,
			credentials: 'include',
		})

		await navigateTo('/')
	} catch (err: any) {
		error.value = err?.data?.message || 'Unable to log in. Please check your details.'
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<main class="login-page">
		<form class="login-card" @submit.prevent="login">
			<h1>Log in</h1>
			<p class="subtitle">Welcome back</p>

			<label for="email">Email</label>
			<input id="email" v-model="credentials.email" type="email" autocomplete="email" required />

			<label for="password">Password</label>
			<input id="password" v-model="credentials.password" type="password" autocomplete="current-password" required />

			<p v-if="error" class="error" role="alert">{{ error }}</p>
			<button type="submit" :disabled="loading">
				{{ loading ? 'Logging in…' : 'Log in' }}
			</button>
		</form>
	</main>
</template>

<style scoped>
.login-page { min-height: 100vh; display: grid; place-items: center; padding: 1rem; background: #f4f6f8; }
.login-card { width: min(100%, 400px); display: grid; gap: .65rem; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 8px 30px #0001; }
h1 { margin: 0; color: #17202a; }
.subtitle { margin: 0 0 1rem; color: #68737d; }
label { font-weight: 600; color: #344054; }
input { padding: .75rem; border: 1px solid #ccd2d8; border-radius: 6px; font: inherit; }
button { margin-top: .75rem; padding: .75rem; border: 0; border-radius: 6px; color: white; background: #2563eb; font: inherit; cursor: pointer; }
button:disabled { opacity: .6; cursor: wait; }
.error { margin: .5rem 0 0; color: #c62828; }
</style>
