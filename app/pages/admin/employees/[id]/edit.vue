<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const route = useRoute()
const api = useApi()

const employee = ref<any>(null)

const name = ref('')
const email = ref('')
const role = ref('employee')

const loading = ref(true)
const saving = ref(false)

const error = ref('')
const validationErrors = ref<Record<string, string[]>>({})

const employeeId = route.params.id

const fetchEmployee = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')

    const response: any = await api(`/employees/${employeeId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    employee.value = response.employee ?? response

    name.value = employee.value.name
    email.value = employee.value.email
    role.value = employee.value.role || 'employee'
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Failed to load employee.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEmployee()
})

const updateEmployee = async () => {
  error.value = ''
  validationErrors.value = {}
  saving.value = true

  try {
    const token = localStorage.getItem('token')

    await api(`/employees/${employeeId}`, {
      method: 'PUT',
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
    error.value =
      err?.data?.message ||
      'Failed to update employee.'

    validationErrors.value =
      err?.data?.errors || {}
  } finally {
    saving.value = false
  }
}

const cancel = async () => {
  await navigateTo('/admin/employees')
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
            Edit Employee
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Update employee information
          </p>
        </div>

        <NuxtLink
          to="/admin/employees"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back to Employees
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
          Loading employee...
        </p>
      </div>
    </main>

    <!-- Loading error -->
    <main
      v-else-if="error && !employee"
      class="mx-auto max-w-5xl px-6 py-8"
    >
      <div
        class="rounded-xl border border-red-200 bg-red-50 p-6"
      >
        <h2 class="font-semibold text-red-800">
          Unable to load employee
        </h2>

        <p class="mt-1 text-sm text-red-600">
          {{ error }}
        </p>

        <NuxtLink
          to="/admin/employees"
          class="mt-4 inline-block text-sm font-medium text-red-700 underline"
        >
          Return to Employees
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
          @submit.prevent="updateEmployee"
          class="space-y-6"
        >

          <!-- General error -->
          <div
            v-if="error"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ error }}
          </div>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p
              v-if="validationErrors.name"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.name[0] }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p
              v-if="validationErrors.email"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.email[0] }}
            </p>
          </div>

          <!-- Role -->
          <div>
            <label
              for="role"
              class="mb-2 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <input
              id="role"
              v-model="role"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p class="mt-1 text-xs text-gray-500">
              Default role is employee.
            </p>

            <p
              v-if="validationErrors.role"
              class="mt-1 text-sm text-red-600"
            >
              {{ validationErrors.role[0] }}
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