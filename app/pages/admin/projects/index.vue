<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const api = useApi()

const projects = ref<any[]>([])

const search = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

const currentPage = ref(1)
const lastPage = ref(1)

const loading = ref(false)
const error = ref('')

const token = () => localStorage.getItem('token')

const fetchProjects = async () => {
  loading.value = true
  error.value = ''

  try {
    const response: any = await api('/projects', {
      headers: {
        Authorization: `Bearer ${token()}`
      },
      query: {
        search: search.value || undefined,
        sort_by: sortBy.value,
        sort_order: sortOrder.value,
        page: currentPage.value
      }
    })

    projects.value = response.data ?? response

    if (response.current_page) {
      currentPage.value = response.current_page
    }

    if (response.last_page) {
      lastPage.value = response.last_page
    }
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to load projects.'
  } finally {
    loading.value = false
  }
}

const searchProjects = () => {
  currentPage.value = 1
  fetchProjects()
}

const clearSearch = () => {
  search.value = ''
  currentPage.value = 1
  fetchProjects()
}

const changeSort = () => {
  currentPage.value = 1
  fetchProjects()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProjects()
  }
}

const nextPage = () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++
    fetchProjects()
  }
}

const deleteProject = async (id: number) => {
  if (!confirm('Are you sure you want to delete this project?')) {
    return
  }

  try {
    await api(`/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token()}`
      }
    })

    await fetchProjects()
  } catch (err: any) {
    alert(
      err?.data?.message ||
      'Failed to delete project.'
    )
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <header class="border-b bg-white">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Projects
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Manage projects and their tasks.
          </p>
        </div>

        <div class="flex gap-3">

          <NuxtLink
            to="/admin"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Dashboard
          </NuxtLink>

          <NuxtLink
            to="/admin/projects/create"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Create Project
          </NuxtLink>

        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">

      <!-- Search and sorting -->
      <div class="mb-6 rounded-xl bg-white p-4 shadow-sm">

        <div class="flex flex-col gap-4 lg:flex-row">

          <!-- Search -->
          <div class="flex flex-1 gap-2">

            <input
              v-model="search"
              type="text"
              placeholder="Search projects..."
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              @keyup.enter="searchProjects"
            />

            <button
              type="button"
              class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              @click="searchProjects"
            >
              Search
            </button>

            <button
              v-if="search"
              type="button"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="clearSearch"
            >
              Clear
            </button>

          </div>

          <!-- Sort -->
          <div class="flex gap-2">

            <select
              v-model="sortBy"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              @change="changeSort"
            >
              <option value="created_at">
                Created Date
              </option>

              <option value="name">
                Name
              </option>
            </select>

            <select
              v-model="sortOrder"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              @change="changeSort"
            >
              <option value="desc">
                Descending
              </option>

              <option value="asc">
                Ascending
              </option>
            </select>

          </div>

        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <!-- Projects -->
      <div class="overflow-hidden rounded-xl bg-white shadow-sm">

        <div class="overflow-x-auto">

          <table class="w-full text-left text-sm">

            <thead class="border-b bg-gray-50">
              <tr>

                <th class="px-6 py-4 font-semibold text-gray-700">
                  Project
                </th>

                <th class="px-6 py-4 font-semibold text-gray-700">
                  Description
                </th>

                <th class="px-6 py-4 font-semibold text-gray-700">
                  Created
                </th>

                <th class="px-6 py-4 text-right font-semibold text-gray-700">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody class="divide-y">

              <!-- Loading -->
              <tr v-if="loading">

                <td
                  colspan="4"
                  class="px-6 py-10 text-center text-gray-500"
                >
                  Loading projects...
                </td>

              </tr>

              <!-- Empty -->
              <tr v-else-if="projects.length === 0">

                <td
                  colspan="4"
                  class="px-6 py-10 text-center text-gray-500"
                >
                  No projects found.
                </td>

              </tr>

              <!-- Project rows -->
              <tr
                v-for="project in projects"
                :key="project.id"
                class="hover:bg-gray-50"
              >

                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">
                    {{ project.name }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <p class="max-w-lg truncate text-gray-600">
                    {{ project.description || 'No description' }}
                  </p>
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ project.created_at }}
                </td>

                <td class="px-6 py-4">
                  <div class="flex justify-end gap-3">

                    <NuxtLink
                      :to="`/admin/projects/${project.id}/edit`"
                      class="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </NuxtLink>

                    <button
                      type="button"
                      class="font-medium text-red-600 hover:text-red-800"
                      @click="deleteProject(project.id)"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        <!-- Pagination -->
        <div
          v-if="lastPage > 1"
          class="flex items-center justify-between border-t px-6 py-4"
        >

          <button
            type="button"
            :disabled="currentPage === 1"
            class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="previousPage"
          >
            ← Previous
          </button>

          <span class="text-sm text-gray-600">
            Page {{ currentPage }} of {{ lastPage }}
          </span>

          <button
            type="button"
            :disabled="currentPage === lastPage"
            class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="nextPage"
          >
            Next →
          </button>

        </div>

      </div>

    </main>

  </div>
</template>