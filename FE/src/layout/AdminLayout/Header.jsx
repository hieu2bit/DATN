import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";
import LoginInfoService from "../../services/LoginInfoService";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { isLoggedIn } = useSelector((state) => state.user);

  // Lấy thông tin user khi login
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await LoginInfoService.getCurrentUser();
        setUserInfo(user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    if (isLoggedIn) fetchUserInfo();
  }, [isLoggedIn]);

  // Ẩn menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowMenu(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setShowMenu(false);
  };

  return (
    <div className="bg-white text-dark flex justify-between items-center px-6 py-3 shadow-md">
      <h1 className="text-3xl text-black font-semibold"></h1>

      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 text-dark hover:text-gray-500"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <FaUserCircle className="text-2xl" />
          <span className="hidden sm:inline">{userInfo?.fullname || "ADMIN"}</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Hồ sơ cá nhân
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        )}

        {/* Modal thông tin cá nhân */}
        {showProfile && userInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/5">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thông tin cá nhân</h2>
              <div className="space-y-2">
                <p><strong>Họ và tên:</strong> {userInfo?.fullname || "N/A"}</p>
                <p><strong>Email:</strong> {userInfo?.email || "N/A"}</p>
                <p><strong>Số điện thoại:</strong> {userInfo?.phone || "N/A"}</p>
                <p><strong>Mã nhân viên:</strong> {userInfo?.employeeCode || "N/A"}</p>
                <p><strong>Quyền:</strong> {userInfo?.role?.name || "N/A"}</p>
                <p><strong>Địa chỉ:</strong> {userInfo?.address || "N/A"}</p>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setShowProfile(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
