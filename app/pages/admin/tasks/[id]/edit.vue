<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
})

const route = useRoute()
const api = useApi()

const taskId = route.params.id

const projects = ref<any[]>([])
const employees = ref<any[]>([])

const projectId = ref('')
const employeeId = ref('')
const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref('Low')
const status = ref('Pending')

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const token = () => localStorage.getItem('token')

const loadData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [taskResponse, projectsResponse, employeesResponse]: any[] =
      await Promise.all([
        api(`/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }),

        api('/projects', {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }),

        api('/employees', {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        }),
      ])

    const task = taskResponse.task ?? taskResponse

    projectId.value = String(task.project_id ?? '')
    employeeId.value = task.employee_id
      ? String(task.employee_id)
      : ''

    title.value = task.title ?? ''
    description.value = task.description ?? ''
    dueDate.value = task.due_date ?? ''
    priority.value = task.priority ?? 'Low'
    status.value = task.status ?? 'Pending'

    projects.value =
      projectsResponse.data ?? projectsResponse

    employees.value =
      employeesResponse.data ?? employeesResponse
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to load task.'
  } finally {
    loading.value = false
  }
}

const updateTask = async () => {
  error.value = ''
  validationErrors.value = {}

  if (status.value === 'Completed' && !employeeId.value) {
    error.value =
      'A task cannot be completed without an assigned employee.'
    return
  }

  saving.value = true

  try {
    await api(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token()}`,
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
        status: status.value,
      },
    })

    await navigateTo('/admin/tasks')
  } catch (err: any) {
    validationErrors.value =
      err?.data?.errors || {}

    error.value =
      err?.data?.message ||
      'Failed to update task.'
  } finally {
    saving.value = false
  }
}

watch(status, (newStatus) => {
  if (newStatus === 'Completed' && !employeeId.value) {
    error.value =
      'A task cannot be completed without an assigned employee.'
  } else {
    error.value = ''
  }
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-6 py-8">
    <div class="mx-auto max-w-3xl">

      <div class="mb-6">
        <NuxtLink
          to="/admin/tasks"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Tasks
        </NuxtLink>

        <h1 class="mt-3 text-2xl font-bold text-gray-900">
          Edit Task
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Update the task information.
        </p>
      </div>

      <div
        v-if="loading"
        class="rounded-lg bg-white p-6 shadow"
      >
        <p class="text-gray-500">
          Loading task...
        </p>
      </div>

      <div
        v-else
        class="rounded-lg bg-white p-6 shadow"
      >

        <div
          v-if="error"
          class="mb-5 rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <!-- Project -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Project
          </label>

          <select
            v-model="projectId"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="" disabled>
              Select project
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
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Assign Employee
          </label>

          <select
            v-model="employeeId"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">
              No employee assigned
            </option>

            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee.id"
            >
              {{ employee.name }}
            </option>
          </select>

          <p
            v-if="validationErrors.employee_id"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.employee_id[0] }}
          </p>
        </div>

        <!-- Title -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Title
          </label>

          <input
            v-model="title"
            type="text"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter task title"
          />

          <p
            v-if="validationErrors.title"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.title[0] }}
          </p>
        </div>

        <!-- Description -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            v-model="description"
            rows="4"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter task description"
          ></textarea>

          <p
            v-if="validationErrors.description"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.description[0] }}
          </p>
        </div>

        <!-- Due Date -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Due Date
          </label>

          <input
            v-model="dueDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <p
            v-if="validationErrors.due_date"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.due_date[0] }}
          </p>
        </div>

        <!-- Priority -->
        <div class="mb-5">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Priority
          </label>

          <select
            v-model="priority"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <p
            v-if="validationErrors.priority"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.priority[0] }}
          </p>
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            v-model="status"
            class="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <p
            v-if="validationErrors.status"
            class="mt-1 text-sm text-red-600"
          >
            {{ validationErrors.status[0] }}
          </p>

          <p
            v-if="status === 'Completed' && !employeeId"
            class="mt-2 text-sm text-red-600"
          >
            A task cannot be completed without an assigned employee.
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <NuxtLink
            to="/admin/tasks"
            class="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </NuxtLink>

          <button
            type="button"
            :disabled="saving"
            @click="updateTask"
            class="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Update Task' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>