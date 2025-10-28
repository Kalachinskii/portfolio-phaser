import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home";
import { Street } from "../pages/Street";
import { AppLayout } from "./AppLayout";

const router = createHashRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/street", element: <Street /> },
      { path: "/Home", element: <Home /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
