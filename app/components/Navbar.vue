<template>
  <header class="border-b bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

      <NuxtLink
        to="/"
        class="text-2xl font-bold text-gray-900"
      >
        Blog App
      </NuxtLink>

      <nav class="flex gap-6">

        <NuxtLink
          to="/"
          class="text-gray-600 hover:text-gray-900"
        >
          Home
        </NuxtLink>

        <NuxtLink
          to="/login"
          class="text-gray-600 hover:text-gray-900"
        >
          Login
        </NuxtLink>

      </nav>

    </div>
  </header>
</template>