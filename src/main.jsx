import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { AuthLayout, Login, PageLoader } from "./components/index.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

/* eslint-disable react-refresh/only-export-components */
const Home = lazy(() => import("./pages/Home.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const AllPosts = lazy(() => import("./pages/AllPosts.jsx"));
const AddPost = lazy(() => import("./pages/AddPost.jsx"));
const EditPost = lazy(() => import("./pages/EditPost.jsx"));
const Post = lazy(() => import("./pages/Post.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<PageLoader />}>
              <Signup />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}>
              <AllPosts />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}>
              <AddPost />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<PageLoader />}>
              <EditPost />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Post />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
