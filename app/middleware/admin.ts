export default defineNuxtRouteMiddleware(() => {

  const user = useCookie<any | null>('user')

  if (!user.value) {
    return navigateTo('/blogs')
  }

  if (user.value.role !== 'admin') {
    return navigateTo('/blogs')
  }

})