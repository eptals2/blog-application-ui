export default defineNuxtRouteMiddleware(() => {

  const user = useCookie<any | null>('user')

  if (!user.value) {
    return navigateTo('/login')
  }

  if (user.value.role !== 'admin') {
    return navigateTo('/login')
  }

})