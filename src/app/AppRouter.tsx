import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "../pages/Home";
import { Street } from "../pages/Street";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/street",
    element: <Street />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
