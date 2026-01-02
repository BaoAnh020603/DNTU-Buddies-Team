import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/features/auth/LoginPage'

// Lazy Loading các components
const RootLayout = lazy(() => import('../layouts/RootLayout'))
const HomeLayout = lazy(() => import('@/layouts/HomeLayout'))
const HomePage = lazy(() => import('../features/home/pages/HomePage'))
const MembersPage = lazy(() => import('../features/members/pages/MembersPage'))
const MemberDetailPage = lazy(() => import('../features/members/pages/MemberDetailPage'))
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'))
const MemberFormPage = lazy(() => import('../features/admin/pages/MemberFormPage'))
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'))
const GalleryPage = lazy(() => import('../features/gallery/pages/GalleryPage'))
const NotFound = lazy(() => import('../features/not-found/NotFound'))

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <HomeLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: 'members',
                        element: <MembersPage />,
                    },
                    {
                        path: 'members/:id',
                        element: <MemberDetailPage />,
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'gallery',
                        element: <GalleryPage />,
                    },
                    {
                        path: 'admin',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'admin/members/create',
                        element: <MemberFormPage />,
                    },
                    {
                        path: 'admin/members/edit/:id',
                        element: <MemberFormPage />,
                    },
                ],
            },
            {
                path: '/auth',
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <LoginPage />,
                    },
                ],
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
