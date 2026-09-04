export const useAuth = () => {
    const token = useCookie<string | null>('token')
    const user = useCookie<any | null>('user')

    const login = (loginToken: string, loginUser: any) => {
        token.value = loginToken
        user.value = loginUser
    }

    const logout = () => {
        token.value = null
        user.value = null

        navigateTo('/login')
    }

    return {
        token,
        user,
        login,
        logout
    }
}