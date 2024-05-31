import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useContext } from "react";
import Posts from './Posts.jsx'
import LogIn from './LogIn.jsx'
import SignUp from './SignUp.jsx'
import PostDetail from "./PostDetail.jsx";

import App from './App.jsx'


export default function Router() {

    const [username, setUsername] = useState('')

    const router = createBrowserRouter([
        {
          path: "/",
          element: <App username={username} setUsername={setUsername} />,
        },
        {
          path: '/posts',
          element: <Posts username={username} setUsername={setUsername} />,
        },
        {
          path: '/log-in',
          element: <LogIn username={username} setUsername={setUsername} />,
        },
        {
          path: '/sign-up',
          element: <SignUp username={username} setUsername={setUsername} />
        },
        {
            path: '/posts/:postid',
            element: <PostDetail username={username} />
        }
      ]);

      return <RouterProvider router={router} />
}