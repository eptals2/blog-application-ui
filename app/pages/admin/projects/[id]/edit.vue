<script setup lang="ts">
definePageMeta({
    middleware: 'admin'
})

const route = useRoute()
const api = useApi()

const project = ref<any>(null)

const name = ref('')
const description = ref('')

const loading = ref(true)
const saving = ref(false)

const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const projectId = route.params.id

const fetchProject = async () => {
    loading.value = true
    error.value = ''

    try {
        const token = localStorage.getItem('token')

        const response = await api(`/projects/${projectId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        project.value = response.project ?? response

        name.value = project.value.name
        description.value = project.value.description || ''

    } catch (err: any) {
        error.value =
            err?.data?.message ||
            'Failed to load project.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchProject)

const updateProject = async () => {
    error.value = ''
    validationErrors.value = {}
    saving.value = true

    try {
        const token = localStorage.getItem('token')

        await api(`/projects/${projectId}`, {
            method: 'PUT',
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
            'Failed to update project.'

        validationErrors.value =
            err?.data?.errors || {}

    } finally {
        saving.value = false
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
            <div
                class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5"
            >
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        Edit Project
                    </h1>

                    <p class="mt-1 text-sm text-gray-500">
                        Update project information
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


        <!-- Loading -->
        <main
            v-if="loading"
            class="mx-auto max-w-5xl px-6 py-8"
        >
            <div
                class="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Loading project...
                </p>
            </div>
        </main>


        <!-- Error loading project -->
        <main
            v-else-if="error && !project"
            class="mx-auto max-w-5xl px-6 py-8"
        >
            <div
                class="rounded-xl border border-red-200 bg-red-50 p-6"
            >
                <h2 class="font-semibold text-red-800">
                    Unable to load project
                </h2>

                <p class="mt-1 text-sm text-red-600">
                    {{ error }}
                </p>

                <NuxtLink
                    to="/admin/projects"
                    class="mt-4 inline-block text-sm font-medium text-red-700 underline"
                >
                    Return to Projects
                </NuxtLink>
            </div>
        </main>


        <!-- Form -->
        <main
            v-else
            class="mx-auto max-w-5xl px-6 py-8"
        >
            <div
                class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >

                <form
                    @submit.prevent="updateProject"
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
                            required
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
                            rows="6"
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
                    <div
                        class="flex justify-end gap-3 border-t border-gray-200 pt-6"
                    >

                        <button
                            type="button"
                            @click="cancel"
                            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {{ saving ? 'Saving...' : 'Save Changes' }}
                        </button>

                    </div>

                </form>

            </div>
        </main>

    </div>
</template>