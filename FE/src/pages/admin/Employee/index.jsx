import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiFillCaretUp, AiFillCaretDown, AiOutlineEdit } from "react-icons/ai";
import { TiLockOpen } from "react-icons/ti";
import Switch from "react-switch";
import EmployeeService from "../../../services/EmployeeService";
import { toast } from "react-toastify";
import UpdateModal from "./components/UpdateModal";
import CreateModal from "./components/CreateModal";
import UpdatePasswordModal from "./components/UpdatePasswordModal";

export default function Employee() {
  const { role } = useSelector((state) => state.user);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [updateModal, setUpdateModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [passwordModal, setPasswordModal] = useState(false);

  // Kiểm tra vai trò ngay khi component được render
  if (role !== "ADMIN") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-bold">
          Vui lòng đăng nhập dưới quyền ADMIN
        </div>
      </div>
    );
  }

  const fetchEmployees = async () => {
    try {
      const { content, totalPages } = await EmployeeService.getAll(
        currentPage,
        pageSize,
        search,
        sortConfig.key,
        sortConfig.direction
      );
      setEmployees(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.response?.status === 403) {
        toast.error("Vui lòng đăng nhập dưới quyền ADMIN");
      } else {
        toast.error("Không thể tải danh sách nhân viên. Vui lòng thử lại!");
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize, search, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleUpdateEmployee = (employee) => {
    setCurrentEmployee(employee);
    setUpdateModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await EmployeeService.toggleStatus(id);
      const updatedItems = employees.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      );
      setEmployees(updatedItems);
      toast.success("Thay đổi trạng thái nhân viên thành công!");
    } catch (error) {
      console.error("Error toggling employee status:", error);
      toast.error("Không thể thay đổi trạng thái nhân viên. Vui lòng thử lại!");
    }
  };

  const renderRows = () => {
    const sortedItems = [...employees].sort((a, b) => {
      if (sortConfig.key === null) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortedItems.map((item, index) => (
      <tr
        key={item.id}
        className="bg-white hover:bg-gray-100 transition-colors"
      >
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{item.employeeCode}</td>
        <td className="px-4 py-2 flex items-center">
          <img src={item.photo} className="w-8 h-8 rounded-full mr-2" />
          {item.username}
        </td>
        <td className="px-4 py-2">{item.fullname}</td>
        <td className="px-4 py-2">{item.role.name}</td>
        <td className="px-4 py-2">{item.email}</td>
        <td className="px-4 py-2">{item.phone}</td>
        <td className="px-4 py-2">{item.gender ? "Nam" : "Nữ"}</td>
        <td
          className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}
        >
          <span className="status-dot"></span>
          {item.status ? " Kích hoạt" : " Ngừng hoạt động"}
        </td>
        <td className="px-4 py-2 flex justify-center gap-4">
          <button
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
            onClick={() => handleUpdateEmployee(item)}
          >
            <AiOutlineEdit size={20} />
          </button>
          <Switch
            onChange={() => handleToggleStatus(item.id)}
            checked={Boolean(item.status)}
            height={20}
            width={40}
            onColor="#1E90FF"
          />
          <button
            title="Đổi mật khẩu"
            onClick={() => {
              setCurrentEmployee(item);
              setPasswordModal(true);
            }}
          >
            <TiLockOpen className="text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors" size={20} />
          </button>
        </td>
      </tr>
    ));
  };

  const renderSortableHeader = (label, sortKey) => {
    const isSorted = sortConfig.key === sortKey;
    const isAscending = isSorted && sortConfig.direction === "asc";

    return (
      <th
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors relative"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center justify-center">
          {label}
          <div className="ml-2 flex flex-col">
            <AiFillCaretUp
              className={`text-sm ${isSorted && isAscending ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            />
            <AiFillCaretDown
              className={`text-sm ${isSorted && !isAscending ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên"
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            onClick={() => setCreateModal(true)}
          >
            + Thêm mới
          </button>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-500">
            <th className="px-4 py-2">STT</th>
            {renderSortableHeader("Mã", "employeeCode")}
            {renderSortableHeader("Tên đăng nhập", "username")}
            {renderSortableHeader("Tên", "tenNhanVien")}
            {renderSortableHeader("Vai trò", "role_name")}
            {renderSortableHeader("Email", "email")}
            {renderSortableHeader("Số điện thoại", "phone")}
            {renderSortableHeader("Giới tính", "gender")}
            {renderSortableHeader("Trạng thái", "status")}
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white text-black hover:bg-gray-50 text-xs">{renderRows()}</tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">
            Xem
          </label>
          <select
            id="entries"
            className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="text-sm text-gray-700">nhân viên</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
            onClick={handlePrevPage}
            disabled={currentPage === 0} // Disable khi ở trang đầu
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1} // Disable khi ở trang cuối
          >
            {">"}
          </button>
        </div>
      </div>

      <UpdateModal
        isOpen={updateModal}
        setUpdateModal={setUpdateModal}
        employee={currentEmployee}
        fetchEmployees={fetchEmployees}
      />
      <CreateModal
        isOpen={createModal}
        onConfirm={() => setCreateModal(false)}
        onCancel={() => setCreateModal(false)}
        fetchEmployees={fetchEmployees}
      />

      <UpdatePasswordModal
        isOpen={passwordModal}
        setIsOpen={setPasswordModal}
        employee={currentEmployee}
      />
    </div>
  );
}
