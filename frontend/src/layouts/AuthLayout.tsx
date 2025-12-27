import { Outlet } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

export default function AuthLayout() {
    return (
        <>
            <Outlet />
            <Analytics />
        </>
    )
}
