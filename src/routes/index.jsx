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
        path: "order/vnpay/success",
        async lazy() {
          let { VNPaySuccess } = await import("../pages/VNPaySuccess");
          return {
            Component: VNPaySuccess,
          };
        },
      },
      {
        path: "order/vnpay/error",
        async lazy() {
          let { VNPayFail } = await import("../pages/VNPayFail");
          return {
            Component: VNPayFail,
          };
        },
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
        path: "enter-email",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            async lazy() {
              let { EnterEmail } = await import("../pages/EnterEmail");
              return {
                Component: EnterEmail,
              };
            },
          },
        ],
      },
      {
        path: "reset-password",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            async lazy() {
              let { ResetPassword } = await import("../pages/ResetPassword");
              return {
                Component: ResetPassword,
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
            path: "product/filter",
            async lazy() {
              const { ProductFilterPage } = await import(
                "../pages/ProductFilterPage"
              );
              return { Component: ProductFilterPage };
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
          {
            path: "user/address",
            async lazy() {
              let { PersonalAddressPage } = await import(
                "../pages/PersonalAddressPage"
              );
              return {
                Component: PersonalAddressPage,
              };
            },
          },
          {
            path: "user/purchase",
            async lazy() {
              let { PersonalPurchase } = await import(
                "../pages/PersonalPurchase"
              );
              return {
                Component: PersonalPurchase,
              };
            },
          },
          {
            path: "/user/purchase/order/:orderId",
            async lazy() {
              let { OrderDetail } = await import("../pages/OrderDetail");
              return {
                Component: OrderDetail,
              };
            },
          },
        ],
      },
    ],
  },
]);

export default router;
