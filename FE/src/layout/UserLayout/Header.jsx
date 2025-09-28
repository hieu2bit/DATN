import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaHeart,
  FaClipboardCheck,
  FaStar,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import ProductService from "../../services/ProductService";

const Header = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Thêm state để kiểm soát dropdown
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const searchRef = useRef(null); // Ref cho khu vực tìm kiếm

  const { isLoggedIn, name } = useSelector((state) => state.user);
  console.log("Redux user state:", { isLoggedIn, name });

  // Xử lý tìm kiếm sản phẩm
  const fetchSuggestions = useCallback(async () => {
    if (!search.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false); // Đóng dropdown khi search rỗng
      return;
    }
    try {
      const response = await ProductService.getFilteredProducts({
        search,
        size: 5,
      });
      console.log("Dữ liệu gợi ý tìm kiếm:", response.content);
      setSuggestions(response.content || []);
      setIsDropdownOpen(true); // Mở dropdown khi có gợi ý
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  }, [search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchSuggestions]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  // Xử lý điều hướng đến trang chi tiết sản phẩm
  const handleViewProduct = async (productId) => {
    try {
      console.log("Lấy chi tiết sản phẩm với productId:", productId);
      const productDetails = await ProductService.getProductById(productId);
      console.log("Chi tiết sản phẩm:", productDetails);
      if (productDetails && productDetails.productCode) {
        navigate(`/view-product/${productDetails.productCode}`);
        setIsDropdownOpen(false); // Đóng dropdown khi chọn sản phẩm
      } else {
        alert("Không thể tìm thấy mã sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không thể xem chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

  // Đóng menu hoặc dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Đóng dropdown khi nhấp ra ngoài
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Xử lý khi input thay đổi
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      setIsDropdownOpen(false); // Đóng dropdown khi input rỗng
    }
  };

  return (
    <header className="border-b border-red-400 p-3 shadow-md bg-white">
      {/* Thanh trên cùng */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Bên trái - Chào mừng */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/src/assets/z6737412753522_56e64e962c6114e6dbb2406d51d47da3.jpg"
              alt="Logo"
              className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md"
            />
          </Link>
        </div>

        {/* Logo chính giữa */}
        <div className="flex justify-center flex-1">
          <h1 className="text-5xl font-extrabold text-black">
            Men's<span className="text-sky-900">Fashion Mộc Wear</span>
          </h1>
        </div>

        {/* Bên phải - Hamburger Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="flex items-center p-2 text-gray-600 hover:text-red-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
              {isLoggedIn ? (
                <>
                  <Link
                    to={`/personal`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-600 hover:text-white transition flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser /> {name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-600 hover:text-white transition flex items-center gap-1"
                  >
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white transition flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser /> Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-black transition flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    + Đăng ký
                  </Link>
                </>
              )}
              <Link
                to="https://maps.app.goo.gl/sDCQv1Dc7ZzCEht1A"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaMapMarkerAlt /> Cửa hàng
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="flex justify-center mt-3">
        <div className="relative w-1/2 flex items-center border border-gray-400 rounded-full px-4 py-2 bg-white" ref={searchRef}>
          <input
            type="text"
            placeholder="Bạn muốn tìm gì?"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-1 focus:outline-none"
          />
          <FaSearch className="text-gray-600 cursor-pointer" />
          {isDropdownOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto z-50">
              {suggestions.map((product) => (
                <div
                  onClick={() => handleViewProduct(product.id)}
                  key={product.id}
                  className="flex items-center p-2 hover:bg-gray-100 border-b cursor-pointer group relative"
                >
                  <img
                    src={product.photo}
                    alt={product.nameProduct}
                    className="w-14 h-14 object-cover mr-3 rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {product.nameProduct}
                    </p>
                    <p className="text-xs text-red-500 font-bold">
                      {product.salePrice}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu nhỏ dưới */}
      <div className="flex justify-center max-w-7xl mx-auto mt-4 gap-8 text-sm">
        <Link
          to="/home"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaHome size={20} />
          <span>Trang chủ</span>
        </Link>
        <Link
          to="/products"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaStar size={20} />
          <span>Sản Phẩm</span>
        </Link>
        <Link
          to="/cart"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaShoppingCart size={20} />
          <span>Giỏ hàng</span>
        </Link>
        <Link
          to="/order"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaClipboardCheck size={20} />
          <span>Đơn hàng</span>
        </Link>
        <Link
          to="/productsBanrd"
          className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
        >
          <FaHeart size={20} />
          <span>Bộ sưu tập</span>
        </Link>
        {isLoggedIn && (
          <Link
            to={`/personal`}
            className="relative flex flex-col items-center cursor-pointer hover:text-red-600"
          >
            <FaUser size={20} />
            <span>Cá nhân</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;