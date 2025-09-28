import { lazy } from "react";

// 📌 Dashboard
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

// 📌 Bán hàng tại quầy: POS
const POS = lazy(() => import("../pages/admin/POS"));

// 📌 Quản lý khách hàng, nhân viên
const Customer = lazy(() => import("../pages/admin/Customer"));
const Employee = lazy(() => import("../pages/admin/Employee"));

// 📌 Quản lý sản phẩm và chi tiết
const Product = lazy(() => import("../pages/admin/Product"));
const CreateProduct = lazy(() => import("../pages/admin/CreateProduct/index"));
const ProductDetail = lazy(() => import("../pages/admin/ProductDetail/index"));

// 📌 Quản lý thuộc tính sản phẩm
const Brand = lazy(() => import("../pages/admin/Brand"));
const Material = lazy(() => import("../pages/admin/Material"));
const Collar = lazy(() => import("../pages/admin/Attribute/Collar"));
const Color = lazy(() => import("../pages/admin/Attribute/Color"));
const Size = lazy(() => import("../pages/admin/Attribute/Size"));
const Sleeve = lazy(() => import("../pages/admin/Attribute/Sleeve"));
const Promotion = lazy(() => import("../pages/admin/Attribute/Promotion"));

// 📌 Quản lý hóa đơn, voucher
const OrderPOS = lazy(() => import("../pages/admin/Order/OrderPOS")); // Sử dụng index.jsx cho Hóa đơn POS
const OrderOnline = lazy(() => import("../pages/admin/Order/OrderOnline")); // File mới cho Đơn hàng Online
const OrderPOSDetail = lazy(
  () => import("../pages/admin/Order/OrderPOSDetail")
);
const OrderOnlineDetail = lazy(
  () => import("../pages/admin/Order/OrderOnlineDetail")
);
const Voucher = lazy(() => import("../pages/admin/Voucher"));

// 📌 Quản lý danh mục, thống kê
const Category = lazy(() => import("../pages/admin/Category"));
const Statistic = lazy(() => import("../pages/admin/Statistics"));

const adminRoutes = [
  { path: "dashboard", component: Dashboard, role: ["ADMIN", "STAFF"] },
  { path: "salePOS", component: POS, role: ["ADMIN", "STAFF"] },
  { path: "customer", component: Customer, role: ["ADMIN", "STAFF"] },
  { path: "employee", component: Employee, role: ["ADMIN"] },
  { path: "product", component: Product, role: ["ADMIN", "STAFF"] },
  {
    path: "product/:productCode",
    component: ProductDetail,
    role: ["ADMIN", "STAFF"],
  },
  {
    path: "product/create",
    component: CreateProduct,
    role: ["ADMIN", "STAFF"],
  },
  { path: "brand", component: Brand, role: ["ADMIN", "STAFF"] },
  { path: "material", component: Material, role: ["ADMIN", "STAFF"] },
  { path: "category", component: Category, role: ["ADMIN", "STAFF"] },
  { path: "attribute/collar", component: Collar, role: ["ADMIN", "STAFF"] },
  { path: "attribute/color", component: Color, role: ["ADMIN", "STAFF"] },
  { path: "attribute/size", component: Size, role: ["ADMIN", "STAFF"] },
  { path: "attribute/sleeve", component: Sleeve, role: ["ADMIN", "STAFF"] },
  {
    path: "attribute/promotion",
    component: Promotion,
    role: ["ADMIN", "STAFF"],
  },
  { path: "order/pos", component: OrderPOS, role: ["ADMIN", "STAFF"] }, // Route cho Hóa đơn POS
  { path: "order/online", component: OrderOnline, role: ["ADMIN", "STAFF"] }, // Route cho Đơn hàng Online
  {
    path: "order/pos/:id/details",
    component: OrderPOSDetail,
    role: ["ADMIN", "STAFF"],
  }, // Chi tiết hóa đơn POS
  {
    path: "order/online/:id/details",
    component: OrderOnlineDetail,
    role: ["ADMIN", "STAFF"],
  }, // Chi tiết đơn hàng Online
  { path: "voucher", component: Voucher, role: ["ADMIN", "STAFF"] },
  { path: "statistics", component: Statistic, role: ["ADMIN"] },
];

export default adminRoutes;
