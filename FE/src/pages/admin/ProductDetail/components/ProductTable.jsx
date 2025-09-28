import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Switch from "react-switch";

const ProductTable = ({
  products,
  handleToggleStatus,
  handleUpdateProduct,
  openDeleteModal,
}) => {
  return (
    <table className="table-auto w-full text-sm text-gray-500 px-4 py-2 bg-white rounded-lg shadow overflow-hidden text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2">STT</th>
          <th className="px-4 py-2">Mã sản phẩm</th>
          <th className="px-4 py-2">Tên sản phẩm</th>
          <th className="px-4 py-2">Cổ áo</th>
          <th className="px-4 py-2">Màu sắc</th>
          <th className="px-4 py-2">Kích thước</th>
          <th className="px-4 py-2">Tay áo</th>
          <th className="px-4 py-2">SL</th>
          <th className="px-4 py-2">Giá nhập</th>
          <th className="px-4 py-2">Đơn giá</th>
          <th className="px-4 py-2">Trạng thái</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{product.productDetailCode}</td>
            <td className="px-4 py-2 flex items-center space-x-2">
              {product.photo && (
                <img
                  src={product.photo}
                  alt={product.product.productName}
                  className="w-7 h-7 object-cover rounded-md"
                />
              )}
              <span>{product.product.productName}</span>
            </td>
            <td className="px-4 py-2">{product.collar?.name || "N/A"}</td>
            <td className="px-4 py-2">{product.color?.name || "N/A"}</td>
            <td className="px-4 py-2">{product.size?.name || "N/A"}</td>
            <td className="px-4 py-2">{product.sleeve?.sleeveName || "N/A"}</td>
            <td className="px-4 py-2">{product.quantity}</td>
            <td className="px-4 py-2">{product.importPrice}</td>
            <td className="px-4 py-2">{product.salePrice}</td>
            <td className="px-4 py-2">
              <div
                title={product.status ? "Click để tắt" : "Click để kích hoạt"}
              >
                <Switch
                  onChange={() => handleToggleStatus(product.id)}
                  checked={product.status}
                  onColor="#1E90FF"
                  height={20}
                  width={40}
                />
              </div>
            </td>
            <td className="px-4 py-2 flex items-center">
              <button
                className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                onClick={() => handleUpdateProduct(product)}
                title="Chỉnh sửa sản phẩm"
              >
                <AiOutlineEdit className="text-xl" />
              </button>
              <button
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                onClick={() => openDeleteModal(product)}
                title="Xóa sản phẩm"
              >
                <AiOutlineDelete className="text-xl" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
