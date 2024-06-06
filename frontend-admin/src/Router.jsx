import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useState, useContext } from "react";
import Posts from './Posts.jsx'
import LogIn from './LogIn.jsx'
import PostDetail from "./PostDetail.jsx";
import UnpublishedPosts from "./UnpublishedPosts.jsx";

import App from './App.jsx'
import NewPost from "./NewPost.jsx";
import PostEdit from "./PostEdit.jsx";
import PostDelete from "./PostDelete.jsx";


export default function Router() {

    const router = createBrowserRouter([
        {
          path: "/",
          element: <Posts />,
        },
        {
          path:'/drafts',
          element: <UnpublishedPosts />
        },
        {
          path: '/posts',
          element: <Posts />,
        },
        {
          path:"/edit/:postid",
          element: <PostEdit />
        },
        {
          path: '/log-in',
          element: <LogIn />,
        },
        {
            path: '/posts/:postid',
            element: <PostDetail />
        },
        {
          path: '/new-post',
          element: <NewPost />
        },
        {
          path: '/delete/:postid',
          element: <PostDelete />,
        }
      ]);

      return <RouterProvider router={router} />
}