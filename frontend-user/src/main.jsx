import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Posts from './Posts.jsx'
import LogIn from './LogIn.jsx'

import App from './App.jsx'
import SignUp from './SignUp.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/posts',
    element: <Posts />,
  },
  {
    path: '/log-in',
    element: <LogIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
