import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaUserTie,
  FaUsers,
  FaBoxOpen,
  FaCubes,
  FaTags,
  FaThLarge,
  FaTshirt,
  FaPalette,
  FaRulerCombined,
  FaCloudSun,
  FaTrademark,
  FaClipboardList,
  FaMoneyBillWave,
  FaChevronDown,
  FaChartBar,
  FaCashRegister,
  FaRegPlusSquare,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showOrderMenu, setShowOrderMenu] = useState(false); // Thêm state cho menu Quản lý hóa đơn

  const toggleMenu = (menu) => {
    if (menu === "product") setShowProductMenu(!showProductMenu);
    if (menu === "account") setShowAccountMenu(!showAccountMenu);
    if (menu === "order") setShowOrderMenu(!showOrderMenu); // Toggle menu Quản lý hóa đơn
  };

  const productItems = [
    { label: "Thông tin sản phẩm", icon: <FaTshirt />, path: "/admin/product" },
    {
      label: "Thêm sản phẩm chi tiết",
      icon: <FaRegPlusSquare />,
      path: "/admin/product/create",
    },
    { label: "Thương hiệu", icon: <FaTrademark />, path: "/admin/brand" },
    { label: "Chất liệu", icon: <FaCubes />, path: "/admin/material" },
    { label: "Cổ áo", icon: <FaThLarge />, path: "/admin/attribute/collar" },
    { label: "Màu sắc", icon: <FaPalette />, path: "/admin/attribute/color" },
    {
      label: "Kích thước",
      icon: <FaRulerCombined />,
      path: "/admin/attribute/size",
    },
    { label: "Tay áo", icon: <FaCloudSun />, path: "/admin/attribute/sleeve" },
    {
      label: "Khuyến mãi",
      icon: <FaTags />,
      path: "/admin/attribute/promotion",
    },
  ];

  const accountItems = [
    { label: "Nhân viên", icon: <FaUserTie />, path: "/admin/employee" },
    { label: "Khách hàng", icon: <FaUsers />, path: "/admin/customer" },
  ];

  const orderItems = [
    {
      label: "Hóa đơn POS",
      icon: <FaCashRegister />,
      path: "/admin/order/pos",
    },
    {
      label: "Đơn hàng Online",
      icon: <FaClipboardList />,
      path: "/admin/order/online",
    },
  ];

  return (
    <div
      className={`bg-white text-dark min-h-screen transition-all ${collapsed ? "w-16" : "w-60"} flex flex-col shadow-lg px-3 py-2 overflow-y-auto`}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center py-4 cursor-pointer border-b border-gray-700"
        onClick={() => setCollapsed(!collapsed)}
      >
        <img
          src="/src/assets/z6737412753522_56e64e962c6114e6dbb2406d51d47da3.jpg"
          className={`transition-all ${collapsed ? "w-8" : "w-24"}`}
        />
      </div>

      {/* Menu */}
      <ul className="flex-1 space-y-2 mt-4">
        <li>
          <Link
            to="/admin/salePOS"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === "/admin/salePOS" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            <FaCashRegister /> {!collapsed && <span>Bán hàng POS</span>}
          </Link>
        </li>

        {/* Quản lý hóa đơn */}
        <li>
          <div
            className="flex items-center justify-between p-3 hover:bg-gray-200 transition rounded-lg cursor-pointer"
            onClick={() => toggleMenu("order")}
          >
            <span className="flex items-center gap-3">
              <FaClipboardList /> {!collapsed && <span>Quản lý hóa đơn</span>}
            </span>
            {!collapsed && (
              <FaChevronDown
                className={`transition-transform ${showOrderMenu ? "rotate-180" : ""}`}
              />
            )}
          </div>
          {!collapsed && showOrderMenu && (
            <ul className="pl-6 space-y-2">
              {orderItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition ${location.pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Quản lý sản phẩm */}
        <li>
          <div
            className="flex items-center justify-between p-3 hover:bg-gray-200 transition rounded-lg cursor-pointer"
            onClick={() => toggleMenu("product")}
          >
            <span className="flex items-center gap-3">
              <FaBoxOpen /> {!collapsed && <span>Quản lý sản phẩm</span>}
            </span>
            {!collapsed && (
              <FaChevronDown
                className={`transition-transform ${showProductMenu ? "rotate-180" : ""}`}
              />
            )}
          </div>
          {!collapsed && showProductMenu && (
            <ul className="pl-6 space-y-2">
              {productItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition ${location.pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Quản lý tài khoản */}
        <li>
          <div
            className="flex items-center justify-between p-3 hover:bg-gray-200 transition rounded-lg cursor-pointer"
            onClick={() => toggleMenu("account")}
          >
            <span className="flex items-center gap-3">
              <FaUsers /> {!collapsed && <span>Quản lý tài khoản</span>}
            </span>
            {!collapsed && (
              <FaChevronDown
                className={`transition-transform ${showAccountMenu ? "rotate-180" : ""}`}
              />
            )}
          </div>
          {!collapsed && showAccountMenu && (
            <ul className="pl-6 space-y-2">
              {accountItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition ${location.pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <Link
            to="/admin/voucher"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === "/admin/voucher" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            <FaMoneyBillWave /> {!collapsed && <span>Quản lý voucher</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/statistics"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === "/admin/statistics" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            <FaChartBar /> {!collapsed && <span>Thống kê</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
