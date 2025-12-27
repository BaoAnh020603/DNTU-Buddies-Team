import { Outlet } from 'react-router-dom'
import useScrollRestoration from '@/hooks/useScrollRestoration'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout() {
    useScrollRestoration()

    return (
        <AuthProvider>
            <Outlet />
            <Toaster />
        </AuthProvider>
    )
}
