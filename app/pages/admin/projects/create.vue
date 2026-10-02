<script setup lang="ts">
definePageMeta({
    middleware: 'admin'
})

const api = useApi()

const name = ref('')
const description = ref('')

const loading = ref(false)
const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const createProject = async () => {
    error.value = ''
    validationErrors.value = {}
    loading.value = true

    try {
        const token = localStorage.getItem('token')

        await api('/projects', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                name: name.value,
                description: description.value
            }
        })

        await navigateTo('/admin/projects')
    } catch (err: any) {
        error.value =
            err?.data?.message ||
            'Failed to create project.'

        validationErrors.value =
            err?.data?.errors || {}
    } finally {
        loading.value = false
    }
}

const cancel = async () => {
    await navigateTo('/admin/projects')
}
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Header -->
        <header class="border-b bg-white">
            <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        Create Project
                    </h1>

                    <p class="mt-1 text-sm text-gray-500">
                        Add a new project to the system
                    </p>
                </div>

                <NuxtLink
                    to="/admin/projects"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    ← Back to Projects
                </NuxtLink>
            </div>
        </header>

        <!-- Form -->
        <main class="mx-auto max-w-5xl px-6 py-8">
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form
                    @submit.prevent="createProject"
                    class="space-y-6"
                >
                    <!-- General error -->
                    <div
                        v-if="error"
                        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {{ error }}
                    </div>

                    <!-- Project Name -->
                    <div>
                        <label
                            for="name"
                            class="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Project Name
                        </label>

                        <input
                            id="name"
                            v-model="name"
                            type="text"
                            placeholder="Enter project name"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p
                            v-if="validationErrors.name"
                            class="mt-1 text-sm text-red-600"
                        >
                            {{ validationErrors.name[0] }}
                        </p>
                    </div>

                    <!-- Description -->
                    <div>
                        <label
                            for="description"
                            class="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            v-model="description"
                            rows="5"
                            placeholder="Enter project description"
                            class="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        ></textarea>

                        <p
                            v-if="validationErrors.description"
                            class="mt-1 text-sm text-red-600"
                        >
                            {{ validationErrors.description[0] }}
                        </p>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <button
                            type="button"
                            @click="cancel"
                            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            :disabled="loading"
                            class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {{ loading ? 'Creating...' : 'Create Project' }}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>