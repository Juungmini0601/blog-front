import { Outlet } from 'react-router'
import Header from '@/components/shared/Header.tsx'

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
