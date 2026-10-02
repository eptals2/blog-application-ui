<script setup lang="ts">
const api = useApi()

const projects = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const search = ref('')
const sort = ref('created_at')
const direction = ref('desc')

const currentPage = ref(1)
const lastPage = ref(1)

const fetchProjects = async () => {
  loading.value = true
  error.value = ''

  try {
    const response: any = await api('/projects', {
      query: {
        search: search.value || undefined,
        sort: sort.value,
        direction: direction.value,
        page: currentPage.value,
        per_page: 10,
      },
    })

    projects.value = response.data
    currentPage.value = response.current_page
    lastPage.value = response.last_page
  } catch (err: any) {
    error.value =
      err?.data?.message || 'Failed to load projects.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})

const searchProjects = () => {
  currentPage.value = 1
  fetchProjects()
}

const changePage = (page: number) => {
  if (page < 1 || page > lastPage.value) {
    return
  }

  currentPage.value = page
  fetchProjects()
}

const deleteProject = async (id: number) => {
  if (!confirm('Are you sure you want to delete this project?')) {
    return
  }

  try {
    await api(`/projects/${id}`, {
      method: 'DELETE',
    })

    await fetchProjects()
  } catch (err: any) {
    error.value =
      err?.data?.message || 'Failed to delete project.'
  }
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          Projects
        </h1>

        <p class="text-gray-500">
          Manage your projects
        </p>
      </div>

      <NuxtLink
        to="/projects/create"
        class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        + Create Project
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search projects..."
        class="rounded border px-4 py-2"
        @keyup.enter="searchProjects"
      />

      <select
        v-model="sort"
        class="rounded border px-4 py-2"
        @change="searchProjects"
      >
        <option value="created_at">
          Created Date
        </option>

        <option value="name">
          Name
        </option>

        <option value="updated_at">
          Updated Date
        </option>
      </select>

      <select
        v-model="direction"
        class="rounded border px-4 py-2"
        @change="searchProjects"
      >
        <option value="desc">
          Descending
        </option>

        <option value="asc">
          Ascending
        </option>
      </select>

      <button
        class="rounded bg-gray-800 px-4 py-2 text-white"
        @click="searchProjects"
      >
        Search
      </button>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-4 rounded bg-red-100 p-4 text-red-700"
    >
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-10 text-center">
      Loading projects...
    </div>

    <!-- Table -->
    <div
      v-else
      class="overflow-hidden rounded-lg border bg-white"
    >
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left">
              Project
            </th>

            <th class="px-4 py-3 text-left">
              Description
            </th>

            <th class="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-t"
          >
            <td class="px-4 py-3 font-medium">
              {{ project.name }}
            </td>

            <td class="px-4 py-3 text-gray-600">
              {{ project.description }}
            </td>

            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/projects/${project.id}/edit`"
                  class="rounded bg-yellow-500 px-3 py-1 text-white"
                >
                  Edit
                </NuxtLink>

                <button
                  class="rounded bg-red-600 px-3 py-1 text-white"
                  @click="deleteProject(project.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="projects.length === 0">
            <td
              colspan="3"
              class="px-4 py-10 text-center text-gray-500"
            >
              No projects found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="lastPage > 1"
      class="mt-6 flex justify-center gap-2"
    >
      <button
        class="rounded border px-3 py-1 disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>

      <button
        v-for="page in lastPage"
        :key="page"
        class="rounded border px-3 py-1"
        :class="{
          'bg-blue-600 text-white': currentPage === page
        }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button
        class="rounded border px-3 py-1 disabled:opacity-50"
        :disabled="currentPage === lastPage"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>