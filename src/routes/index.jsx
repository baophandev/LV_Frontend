import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import NotFound from "../pages/404";
import AuthLayout from "../layout/AuthLayout";

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
        path: "login",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            async lazy() {
              let { Login } = await import("../pages/Login");
              return {
                Component: Login,
              };
            },
          },
        ],
      },
      {
        path: "register",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            async lazy() {
              let { Register } = await import("../pages/Register");
              return {
                Component: Register,
              };
            },
          },
        ],
      },
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
            path: "product/:productId",
            async lazy() {
              let { ProductDetail } = await import("../pages/ProductDetail");
              return {
                Component: ProductDetail,
              };
            },
          },
          {
            path: "category/:categoryId",
            async lazy() {
              let { Category } = await import("../pages/Category");
              return {
                Component: Category,
              };
            },
          },
          {
            path: "cart",
            async lazy() {
              let { Cart } = await import("../pages/Cart");
              return {
                Component: Cart,
              };
            },
          },
          {
            path: "user/account",
            async lazy() {
              let { PersonalPage } = await import("../pages/PersonalPage");
              return {
                Component: PersonalPage,
              };
            },
          },
        ],
      },
    ],
  },
]);

export default router;
