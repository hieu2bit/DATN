import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ProductUpdateModal from "./components/ProductUpdateModal";
import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import ProductFilters from './components/ProductFilters';
import ProductDetailService from "../../../services/ProductDetailService";
import CollarService from "../../../services/CollarService";
import SleeveService from "../../../services/SleeveService";
import ColorService from "../../../services/ColorService";
import SizeService from "../../../services/SizeService";
import PromotionService from "../../../services/PromotionServices";

export default function ProductDetail() {
  const { productCode } = useParams();

  const [products, setProducts] = useState([]);
  const [collars, setCollars] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const [filters, setFilters] = useState({
    colorIds: [],
    collarIds: [],
    sizeIds: [],
    sleeveIds: [],
    minPrice: 0,
    maxPrice: 10000000,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  useEffect(() => {
    if (productCode) {
      setSearch(productCode);
      setPage(0);
    }
  }, [productCode]);

  useEffect(() => {
    if (search) {
      fetchProductDetails();
    }
  }, [search, page, pageSize, sortConfig, filters]);

  const fetchSelectOptions = async () => {
    try {
      const collarData = await CollarService.getAllCollars();
      setCollars(collarData.content);

      const sizeData = await SizeService.getAllSizes();
      setSizes(sizeData.content);

      const colorData = await ColorService.getAllColors();
      setColors(colorData.content);

      const sleeveData = await SleeveService.getAllSleeves();
      setSleeves(sleeveData.content);

      const promotionData = await PromotionService.getAllPromotions();
      setPromotions(promotionData.content);

    } catch (error) {
      setError("Error fetching select options");
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const result = await ProductDetailService.getAllProductDetails({
        page,
        size: pageSize,
        search,
        sortBy: sortConfig.key,
        sortDir: sortConfig.direction,
        ...filters
      });
      setProducts(result.content);
      setTotalPages(result.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Error fetching product details");
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handlePriceChange = (field, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value ? parseFloat(value) : ""
    }));
    setPage(0);
  };

  const handleFilterChange = (field, selectedOptions) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
    setPage(0);
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedProduct = await ProductDetailService.toggleProductDetailStatus(id);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, status: updatedProduct.status } : product
        )
      );
      toast.success("Thay đổi trạng thái thành công!");
    } catch (error) {
      console.error("Error toggling product detail status:", error);
      toast.error("Không thể thay đổi trạng thái. Vui lòng thử lại!");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleUpdateProduct = (product) => {
    console.log("Updating product:", product);
    setCurrentProduct(product);
    setModalVisible(true);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDeleteProduct = async () => {
    try {
      if (productToDelete) {
        await ProductDetailService.deleteProductDetail(productToDelete.id);
        setProducts((prev) =>
          prev.filter((p) => p.id !== productToDelete.id)
        );
        toast.success("Xóa sản phẩm thành công!");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại!");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết sản phẩm {products.length > 0 ? products[0].product.productName : ""}
      </h1>

      <ProductFilters
        filters={filters}
        search={search}
        handleFilterChange={handleFilterChange}
        handleSearchChange={handleSearchChange}
        handlePriceChange={handlePriceChange}
        collars={collars}
        sleeves={sleeves}
        colors={colors}
        sizes={sizes}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <ProductTable
            products={products}
            handleToggleStatus={handleToggleStatus}
            handleUpdateProduct={handleUpdateProduct}
            openDeleteModal={openDeleteModal}
          />
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      <ProductUpdateModal
        modalVisible={modalVisible}
        currentProduct={currentProduct}
        onClose={handleModalClose}
        onUpdate={handleProductUpdate}
        collars={collars}
        sleeves={sleeves}
        colors={colors}
        sizes={sizes}
        promotions={promotions}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2 hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={confirmDeleteProduct}
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}