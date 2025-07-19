import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home";
import { Street } from "../pages/Street";
import { AppLayout } from "./AppLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/street",
        element: <Street />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
