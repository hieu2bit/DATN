import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiFillCaretUp, AiFillCaretDown, AiOutlineEdit } from "react-icons/ai";
import Switch from "react-switch";
import ProductService from "../../../services/ProductService";
import { toast } from "react-toastify";
import UpdateModal from './components/UpdateModal';
import CreateModal from './components/CreateModal';

export default function Product() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [status, setStatus] = useState(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    brandId: '',
    categoryId: '',
    materialId: '',
    productName: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { content, totalPages } = await ProductService.getAllProducts(
          currentPage, 
          pageSize, 
          search, 
          status,
          sortBy, 
          sortDirection
        );
        setItems(content);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [currentPage, pageSize, search, status, sortBy, sortDirection]);
  

  const handleSort = (key) => {
    let direction = "asc";
    if (sortBy === key && sortDirection === "asc") {
      direction = "desc";
    }
    setSortBy(key);
    setSortDirection(direction);
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

  const handleViewDetail = (code) => {
    navigate(`/admin/product/${code}`);
  };

  const handleUpdateProduct = (product) => {
    setUpdatedProduct({
      brandId: product.brand.id,
      categoryId: product.category.id,
      materialId: product.material.id,
      productName: product.productName,
    });
    setProductToUpdate(product.id);
    setUpdateModal(true);
  };

  const confirmUpdate = async (updatedProduct) => {
    try {
      if (productToUpdate) {
        await ProductService.updateProduct(productToUpdate, updatedProduct);
        const updatedItems = items.map((item) =>
          item.id === productToUpdate ? { ...item, ...updatedProduct } : item
        );
        setItems(updatedItems);
        toast.success("Cập nhật sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng thử lại!");
    } finally {
      setUpdateModal(false);
      setProductToUpdate(null);
    }
  };

  const cancelUpdate = () => {
    setUpdateModal(false);
    setProductToUpdate(null);
  };

  
  const confirmCreate = async (newProduct) => {
    try {
      const createdProduct = await ProductService.createProduct(newProduct);
      setItems([...items, createdProduct]);
      toast.success("Thêm sản phẩm mới thành công!");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Thêm sản phẩm mới thất bại. Vui lòng thử lại!");
    } finally {
      setCreateModal(false);
    }
  };

  const cancelCreate = () => {
    setCreateModal(false);
  };

  const handleToggleStatus = async (id) => {
    try {
      await ProductService.toggleProductStatus(id);
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      );
      setItems(updatedItems);
      toast.success("Thay đổi trạng thái sản phẩm thành công!");
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Không thể thay đổi trạng thái sản phẩm. Vui lòng thử lại!");
    }
  };

  const renderRows = () => {
    const sortedItems = [...items].sort((a, b) => {
      if (sortBy === null) return 0;

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sortedItems.map((item, index) => (
      <tr key={item.id} className="bg-white text-xs text-black hover:bg-gray-50 transition-colors">
        <td className="px-4 py-2">{index + 1}</td>
        <td className="px-4 py-2">{item.productCode}</td>
        <td className="px-4 py-2">{item.productName}</td>
        <td className="px-4 py-2">{item.brand.brandName}</td>
        <td className="px-4 py-2">{item.category.name}</td>
        <td className="px-4 py-2">{item.material.materialName}</td>
        <td className={`px-4 py-2 ${item.status ? "text-blue-500" : "text-red-500"}`}>
          <span className="status-dot"></span>
          {item.status ? " Kích hoạt" : " Ngừng bán"}
        </td>
        <td className="px-4 py-2 flex justify-center gap-4">
          <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors" onClick={() => handleViewDetail(item.productCode)}>
            <AiOutlineEye size={20} />
          </button>
          <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors" onClick={() => handleUpdateProduct(item)}>
            <AiOutlineEdit size={20} />
          </button>

          <Switch
            onChange={() => handleToggleStatus(item.id)}
                  checked={item.status}
                  height={20}
                  width={40}
                  onColor="#1E90FF"
          />
        </td>
      </tr>
    ));
  };

  const renderSortableHeader = (label, sortKey) => {
    const isSorted = sortBy === sortKey;
    const isAscending = isSorted && sortDirection === "asc";

    return (
      <th
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors relative"
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center justify-center">
          {label}
          <div className="ml-2 flex flex-col">
            <AiFillCaretUp
              className={`text-sm ${isSorted && isAscending ? "text-gray-500" : "text-gray-400 hover:text-gray-600"}`}
            />
            <AiFillCaretDown
              className={`text-sm ${isSorted && !isAscending ? "text-gray-500" : "text-gray-400 hover:text-gray-600"}`}
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã, tên sản phẩm"
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            onClick={() => setCreateModal(true)}
          >
            + Thêm mới
          </button>
        </div>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden text-center">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-500 text-center">
            <th className="px-4 py-2">STT</th>
            {renderSortableHeader("Mã", "productCode")}
            {renderSortableHeader("Tên sản phẩm", "productName")}
            {renderSortableHeader("Thương hiệu", "brand.brandName")}
            {renderSortableHeader("Danh mục", "category.categoryName")}
            {renderSortableHeader("Chất liệu", "material.materialName")}
            {renderSortableHeader("Trạng thái", "status")}
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm text-gray-700">Xem</label>
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
          <span className="text-sm text-gray-700">sản phẩm</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
            onClick={handlePrevPage}
            disabled={currentPage === 0}  // Disable khi ở trang đầu
          >
            {"<"}
          </button>
          <span className="text-sm text-gray-700">Trang {currentPage + 1} / {totalPages}</span>
          <button
            className="px-3 py-1 border rounded-lg text-gray-500 hover:bg-blue-500 hover:text-white"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}  // Disable khi ở trang cuối
          >
            {">"}
          </button>
        </div>

      </div>

      <UpdateModal isVisible={updateModal} onConfirm={confirmUpdate} onCancel={cancelUpdate} updatedProduct={updatedProduct} setUpdatedProduct={setUpdatedProduct} />
      <CreateModal isVisible={createModal} onConfirm={confirmCreate} onCancel={cancelCreate} />
    </div>
  );
}