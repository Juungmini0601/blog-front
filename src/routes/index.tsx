import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from '@/routes/pages/LoginPage.tsx'
import UserRegisterPage from '@/routes/pages/UserRegisterPage.tsx'
import DefaultLayout from '@/routes/layouts/Default.tsx'
import queryClient from '@/api/queryClient.ts'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalModal } from '@/components/GlobalModal.tsx'
import PostListPage from '@/routes/pages/PostListPage.tsx'
import SettingsPage from '@/routes/pages/Settings.tsx'
import PostCreatePage from '@/routes/pages/PostCreatePage.tsx'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <PostListPage />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/user/register',
        element: <UserRegisterPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '/post/create',
        element: <PostCreatePage />
      }
    ]
  }
])

export default function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
      <GlobalModal />
    </QueryClientProvider>
  )
}
