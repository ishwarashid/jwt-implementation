import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <main className='app'>
        <Outlet />
    </main>
  )
}
