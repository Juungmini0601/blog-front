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
import PostDetailPage from './pages/PostDetailPage'
import PostUpdatePage from '@/routes/pages/PostUpdatePage.tsx'
import MyBlogPage from '@/routes/pages/MyBlogPage.tsx'
import SeriesCreatePage from '@/routes/pages/SeriesCreatePage.tsx'
import SeriesEditPage from '@/routes/pages/SeriesEditPage.tsx'
import SearchPage from '@/routes/pages/SearchPage.tsx'
import PostDraftListPage from '@/routes/pages/PostDraftListPage.tsx'
import { requireAuth } from '@/routes/loader/requireAuth.ts'

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
        loader: requireAuth,
        element: <SettingsPage />
      },
      {
        path: '/post/create',
        loader: requireAuth,
        element: <PostCreatePage />
      },
      {
        path: '/post/:postId',
        element: <PostDetailPage />
      },
      {
        path: '/posts/:postId/update',
        loader: requireAuth,
        element: <PostUpdatePage />
      },
      {
        path: '/blog/:userId/posts',
        element: <MyBlogPage />
      },
      {
        path: '/series/create',
        loader: requireAuth,
        element: <SeriesCreatePage />
      },
      {
        path: '/series/:seriesId/edit',
        loader: requireAuth,
        element: <SeriesEditPage />
      },
      {
        path: '/blog/drafts',
        element: <PostDraftListPage />
      },
      {
        path: '/search',
        element: <SearchPage />
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
