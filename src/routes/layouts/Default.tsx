import { Outlet } from 'react-router'
import Header from '@/components/Header.tsx'

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
