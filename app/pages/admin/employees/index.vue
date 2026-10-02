<script setup lang="ts">
definePageMeta({
    middleware: 'admin'
})

const api = useApi()

const employees = ref<any[]>([])

const loading = ref(false)
const error = ref('')

const search = ref('')
const currentPage = ref(1)
const lastPage = ref(1)

const token = () => localStorage.getItem('token')

const fetchEmployees = async () => {
    loading.value = true
    error.value = ''

    try {
        const response: any = await api('/employees', {
            headers: {
                Authorization: `Bearer ${token()}`,
            },
            query: {
                search: search.value || undefined,
                page: currentPage.value,
            },
        })

        console.log('Employees response:', response)

        employees.value = response.employees ?? []

        // Your current API does not return pagination information
        currentPage.value = 1
        lastPage.value = 1

    } catch (err: any) {
        console.error('Failed to load employees:', err)

        error.value =
            err?.data?.message ||
            'Failed to load employees.'
    } finally {
        loading.value = false
    }
}

const searchEmployees = () => {
    currentPage.value = 1
    fetchEmployees()
}

const clearSearch = () => {
    search.value = ''
    currentPage.value = 1
    fetchEmployees()
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchEmployees()
    }
}

const nextPage = () => {
    if (currentPage.value < lastPage.value) {
        currentPage.value++
        fetchEmployees()
    }
}

const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return
    }

    try {
        const token = localStorage.getItem('token')

        await api(`/employees/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        await fetchEmployees()
    } catch (err: any) {
        alert(
            err?.data?.message ||
            'Failed to delete employee.'
        )
    }
}

onMounted(() => {
    fetchEmployees()
})
</script>
{{employees}}
<template>
    <div class="min-h-screen bg-gray-100">

        <!-- Header -->
        <header class="border-b bg-white">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div>
                    <h1 class="text-xl font-bold text-gray-900">
                        Employees
                    </h1>

                    <p class="text-sm text-gray-500">
                        Manage employee records
                    </p>
                </div>

                <NuxtLink to="/admin" class="text-sm font-medium text-gray-600 hover:text-gray-900">
                    ← Dashboard
                </NuxtLink>
            </div>
        </header>

        <main class="mx-auto max-w-7xl px-6 py-8">

            <!-- Top actions -->
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                        Employee List
                    </h2>

                    <p class="text-sm text-gray-500">
                        Create, edit, and manage employees.
                    </p>
                </div>

                <NuxtLink to="/admin/employees/create"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    + Add Employee
                </NuxtLink>
            </div>

            <!-- Search -->
            <div class="mb-6 rounded-xl bg-white p-4 shadow-sm">
                <div class="flex flex-col gap-3 sm:flex-row">

                    <input v-model="search" type="text" placeholder="Search employees..."
                        class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        @keyup.enter="searchEmployees" />

                    <button type="button"
                        class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        @click="searchEmployees">
                        Search
                    </button>

                    <button v-if="search" type="button"
                        class="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        @click="clearSearch">
                        Clear
                    </button>

                </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ error }}
            </div>

            <!-- Loading -->
            <div v-if="loading" class="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                Loading employees...
            </div>

            <!-- Employee table -->
            <div v-else class="overflow-hidden rounded-xl bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">

                        <thead class="border-b bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Name
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Email
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Role
                                </th>

                                <th class="px-6 py-4 text-right font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y">
                            <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">
                                    {{ employee.name }}
                                </td>

                                <td class="px-6 py-4 text-gray-600">
                                    {{ employee.email }}
                                </td>

                                <td class="px-6 py-4 text-gray-600">
                                    {{ employee.role || 'employee' }}
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex justify-end gap-3">

                                        <NuxtLink :to="`/admin/employees/${employee.id}/edit`"
                                            class="font-medium text-blue-600 hover:text-blue-800">
                                            Edit
                                        </NuxtLink>

                                        <button type="button" class="font-medium text-red-600 hover:text-red-800"
                                            @click="deleteEmployee(employee.id)">
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>

                            <tr v-if="employees.length === 0">
                                <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="lastPage > 1" class="flex items-center justify-between border-t px-6 py-4">
                    <button type="button" :disabled="currentPage === 1"
                        class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                        @click="previousPage">
                        ← Previous
                    </button>

                    <span class="text-sm text-gray-600">
                        Page {{ currentPage }} of {{ lastPage }}
                    </span>

                    <button type="button" :disabled="currentPage === lastPage"
                        class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                        @click="nextPage">
                        Next →
                    </button>
                </div>

            </div>

        </main>
    </div>
</template>