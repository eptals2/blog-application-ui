<script setup lang="ts">

const api = useApi()
const auth = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

interface User {
    id: number
    name: string
    email: string
    role: string
}

interface LoginResponse {
    message: string
    user: User
    token: string
}

const login = async () => {
    error.value = ''
    loading.value = true

    try {
        const response = await api<LoginResponse>('/login', {
            method: 'POST',

            body: {
                email: email.value,
                password: password.value
            }
        })

        auth.login(
            response.token,
            response.user
        )

        if (response.user.role === 'admin') {
            await navigateTo('/admin')
        } else {
            await navigateTo('/login')
        }

    } catch (err: any) {

        error.value =
            err?.data?.message ||
            'Failed to log in. Please check your credentials.'

    } finally {
        loading.value = false
    }
}

</script>

<template>

    <div class="min-h-screen bg-gray-100 flex items-center justify-center">

        <form
            class="w-full max-w-md rounded-xl bg-white p-8 shadow"
            @submit.prevent="login"
        >

            <h1 class="mb-6 text-2xl font-bold">
                Admin Login
            </h1>

            <label
                for="email"
                class="mb-2 block text-sm font-medium"
            >
                Email
            </label>

            <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="mb-4 w-full rounded-lg border px-4 py-2"
            />

            <label
                for="password"
                class="mb-2 block text-sm font-medium"
            >
                Password
            </label>

            <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                class="mb-4 w-full rounded-lg border px-4 py-2"
            />

            <p
                v-if="error"
                class="mb-4 text-sm text-red-600"
            >
                {{ error }}
            </p>

            <button
                type="submit"
                :disabled="loading"
                class="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
                {{ loading ? 'Logging in...' : 'Log in' }}
            </button>

        </form>

    </div>

</template>