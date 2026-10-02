<script setup lang="ts">
definePageMeta({
    middleware: 'admin'
})

const api = useApi()

const name = ref('')
const email = ref('')
const role = ref('employee')

const loading = ref(false)
const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const createEmployee = async () => {
    loading.value = true
    error.value = ''
    validationErrors.value = {}

    const token = localStorage.getItem('token')

    try {
        await api('/employees', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                name: name.value,
                email: email.value,
                role: role.value
            }
        })

        await navigateTo('/admin/employees')
    } catch (err: any) {
        error.value = err?.data?.message || 'Failed to create employee.'

        if (err?.data?.errors) {
            validationErrors.value = err.data.errors
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navbar -->
        <nav class="border-b bg-white">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div>
                    <h1 class="text-xl font-bold text-gray-900">
                        Project Task Management
                    </h1>
                    <p class="text-sm text-gray-500">
                        Create Employee
                    </p>
                </div>

                <NuxtLink to="/admin/employees"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Back to Employees
                </NuxtLink>
            </div>
        </nav>

        <!-- Content -->
        <main class="mx-auto max-w-3xl px-6 py-8">
            <div class="rounded-xl bg-white p-6 shadow-sm">
                <h2 class="mb-6 text-lg font-semibold text-gray-900">
                    Add Employee
                </h2>

                <!-- General error -->
                <div v-if="error"
                    class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {{ error }}
                </div>

                <form @submit.prevent="createEmployee" class="space-y-5">
                    <!-- Name -->
                    <div>
                        <label for="name" class="mb-2 block text-sm font-medium text-gray-700">
                            Name
                        </label>

                        <input id="name" v-model="name" type="text" placeholder="Enter employee name"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />

                        <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">
                            {{ validationErrors.name[0] }}
                        </p>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input id="email" v-model="email" type="email" placeholder="employee@example.com"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />

                        <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600">
                            {{ validationErrors.email[0] }}
                        </p>
                    </div>

                    <!-- Role -->
                    <div>
                        <label for="role" class="mb-2 block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <input id="role" v-model="role" type="text" placeholder="employee"
                            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />

                        <p class="mt-1 text-xs text-gray-500">
                            Default role is employee.
                        </p>

                        <p v-if="validationErrors.role" class="mt-1 text-sm text-red-600">
                            {{ validationErrors.role[0] }}
                        </p>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end gap-3 border-t pt-5">
                        <NuxtLink to="/admin/employees"
                            class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cancel
                        </NuxtLink>

                        <button type="submit" :disabled="loading"
                            class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {{ loading ? 'Creating...' : 'Create Employee' }}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>