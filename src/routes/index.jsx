import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import NotFound from "../pages/404";

// import Home from "../pages/Home";

export const Paths = {
  login: "/login",
};

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound></NotFound>,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            async lazy() {
              let { Home } = await import("../pages/Home");
              return {
                Component: Home,
              };
            },
          },
          {
            path: "login",
            async lazy() {
              let { Login } = await import("../pages/Login");
              return {
                Component: Login,
              };
            },
          },
          {
            path: 'product/:productId',
            async lazy(){
              let {ProductDetail} = await import("../pages/ProductDetail");
              return {
                Component: ProductDetail
              }
            }

          }
        ],
      },
    ],
  },

]);

export default router;
