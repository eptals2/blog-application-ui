<script setup lang="ts">
definePageMeta({
    middleware: 'admin',
})

const api = useApi()

const tasks = ref<any[]>([])
const search = ref('')
const currentPage = ref(1)
const lastPage = ref(1)
const loading = ref(false)
const error = ref('')

const token = () => localStorage.getItem('token')

const fetchTasks = async () => {
    loading.value = true
    error.value = ''

    try {
        const response: any = await api('/tasks', {
            headers: {
                Authorization: `Bearer ${token()}`,
            },
            query: {
                search: search.value || undefined,
                page: currentPage.value,
            },
        })

        console.log('Tasks response:', response)

        tasks.value = response.tasks ?? []

        // Only use these if your API actually returns pagination data
        if (response.current_page) {
            currentPage.value = response.current_page
        }

        if (response.last_page) {
            lastPage.value = response.last_page
        } else {
            lastPage.value = 1
        }
    } catch (err: any) {
        console.error('Failed to load tasks:', err)

        error.value =
            err?.data?.message ||
            'Failed to load tasks.'
    } finally {
        loading.value = false
    }
}

const goToPage = (page: number) => {
    if (page < 1 || page > lastPage.value) return

    currentPage.value = page
    fetchTasks()
}

const deleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
        return
    }

    try {
        await api(`/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token()}`,
            },
        })

        await fetchTasks()
    } catch (err: any) {
        alert(
            err?.data?.message ||
            'Failed to delete task.'
        )
    }
}

const priorityClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-700'
        case 'medium':
            return 'bg-yellow-100 text-yellow-700'
        case 'low':
            return 'bg-green-100 text-green-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const statusClass = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'bg-green-100 text-green-700'
        case 'ongoing':
            return 'bg-blue-100 text-blue-700'
        case 'pending':
            return 'bg-yellow-100 text-yellow-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

onMounted(() => {
    fetchTasks()
})

watch(search, () => {
    currentPage.value = 1
    fetchTasks()
})
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mx-auto max-w-7xl">

            <!-- Header -->
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        Tasks
                    </h1>

                    <p class="mt-1 text-sm text-gray-600">
                        Manage project tasks and assignments.
                    </p>
                </div>

                <NuxtLink to="/admin/tasks/create"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    + Create Task
                </NuxtLink>
            </div>

            <!-- Search -->
            <div class="mb-6 rounded-lg bg-white p-4 shadow">
                <input v-model="search" type="text" placeholder="Search tasks..."
                    class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            <!-- Error -->
            <div v-if="error" class="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {{ error }}
            </div>

            <!-- Table -->
            <div class="overflow-hidden rounded-lg bg-white shadow">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">

                        <thead class="border-b bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Task
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Project
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Assignee
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Due Date
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Priority
                                </th>

                                <th class="px-6 py-4 font-semibold text-gray-700">
                                    Status
                                </th>

                                <th class="px-6 py-4 text-right font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y">

                            <!-- Loading -->
                            <tr v-if="loading">
                                <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                                    Loading tasks...
                                </td>
                            </tr>

                            <!-- Empty -->
                            <tr v-else-if="tasks.length === 0">
                                <td colspan="7" class="px-6 py-10 text-center text-gray-500">
                                    No tasks found.
                                </td>
                            </tr>

                            <!-- Tasks -->
                            <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-900">
                                        {{ task.title }}
                                    </div>

                                    <div v-if="task.description" class="mt-1 max-w-xs truncate text-xs text-gray-500">
                                        {{ task.description }}
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-gray-700">
                                    {{ task.project?.name || 'No project' }}
                                </td>

                                <td class="px-6 py-4 text-gray-700">
                                    {{ task.employee?.name || 'Unassigned' }}
                                </td>

                                <td class="px-6 py-4 text-gray-700">
                                    {{ task.due_date || 'No due date' }}
                                </td>

                                <td class="px-6 py-4">
                                    <span class="rounded-full px-3 py-1 text-xs font-medium"
                                        :class="priorityClass(task.priority)">
                                        {{ task.priority }}
                                    </span>
                                </td>

                                <td class="px-6 py-4">
                                    <span class="rounded-full px-3 py-1 text-xs font-medium"
                                        :class="statusClass(task.status)">
                                        {{ task.status }}
                                    </span>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex justify-end gap-3">

                                        <NuxtLink :to="`/admin/tasks/${task.id}/edit`"
                                            class="text-blue-600 hover:text-blue-800">
                                            Edit
                                        </NuxtLink>

                                        <button type="button" class="text-red-600 hover:text-red-800"
                                            @click="deleteTask(task.id)">
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="lastPage > 1" class="flex items-center justify-between border-t px-6 py-4">
                    <button type="button" :disabled="currentPage === 1"
                        class="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        @click="goToPage(currentPage - 1)">
                        Previous
                    </button>

                    <span class="text-sm text-gray-600">
                        Page {{ currentPage }} of {{ lastPage }}
                    </span>

                    <button type="button" :disabled="currentPage === lastPage"
                        class="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        @click="goToPage(currentPage + 1)">
                        Next
                    </button>
                </div>
            </div>

            <!-- Back -->
            <div class="mt-6">
                <NuxtLink to="/admin" class="text-sm text-gray-600 hover:text-gray-900">
                    ← Back to Dashboard
                </NuxtLink>
            </div>

        </div>
    </div>
</template>