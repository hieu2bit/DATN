import { lazy } from "react";

const ViewProductDetail = lazy(
  () => import("../pages/Users/ViewProductDetail.jsx")
);
const Home = lazy(() => import("../pages/Users/Home.jsx"));
const PersonalPage = lazy(() => import("../pages/Users/PersonalPage.jsx"));
const SearchPage = lazy(() => import("../pages/Users/SearchPage.jsx"));
const Cart = lazy(() => import("../pages/Users/Cart.jsx"));
const Products = lazy(() => import("../pages/Users/Products.jsx"));
const Payment = lazy(() => import("../pages/Users/Payment.jsx"));
const UserOder = lazy(() => import("../pages/Users/UserOrder.jsx"));
const ProductsBanrd = lazy(() => import("../pages/Users/ProductsBanrd.jsx"));
const userRouter = [
  { path: "home", component: Home, role: "CUSTOMER" },
  { path: "products", component: Products, role: "CUSTOMER" },
  {
    path: "view-product/:productCode",
    component: ViewProductDetail,
    role: "CUSTOMER",
  }, // Giữ nguyên nhưng sẽ công khai ở AppRouter
  { path: "personal", component: PersonalPage, role: "CUSTOMER" },
  { path: "search", component: SearchPage, role: "CUSTOMER" },
  { path: "cart", component: Cart, role: "CUSTOMER" },
  { path: "pay", component: Payment, role: "CUSTOMER" },
  { path: "order", component: UserOder, role: "CUSTOMER" },
  { path: "productsBanrd", component: ProductsBanrd, role: "CUSTOMER" },
];

export default userRouter;
