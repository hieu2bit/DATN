import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "Giá không có sẵn";
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products and sort by ID in descending order
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: 0,
          size: 30, // Increased to ensure enough products
          sort: "id,desc",
        };
        const response = await ProductService.getFilteredProducts(params);
        const productsArray = Array.isArray(response)
          ? response
          : response?.content && Array.isArray(response.content)
            ? response.content
            : [];
        console.log("Products:", productsArray);
        setProducts(productsArray || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Handle view product
  const handleViewProduct = async (productId) => {
    try {
      const productDetails = await ProductService.getProductById(productId);
      console.log("Chi tiết sản phẩm:", productDetails);
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

  // Take the top 4 products for the first section
  const topProducts = products.slice(0, 4);
  // Split products for the two rows in the second section
  const firstRowProducts = products.slice(4, 9); // 5 products for the first row
  const secondRowProducts = products.slice(9, 14); // 5 products for the second row
  // Additional products for the new view section
  const recommendedProducts = products.slice(14, 18); // 4 products for the new view

  return (
    <main className="bg-white text-gray-900 p-4 sm:p-6">
      {/* First Section: Promotional Section with Top 4 Products */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Top Banners */}
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/banner-thoi-trang-nam-tinh.jpg"
                alt="Skirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              </div>
            </div>
            <div className="relative bg-yellow-200 rounded-lg overflow-hidden h-48">
              <img
                src="/src/assets/dung-luong-banner-thoi-trang.jpg"
                alt="Shirts Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <p className="text-white text-lg font-bold"></p>
              </div>
            </div>
          </div>

          {/* Left Promotional Image */}
          <div className="lg:col-span-1">
            <div className="relative bg-lime-200 rounded-lg overflow-hidden min-h-[400px]">
              <img
                src="/src/assets/Blue and White T-shirt Products Sale Instagram Post (1).png"
                alt="Promotional Image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold">XUÂN HÈ</h2>
                <p className="text-sm">Ưu đãi đến 50% cho bộ sưu tập mới!</p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-2 bg-white text-sky-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid (4 Products) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-h-[350px]"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.photo || "/src/assets/default.jpg"
                        }
                        alt={product.productName || product.nameProduct}
                        className="w-full h-48 object-contain rounded-t-lg"
                      />
                      {!product.promotionPercent ? (
                        null
                      ) : (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          -{product.promotionPercent}%
                        </span>
                      )}
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.productName ||
                          product.nameProduct ||
                          "Tên sản phẩm"}
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
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded relative">
                        <div
                          className="h-full bg-sky-900 rounded"
                          style={{
                            width: `${Math.min(
                              (product.quantitySaled / product.quantity) *
                              100 || 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Đã bán: {product.quantitySaled || 0}
                      </p>
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="mt-2 w-full bg-sky-900 text-white text-sm font-semibold py-2 rounded-md opacity-70 transition-opacity duration-300 hover:opacity-100"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 col-span-full">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-3"
                    >
                      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
                      <div className="p-3 text-center">
                        <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* View More Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/products")}
            className="bg-sky-900 text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-700 transition"
          >
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
    </main>
  );
};

export default Products;
