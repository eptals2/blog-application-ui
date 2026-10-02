<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const api = useApi()

const projects = ref<any[]>([])
const employees = ref<any[]>([])

const projectId = ref('')
const employeeId = ref('')
const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref('Low')
const status = ref('Pending')

const loading = ref(false)
const loadingData = ref(true)

const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const token = () => localStorage.getItem('token')

const fetchFormData = async () => {
  loadingData.value = true
  error.value = ''

  try {
    const [projectsResponse, employeesResponse]: any[] =
      await Promise.all([
        api('/projects', {
          headers: {
            Authorization: `Bearer ${token()}`
          }
        }),

        api('/employees', {
          headers: {
            Authorization: `Bearer ${token()}`
          }
        })
      ])

    projects.value = projectsResponse.data ?? projectsResponse
    employees.value = employeesResponse.data ?? employeesResponse
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to load projects and employees.'
  } finally {
    loadingData.value = false
  }
}

const createTask = async () => {
  error.value = ''
  validationErrors.value = {}

  // Client-side protection
  if (status.value === 'Completed' && !employeeId.value) {
    error.value =
      'A task cannot be completed without an assigned employee.'

    return
  }

  loading.value = true

  try {
    await api('/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token()}`
      },
      body: {
        project_id: Number(projectId.value),
        employee_id: employeeId.value
          ? Number(employeeId.value)
          : null,
        title: title.value,
        description: description.value,
        due_date: dueDate.value,
        priority: priority.value,
        status: status.value
      }
    })

    await navigateTo('/admin/tasks')
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to create task.'

    validationErrors.value =
      err?.data?.errors || {}
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  if (status.value === 'Completed' && !employeeId.value) {
    status.value = 'Pending'

    error.value =
      'An employee must be assigned before a task can be completed.'
  }
}

onMounted(() => {
  fetchFormData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Header -->
    <header class="border-b bg-white">
      <div
        class="mx-auto flex max-w-4xl items-center justify-between px-6 py-5"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Create Task
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Create and assign a project task.
          </p>
        </div>

        <NuxtLink
          to="/admin/tasks"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back to Tasks
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-6 py-8">

      <!-- Loading -->
      <div
        v-if="loadingData"
        class="rounded-xl bg-white p-10 text-center shadow-sm"
      >
        <p class="text-sm text-gray-500">
          Loading form...
        </p>
      </div>

      <!-- Form -->
      <div
        v-else
        class="rounded-xl bg-white p-6 shadow-sm"
      >

        <!-- Error -->
        <div
          v-if="error"
          class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <form
          @submit.prevent="createTask"
          class="space-y-6"
        >

          <!-- Project -->
          <div>
            <label
              for="project"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Project
            </label>

            <select
              id="project"
              v-model="projectId"
              required
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                Select a project
              </option>

              <option
                v-for="project in projects"
                :key="project.id"
                :value="project.id"
              >
                {{ project.name }}
              </option>
            </select>

            <p
              v-if="validationErrors.project_id"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.project_id[0] }}
            </p>
          </div>

          <!-- Employee -->
          <div>
            <label
              for="employee"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Assign Employee
            </label>

            <select
              id="employee"
              v-model="employeeId"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Unassigned
              </option>

              <option
                v-for="employee in employees"
                :key="employee.id"
                :value="employee.id"
              >
                {{ employee.name }}
              </option>
            </select>

            <p class="mt-1 text-xs text-gray-500">
              An employee is required before a task can be completed.
            </p>

            <p
              v-if="validationErrors.employee_id"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.employee_id[0] }}
            </p>
          </div>

          <!-- Title -->
          <div>
            <label
              for="title"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              v-model="title"
              type="text"
              required
              placeholder="Enter task title"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p
              v-if="validationErrors.title"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.title[0] }}
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
              placeholder="Describe the task..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            ></textarea>

            <p
              v-if="validationErrors.description"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.description[0] }}
            </p>
          </div>

          <!-- Due Date -->
          <div>
            <label
              for="due_date"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>

            <input
              id="due_date"
              v-model="dueDate"
              type="date"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p
              v-if="validationErrors.due_date"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.due_date[0] }}
            </p>
          </div>

          <!-- Priority -->
          <div>
            <label
              for="priority"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Priority
            </label>

            <select
              id="priority"
              v-model="priority"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>

            <p
              v-if="validationErrors.priority"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.priority[0] }}
            </p>
          </div>

          <!-- Status -->
          <div>
            <label
              for="status"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              v-model="status"
              @change="handleStatusChange"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            <p class="mt-1 text-xs text-gray-500">
              Completed tasks must have an assigned employee.
            </p>

            <p
              v-if="validationErrors.status"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.status[0] }}
            </p>
          </div>

          <!-- Buttons -->
          <div
            class="flex justify-end gap-3 border-t border-gray-200 pt-6"
          >
            <NuxtLink
              to="/admin/tasks"
              class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </NuxtLink>

            <button
              type="submit"
              :disabled="loading"
              class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ loading ? 'Creating...' : 'Create Task' }}
            </button>
          </div>

        </form>
      </div>

    </main>
  </div>
</template>