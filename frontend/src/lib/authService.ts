export const isLoggedIn = () => {
    // Logic thực tế để kiểm tra token, cookie...
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
    if (match) {
        return match[2]
    }
    return null
}

export const login = () => {
    localStorage.setItem('token', 'fake-jwt-token')
}

export const logout = () => {
    localStorage.removeItem('token')
}
