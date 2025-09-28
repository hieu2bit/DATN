import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import BrandService from "../../services/BrandService";
import CategoryService from "../../services/CategoryService";
import CollarService from "../../services/CollarService";
import ColorService from "../../services/ColorService";
import SizeService from "../../services/SizeService";
import SleeveService from "../../services/SleeveService";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const ProductList = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: "",
    brand: "",
    collar: "",
    color: "",
    size: "",
    sleeve: "",
    sortBy: "createdDate",
    sortDir: "desc",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12; // Hiển thị 12 sản phẩm trên mỗi trang
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [collars, setCollars] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorFilters, setErrorFilters] = useState(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingFilters(true);
      setErrorFilters(null);
      try {
        const [
          categoryData,
          brandData,
          collarData,
          colorData,
          sizeData,
          sleeveData,
        ] = await Promise.all([
          CategoryService.getAll(0, 100).catch(() => ({ content: [] })),
          BrandService.getAllBrands("", 0, 100).catch(() => []),
          CollarService.getAllCollars("", 0, 100).catch(() => ({
            content: [],
          })),
          ColorService.getAllColors("", 0, 100).catch(() => ({ content: [] })),
          SizeService.getAllSizes("", 0, 100).catch(() => ({ content: [] })),
          SleeveService.getAllSleeves("", 0, 100).catch(() => ({
            content: [],
          })),
        ]);

        setCategories(
          Array.isArray(categoryData?.content)
            ? categoryData.content.map((item) => ({
              id: item.id,
              name: item.categoryName || item.name,
            }))
            : Array.isArray(categoryData?.data)
              ? categoryData.data.map((item) => ({
                id: item.id,
                name: item.categoryName || item.name,
              }))
              : []
        );
        setBrands(
          Array.isArray(brandData?.content)
            ? brandData.content.map((item) => ({
              id: item.id,
              name: item.brandName || item.name,
            }))
            : Array.isArray(brandData?.data)
              ? brandData.data.map((item) => ({
                id: item.id,
                name: item.brandName || item.name,
              }))
              : []
        );
        setCollars(
          Array.isArray(collarData?.content)
            ? collarData.content.map((item) => ({
              id: item.id,
              name: item.collarName || item.name,
            }))
            : Array.isArray(collarData?.data)
              ? collarData.data.map((item) => ({
                id: item.id,
                name: item.collarName || item.name,
              }))
              : []
        );
        setColors(
          Array.isArray(colorData?.content)
            ? colorData.content.map((item) => ({
              id: item.id,
              name: item.colorName || item.name,
            }))
            : Array.isArray(colorData?.data)
              ? colorData.data.map((item) => ({
                id: item.id,
                name: item.colorName || item.name,
              }))
              : []
        );
        setSizes(
          Array.isArray(sizeData?.content)
            ? sizeData.content.map((item) => ({
              id: item.id,
              name: item.sizeName || item.name,
            }))
            : Array.isArray(sizeData?.data)
              ? sizeData.data.map((item) => ({
                id: item.id,
                name: item.sizeName || item.name,
              }))
              : []
        );
        setSleeves(
          Array.isArray(sleeveData?.content)
            ? sleeveData.content.map((item) => ({
              id: item.id,
              name: item.sleeveName || item.name,
            }))
            : Array.isArray(sleeveData?.data)
              ? sleeveData.data.map((item) => ({
                id: item.id,
                name: item.sleeveName || item.name,
              }))
              : []
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bộ lọc:", error);
        setErrorFilters("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại.");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);

  const fetchProducts = useCallback(
    debounce(async (page, filterState) => {
      setLoadingProducts(true);
      try {
        const response = await ProductService.getFilteredProducts({
          page,
          size: pageSize,
          minPrice: filterState.minPrice,
          maxPrice: filterState.maxPrice,
          categoryIds: filterState.category ? [filterState.category] : [],
          brandIds: filterState.brand ? [filterState.brand] : [],
          collarIds: filterState.collar ? [filterState.collar] : [],
          colorIds: filterState.color ? [filterState.color] : [],
          sizeIds: filterState.size ? [filterState.size] : [],
          sleeveIds: filterState.sleeve ? [filterState.sleeve] : [],
          sortBy: "createdDate",
          sortDir: "desc",
        });
        setProducts(response?.content || response?.data || []);
        setTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      } finally {
        setLoadingProducts(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, filters, fetchProducts]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      category: "",
      brand: "",
      collar: "",
      color: "",
      size: "",
      sleeve: "",
      sortBy: "createdDate",
      sortDir: "desc",
    });
    setCurrentPage(0);
  };

  const toggleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      const newSelected = isSelected
        ? prev.filter((p) => p.id !== product.id)
        : prev.length < 5
          ? [...prev, product]
          : prev;
      if (!isSelected && newSelected.length > 1 && newSelected.length <= 5) {
        setShowCompareModal(true);
      }
      return newSelected;
    });
  };

  const handleViewProduct = async (productId) => {
    try {
      const productDetails = await ProductService.getProductById(productId);
      if (productDetails && productDetails.productCode) {
        navigate(`/view-product/${productDetails.productCode}`);
      } else {
        alert("Không thể tìm thấy mã sản phẩm.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không thể xem chi tiết sản phẩm. Vui lòng thử lại.");
    }
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProducts.length <= 1) {
      setShowCompareModal(false); // Ẩn modal nếu chỉ còn 1 hoặc không còn sản phẩm
    }
  };

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-[#1E3A8A] mb-6">
        Sản Phẩm Mới
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bộ lọc bên trái */}
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md border border-[#1E3A8A]/30">
          <h2 className="text-xl font-bold text-[#1E3A8A] text-center mb-4">
            Bộ Lọc Sản Phẩm
          </h2>
          {loadingFilters && (
            <p className="text-center text-gray-500">Đang tải bộ lọc...</p>
          )}
          {errorFilters && (
            <p className="text-center text-red-500">{errorFilters}</p>
          )}
          {!loadingFilters && !errorFilters && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Danh mục
                </label>
                <select
                  name="category"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.category}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Thương hiệu
                </label>
                <select
                  name="brand"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.brand}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cổ áo
                </label>
                <select
                  name="collar"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.collar}
                >
                  <option value="">Tất cả cổ áo</option>
                  {collars.map((collar) => (
                    <option key={collar.id} value={collar.id}>
                      {collar.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Màu sắc
                </label>
                <select
                  name="color"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.color}
                >
                  <option value="">Tất cả màu sắc</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Kích thước
                </label>
                <select
                  name="size"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.size}
                >
                  <option value="">Tất cả kích thước</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tay áo
                </label>
                <select
                  name="sleeve"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.sleeve}
                >
                  <option value="">Tất cả tay áo</option>
                  {sleeves.map((sleeve) => (
                    <option key={sleeve.id} value={sleeve.id}>
                      {sleeve.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Giá từ
                </label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Nhập giá tối thiểu"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.minPrice || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Giá đến
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Nhập giá tối đa"
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition"
                  value={filters.maxPrice || ""}
                />
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded-md shadow-md hover:bg-[#163172] transition flex items-center gap-1"
            >
              Reset Bộ Lọc
            </button>
          </div>
        </div>

        {/* Danh sách sản phẩm bên phải */}
        <div className="w-full lg:w-3/4">
          <div className="relative">
            {loadingProducts && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-white p-4 rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#1E3A8A] group"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "/src/assets/default.jpg"
                        }
                        alt={product.nameProduct}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {!product.promotionPercent ? (
                        null
                      ) : (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          -{product.promotionPercent}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-md font-semibold text-gray-800 mt-2 truncate">
                      {product.nameProduct || "Tên sản phẩm"}
                    </h3>
                    <div className="text-center mt-2">
                      <span className="text-[#1E3A8A] font-bold text-lg">
                        {product.promotionPercent > 0
                          ? formatCurrency(
                            product.salePrice -
                            product.salePrice * (product.promotionPercent / 100)
                          )
                          : formatCurrency(product.salePrice || 0)}
                      </span>
                      {product.promotionPercent > 0 && (
                        <span className="ml-2 text-gray-400 line-through text-sm">
                          {formatCurrency(product.salePrice || 0)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-center text-gray-500 text-xs mt-1">
                        Đã bán: {product.quantitySaled || 0}
                      </p>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <span className="bg-green-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                        Mới
                      </span>
                      <div className="flex text-xs font-semibold px-2 py-0.5 rounded">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="bg-[#1E3A8A] text-white text-sm font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 hover:bg-[#163172] hover:scale-105 hover:shadow-lg"
                      >
                        Xem ngay
                      </button>
                      <button
                        onClick={() => toggleSelectProduct(product)}
                        className={`px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${selectedProducts.some((p) => p.id === product.id)
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                          }`}
                      >
                        {selectedProducts.some((p) => p.id === product.id)
                          ? "Đã chọn"
                          : "So sánh"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full col-span-full">
                  Không có sản phẩm nào.
                </p>
              )}
            </div>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0 || loadingProducts}
              className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${currentPage === 0 || loadingProducts
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E3A8A] hover:bg-[#163172] hover:scale-105"
                }`}
            >
              Trước
            </button>
            <span className="px-4 py-2 mx-2 text-lg font-semibold text-[#1E3A8A]">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1 || loadingProducts}
              className={`px-4 py-2 mx-2 rounded-lg shadow-md text-white font-semibold transition-all duration-300 ${currentPage >= totalPages - 1 || loadingProducts
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E3A8A] hover:bg-[#163172] hover:scale-105"
                }`}
            >
              Tiếp
            </button>
          </div>

          {/* Nút so sánh */}
          {selectedProducts.length > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              >
                So Sánh {selectedProducts.length} Sản Phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal so sánh */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg md:w-3/4 lg:w-4/5 w-full relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-300"
            >
              x
            </button>
            <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-6">
              So Sánh Sản Phẩm
            </h2>
            <p className="text-center text-gray-600 mb-4">
              (Tối đa 5 sản phẩm, bạn có thể xóa để chọn sản phẩm khác)
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-[#1E3A8A]/10 text-gray-700 text-left">
                    <th className="p-3 border">Ảnh</th>
                    <th className="p-3 border">Tên</th>
                    <th className="p-3 border">Giá</th>
                    <th className="p-3 border">Đã Bán</th>
                    <th className="p-3 border">Số Lượng</th>
                    <th className="p-3 border">Mô tả</th>
                    <th className="p-3 border">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {selectedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="text-center bg-gray-50 hover:bg-[#1E3A8A]/5 transition-colors duration-200"
                    >
                      <td className="p-3 border">
                        <img
                          src={
                            product.photo ||
                            "/src/assets/default.jpg"
                          }
                          alt={product.nameProduct}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border font-semibold">
                        {product.nameProduct}
                      </td>
                      <td className="p-3 border">
                        <span className="text-[#1E3A8A] font-bold">
                          {product.promotionPercent > 0
                            ? formatCurrency(
                              product.salePrice -
                              product.salePrice * (product.promotionPercent / 100)
                            )
                            : formatCurrency(product.salePrice || 0)}
                        </span>
                        {product.promotionPercent > 0 && (
                          <span className="ml-2 text-gray-400 line-through">
                            {formatCurrency(product.salePrice || 0)}
                          </span>
                        )}
                      </td>
                      <td className="p-3 border">
                        {product.quantitySaled || 0}
                      </td>
                      <td className="p-3 border">{product.quantity || 0}</td>
                      <td className="p-3 border">
                        {product.description || "Không có mô tả"}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => removeSelectedProduct(product.id)}
                          className="bg-red-300 text-sm font-semibold py-1 px-2 rounded-md hover:bg-red-500 hover:text-white transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  onClick={() => setShowCompareModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductList;
