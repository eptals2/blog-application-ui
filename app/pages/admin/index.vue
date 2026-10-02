<script setup lang="ts">
definePageMeta({
    middleware: 'admin'
})

const api = useApi()

const user = ref<any>(null)

onMounted(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
        user.value = JSON.parse(storedUser)
    }
})

const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    await navigateTo('/login')
}
</script>

<template>
    <div class="min-h-screen bg-gray-100">

        <!-- Navbar -->
        <header class="border-b bg-white">
            <div
                class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
            >
                <div>
                    <h1 class="text-xl font-bold text-gray-900">
                        Project Task Management
                    </h1>
                </div>

                <div class="flex items-center gap-5">

                    <span class="text-sm text-gray-600">
                        {{ user?.name || 'Administrator' }}
                    </span>

                    <button
                        @click="logout"
                        class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </header>


        <!-- Main -->
        <main class="mx-auto max-w-7xl px-6 py-8">

            <!-- Welcome -->
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900">
                    Dashboard
                </h2>

                <p class="mt-1 text-gray-500">
                    Manage your projects, employees, and tasks.
                </p>
            </div>


            <!-- Statistics -->
            <div class="grid gap-6 md:grid-cols-3">

                <!-- Projects -->
                <NuxtLink
                    to="/admin/projects"
                    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div class="flex items-center justify-between">

                        <div>
                            <p class="text-sm font-medium text-gray-500">
                                Projects
                            </p>

                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                →
                            </p>
                        </div>

                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl"
                        >
                            📁
                        </div>

                    </div>

                    <p class="mt-4 text-sm text-blue-600">
                        Manage projects →
                    </p>
                </NuxtLink>


                <!-- Employees -->
                <NuxtLink
                    to="/admin/employees"
                    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div class="flex items-center justify-between">

                        <div>
                            <p class="text-sm font-medium text-gray-500">
                                Employees
                            </p>

                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                →
                            </p>
                        </div>

                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-xl"
                        >
                            👥
                        </div>

                    </div>

                    <p class="mt-4 text-sm text-green-600">
                        Manage employees →
                    </p>
                </NuxtLink>


                <!-- Tasks -->
                <NuxtLink
                    to="/admin/tasks"
                    class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                    <div class="flex items-center justify-between">

                        <div>
                            <p class="text-sm font-medium text-gray-500">
                                Tasks
                            </p>

                            <p class="mt-2 text-3xl font-bold text-gray-900">
                                →
                            </p>
                        </div>

                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl"
                        >
                            ✓
                        </div>

                    </div>

                    <p class="mt-4 text-sm text-purple-600">
                        Manage tasks →
                    </p>
                </NuxtLink>

            </div>

        </main>

    </div>
</template>