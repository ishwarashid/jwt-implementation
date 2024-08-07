import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import RootLayout from './layouts/RootLayout'
import Admin from './pages/Admin'
import Editor from './pages/Editor'
import Lounge from './pages/Lounge'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Links from './pages/Links'
import RequireAuth from './layouts/RequireAuth'
import Unauthorized from './pages/Unauthorized'
import PresistLogin from './layouts/PresistLogin'


const router = createBrowserRouter(

  createRoutesFromChildren(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Auth />} />
      <Route path="links" element={<Links />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />

      <Route element={<PresistLogin />}>
        <Route element={<RequireAuth allowedRoles={[2003]} />}>
          <Route path="home" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[2001]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[2001]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[2001]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route>

      </Route>

      <Route path='/unauthorized' element={<Unauthorized />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)
export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
