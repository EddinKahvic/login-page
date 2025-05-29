import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Feed from './features/feed/pages/Feed'
import Login from './features/authentication/login/login'
import Signup from './features/authentication/signup/signup'
import ResetPassword from './features/authentication/resetPassword/resetPassword'
import VerifyEmail from './features/authentication/verifyEmail/verifyEmail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Feed />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/request-password-reset',
    element: <ResetPassword />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
