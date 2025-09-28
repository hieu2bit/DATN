import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import CartService from "../../services/CartService";
import VoucherServices from "../../services/VoucherServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewProductDetail = () => {
  const { productCode } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableCollars, setAvailableCollars] = useState([]);
  const [availableSleeves, setAvailableSleeves] = useState([]);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchVouchers();
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details =
          await ProductService.getProductDetailsByProductCode(productCode);
        if (details && details.length > 0) {
          const updatedDetails = details.map((detail) => ({
            ...detail,
            isFavorite: false,
          }));
          setProductDetails(updatedDetails);
          setSelectedDetail(updatedDetails[0]);
          setSelectedImage(updatedDetails[0].photo || "");
          const colors = [
            ...new Set(
              updatedDetails
                .map((detail) => detail?.color?.name)
                .filter(Boolean)
            ),
          ];
          const sizes = [
            ...new Set(
              updatedDetails.map((detail) => detail?.size?.name).filter(Boolean)
            ),
          ];
          const collars = [
            ...new Set(
              updatedDetails
                .map((detail) => detail?.collar?.name)
                .filter(Boolean)
            ),
          ];
          const sleeves = [
            ...new Set(
              updatedDetails
                .map((detail) => detail?.sleeve?.sleeveName)
                .filter(Boolean)
            ),
          ];
          setAvailableColors(colors);
          setAvailableSizes(sizes);
          setAvailableCollars(collars);
          setAvailableSleeves(sleeves);
        } else {
          setError(
            "Không tìm thấy sản phẩm hoặc biến thể nào với mã: " + productCode
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    if (productCode) fetchProductDetails();
    else {
      setError("Mã sản phẩm không hợp lệ!");
      setLoading(false);
    }
  }, [productCode]);

  const fetchVouchers = async () => {
    try {
      const { content } = await VoucherServices.getAllVouchers();
      setVouchers(content.slice(0, 4));
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleColorChange = (color) => {
    const matchingDetail = productDetails.find(
      (detail) =>
        detail?.color?.name === color &&
        detail?.size?.name === selectedDetail?.size?.name
    );
    if (matchingDetail) {
      setSelectedDetail(matchingDetail);
      setSelectedImage(matchingDetail?.photo || "");
    }
  };

  const handleSizeChange = (size) => {
    const matchingDetail = productDetails.find(
      (detail) =>
        detail?.size?.name === size &&
        detail?.color?.name === selectedDetail?.color?.name
    );
    if (matchingDetail) {
      setSelectedDetail(matchingDetail);
      setSelectedImage(matchingDetail?.photo || "");
    }
  };

  const handleCollarChange = (collar) => {
    const matchingDetail = productDetails.find(
      (detail) =>
        detail?.collar?.name === collar &&
        detail?.color?.name === selectedDetail?.color?.name &&
        detail?.size?.name === selectedDetail?.size?.name &&
        detail?.sleeve?.sleeveName === selectedDetail?.sleeve?.sleeveName
    );
    if (matchingDetail) {
      setSelectedDetail(matchingDetail);
      setSelectedImage(matchingDetail?.photo || "");
    }
  };

  const handleSleeveChange = (sleeve) => {
    const matchingDetail = productDetails.find(
      (detail) =>
        detail?.sleeve?.sleeveName === sleeve &&
        detail?.color?.name === selectedDetail?.color?.name &&
        detail?.size?.name === selectedDetail?.size?.name &&
        detail?.collar?.name === selectedDetail?.collar?.name
    );
    if (matchingDetail) {
      setSelectedDetail(matchingDetail);
      setSelectedImage(matchingDetail?.photo || "");
    }
  };

  const validateQuantity = (value) => {
    if (!value || value <= 0) {
      toast.error("Số lượng phải lớn hơn 0!");
      return 1;
    }
    if (value > selectedDetail.quantity) {
      toast.error(
        `Số lượng không được vượt quá tồn kho (${selectedDetail.quantity})!`
      );
      return selectedDetail.quantity;
    }
    return value;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setQuantity(1);
      return;
    }
    const validatedValue = validateQuantity(value);
    setQuantity(validatedValue);
  };

  const handleAddToCart = async () => {
    if (!selectedDetail) return;

    const validatedQuantity = validateQuantity(quantity);
    if (validatedQuantity !== quantity) {
      setQuantity(validatedQuantity);
      return;
    }

    const toastId = toast.success(
      <div className="flex items-center gap-2">
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Thêm sản phẩm vào giỏ hàng thành công!</span>
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-green-50 border-l-4 border-green-500 shadow-lg",
        bodyClassName: "text-gray-800 font-medium",
        progressClassName: "bg-green-500",
      }
    );

    try {
      setIsLoadingCart(true);
      const cartItemRequest = {
        productDetailId: selectedDetail.id,
        quantity: validatedQuantity,
      };
      await CartService.addProductToCart(cartItemRequest);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.dismiss(toastId);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-50 border-l-4 border-red-500 shadow-lg",
        bodyClassName: "text-gray-800 font-medium",
        progressClassName: "bg-red-500",
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedDetail || !selectedDetail.product) {
      console.error("Thiếu dữ liệu sản phẩm:", selectedDetail);
      toast.error("Không thể mua ngay do thiếu thông tin sản phẩm!");
      return;
    }

    const validatedQuantity = validateQuantity(quantity);
    if (validatedQuantity !== quantity) {
      setQuantity(validatedQuantity);
      return;
    }

    try {
      setIsLoadingCart(true);
      const cartItemRequest = {
        productDetailId: selectedDetail.id,
        quantity: validatedQuantity,
      };
      await CartService.addProductToCart(cartItemRequest);
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.dismiss(toastId);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "bg-red-50 border-l-4 border-red-500 shadow-lg",
        bodyClassName: "text-gray-800 font-medium",
        progressClassName: "bg-red-500",
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-xl py-16">Đang tải...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl py-16">{error}</p>;
  }

  if (!productDetails.length || !selectedDetail) {
    return (
      <p className="text-center text-gray-600 text-xl py-16">
        Không tìm thấy sản phẩm hoặc biến thể nào!
      </p>
    );
  }

  // Tính giá hiển thị
  const salePrice = selectedDetail.salePrice || 0;

  // Lấy thông tin khuyến mãi từ selectedDetail
  const promotion = selectedDetail.promotion;
  let promotionPercent = 0;

  // Kiểm tra nếu có promotion
  if (promotion && promotion.promotionPercent) {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    // Khuyến mãi hợp lệ nếu đang active + còn trong khoảng thời gian
    if (promotion.status && now >= startDate && now <= endDate) {
      promotionPercent = promotion.promotionPercent;
    }
  }

  // Tính giá giảm
  const discountPrice = promotionPercent
    ? salePrice * (1 - promotionPercent / 100)
    : salePrice;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={selectedDetail?.product?.productName || "Sản phẩm"}
              className="w-full h-[450px] object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
                toast.warn("Không thể tải ảnh sản phẩm!");
              }}
            />
          ) : (
            <div className="w-full h-[450px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 shadow-lg">
              Không có ảnh
            </div>
          )}
          {!promotionPercent ? (
            null
          ) : (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              -{promotionPercent}%
            </span>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">
              {selectedDetail.product?.productName || "Không có tên"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <p>
              <span className="font-medium text-gray-700">Loại:</span>{" "}
              <span className="text-gray-800">
                {selectedDetail.product?.category?.name || "Không xác định"}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Thương hiệu:</span>{" "}
              <span className="text-gray-800">
                {selectedDetail.product?.brand?.brandName || "Không xác định"}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Mã sản phẩm:</span>{" "}
              <span className="text-indigo-600">
                {selectedDetail.productDetailCode || "N/A"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-center text-gray-500 text-xs mt-1">
              Đã bán: {selectedDetail.quantitySaled || 0}
            </p>
          </div>

          <div className="flex items-center gap-3 gap-1 mt-2">
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

          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-indigo-600">
              {discountPrice.toLocaleString("vi-VN")}₫
            </p>
            {promotionPercent > 0 && salePrice > 0 && (
              <p className="text-base text-gray-400 line-through">
                {salePrice.toLocaleString("vi-VN")}₫
              </p>
            )}
          </div>

          {selectedDetail?.promotion && (
            <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl shadow-sm border border-indigo-100">
              <h3 className="text-base font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                Khuyến mãi đặc biệt
              </h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                {!promotionPercent ? (
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span>
                    Áp dụng Phiếu quà tặng / Mã giảm giá theo sản phẩm.
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span>
                    {selectedDetail?.promotion?.description}
                  </li>
                )}
                {vouchers.map((voucher, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✔</span>
                    Voucher giảm {voucher.reducedPercent}% cho đơn từ{" "}
                    {voucher.minCondition.toLocaleString("vi-VN")}₫ tối đa{" "}
                    {voucher.maxDiscount.toLocaleString("vi-VN")}₫
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span>
                  Tặng voucher 100.000đ mua hàng tại website, áp dụng khi mua Online từ 1/9/2025 đến hết 1/11/2025.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✔</span>
                  FREESHIP đơn từ 599.000đ
                </li>
              </ul>
              <div className="flex gap-2 mt-3 flex-wrap">
                {vouchers.map((code) => (
                  <button
                    key={code.voucherCode}
                    className="px-3 py-1 text-indigo-600 font-medium border border-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 text-xs shadow-sm"
                  >
                    {code.voucherCode}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-base font-semibold text-gray-700 mb-2">
                Màu sắc
              </p>
              <div className="flex gap-2 flex-wrap">
                {availableColors.map((color) => {
                  const isAvailable = productDetails.some(
                    (detail) =>
                      detail?.color?.name === color &&
                      detail?.size?.name === selectedDetail?.size?.name
                  );
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      disabled={!isAvailable}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${selectedDetail?.color?.name === color
                        ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                        : "border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-600 hover:scale-105"
                        } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-base font-semibold text-gray-700 mb-2">
                Kích thước
              </p>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const isAvailable = productDetails.some(
                    (detail) =>
                      detail?.size?.name === size &&
                      detail?.color?.name === selectedDetail?.color?.name
                  );
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      disabled={!isAvailable}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${selectedDetail?.size?.name === size
                        ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                        : "border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-600 hover:scale-105"
                        } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="text-indigo-600 text-sm mt-2 hover:underline hover:text-indigo-700 transition-colors duration-300"
              >
                Hướng dẫn chọn kích thước
              </button>
            </div>

            <div>
              <p className="text-base font-semibold text-gray-700 mb-2">
                Cổ áo
              </p>
              <div className="flex gap-2 flex-wrap">
                {availableCollars.map((collar) => {
                  const isAvailable = productDetails.some(
                    (detail) =>
                      detail?.collar?.name === collar &&
                      detail?.color?.name === selectedDetail?.color?.name &&
                      detail?.size?.name === selectedDetail?.size?.name &&
                      detail?.sleeve?.sleeveName ===
                      selectedDetail?.sleeve?.sleeveName
                  );
                  return (
                    <button
                      key={collar}
                      onClick={() => handleCollarChange(collar)}
                      disabled={!isAvailable}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${selectedDetail?.collar?.name === collar
                        ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                        : "border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-600 hover:scale-105"
                        } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {collar}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-base font-semibold text-gray-700 mb-2">
                Tay áo
              </p>
              <div className="flex gap-2 flex-wrap">
                {availableSleeves.map((sleeve) => {
                  const isAvailable = productDetails.some(
                    (detail) =>
                      detail?.sleeve?.sleeveName === sleeve &&
                      detail?.color?.name === selectedDetail?.color?.name &&
                      detail?.size?.name === selectedDetail?.size?.name &&
                      detail?.collar?.name === selectedDetail?.collar?.name
                  );
                  return (
                    <button
                      key={sleeve}
                      onClick={() => handleSleeveChange(sleeve)}
                      disabled={!isAvailable}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${selectedDetail?.sleeve?.sleeveName === sleeve
                        ? "bg-indigo-600 text-white border-indigo-600 scale-105"
                        : "border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-600 hover:scale-105"
                        } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {sleeve}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-base font-semibold text-gray-700">Số lượng</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      validateQuantity(Math.max(1, prev - 1))
                    )
                  }
                  disabled={quantity <= 1}
                  className="w-9 h-9 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 disabled:bg-gray-300 transition-all duration-300 shadow-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-14 text-center text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all duration-300"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={selectedDetail.quantity}
                />
                <button
                  onClick={() =>
                    setQuantity((prev) => validateQuantity(prev + 1))
                  }
                  disabled={quantity >= selectedDetail.quantity}
                  className="w-9 h-9 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 disabled:bg-gray-300 transition-all duration-300 shadow-sm"
                >
                  +
                </button>
              </div>
              <p className="text-gray-500 text-sm">
                Còn {selectedDetail.quantity || 0} sản phẩm
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isLoadingCart}
              className={`flex-1 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl shadow-md transition-all duration-300 ${isLoadingCart ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 hover:shadow-lg"}`}
            >
              {isLoadingCart ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isLoadingCart}
              className={'flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-xl shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 hover:shadow-lg ${isLoadingCart ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 hover:shadow-lg"}'}
            >
              {isLoadingCart ? "ĐANG THÊM..." : "MUA NGAY"}
            </button>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white font-medium rounded-xl shadow-md hover:from-indigo-800 hover:to-indigo-900 transition-all duration-300 hover:shadow-lg">
            Liên hệ: 1900 6750
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl shadow-sm border border-indigo-100 mt-6 min-h-[500px]">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "description"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
              }`}
          >
            MÔ TẢ
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "shipping"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
              }`}
          >
            CHÍNH SÁCH GIAO HÀNG
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`px-4 py-2 text-sm font-medium ${activeTab === "return"
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
              }`}
          >
            CHÍNH SÁCH ĐỔI HÀNG
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 text-sm text-gray-700">
          {activeTab === "description" && (
            <div>
              <h2 className="text-lg font-bold mb-2">
                {selectedDetail.product?.productName || "Không có tên"}
              </h2>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Loại áo:</span> {selectedDetail.product?.category?.name || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Thương hiệu:</span> {selectedDetail.product?.brand?.brandName || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Chất liệu:</span> {selectedDetail.product?.material?.materialName || "N/A"}
                </li>
              </ul>
              <h2 className="text-lg font-bold mb-2">
                Mô tả chi tiết
              </h2>
              <div className="space-y-3">
                <span>{selectedDetail.description}</span>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-2">CHÍNH SÁCH GIAO HÀNG</h1>
              <span className="font-semibold">=&gt; Ship COD toàn quốc.</span><br></br>
              <span className="font-semibold">=&gt; Freeship toàn quốc với hoá đơn trên 599.000đ.</span><br></br>
              <span className="font-semibold">=&gt; Thanh toán sau khi nhận hàng.</span><br></br>
              <span className="font-semibold">=&gt; Đổi trả dễ dàng trong vòng 15 ngày.</span><br></br>
              <h1 className="text-xl font-bold mb-2">1. PHÍ SHIP </h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Freeship toàn quốc với đơn hàng từ 599.000đ.</span>
                </li>
                <li>
                  <span className="font-semibold">Áp dụng phí vận chuyển chuẩn theo đơn vị giao hàng đối với các đơn hàng
                    dưới 599.OOOđ trên toàn quốc.</span>
                </li>
              </ul>
              <h1 className="text-xl font-bold mb-2">2. THỜI GIAN GIAO HÀNG (KHÔNG TÍNH T7 & CN) </h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Nội thành: 4 - 24h.</span>
                </li>
                <li>
                  <span className="font-semibold">Ngoại thành: 24 - 48h.</span>
                </li>
                <li>
                  <span className="font-semibold">Ngoại Tỉnh: 3 - 5 ngày.</span>
                </li>
              </ul>
              <h1 className="text-xl font-bold mb-2">3. ĐỔI HÀNG DỄ DÀNG</h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Đổi/ Trả trong vòng 15 ngày kể từ khi nhận hàng.</span>
                </li>
                <li>
                  <span className="font-semibold">Miễn phí đổi trả nếu lỗi sai sót từ phía Mộc Wear.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "return" && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-2">CHÍNH SÁCH ĐỔI TRẢ HÀNG LỖI</h1>
              <h1 className="text-xl font-bold mb-2">1. CHÍNH SÁCH ĐỔI HÀNG </h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Sản phẩm đổi trả trong thời hạn 15 ngày kể từ ngày mua trên hóa đơn (Đối với
                    khách mua tại store), 15 ngày kể từ ngày nhận hàng được xác nhận trên hóa đơn vận
                    chuyển (Đối với khách mua online).</span>
                </li>
                <li>
                  <span className="font-semibold">Sản phẩm đổi còn nguyên tem, tags, hóa đơn mua hàng, sản phẩm không bị
                    dính dơ, hư hỏng bởi những tác nhân bên ngoài cửa hàng sau khi mua hàng.</span>
                </li>
              </ul>
              <h1 className="text-xl font-bold mb-2">2. CHÍNH SÁCH ĐỔI DO LỖI KỸ THUẬT VÀ HOÀN TIỀN </h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Sản phẩm lỗi kỹ thuật như: Ố màu, phai màu, chất liệu, kiểu dáng, bung keo...</span>
                </li>
                <li>
                  <span className="font-semibold">Sản phẩm không giống mô tả hoặc không giống hình..</span>
                </li>
              </ul>
              <span className="font-semibold">Lưu ý:</span> Sản phẩm sẽ được đổi mới hoàn toàn miễn phí đổi với sản phẩm lỗi kỹ thuật
              trong vòng 15 ngày kể từ ngày mua hàng trên hóa đơn. (Sản phẩm chưa qua sử dụng).
              Sau thời gian 15 ngày sẽ được hỗ trợ sang chính sách bảo hành.
              <h1 className="text-xl font-bold mb-2">3. CHI PHÍ ĐỔI HÀNG</h1>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <span className="font-semibold">Miễn phí đồi hàng cho khách mua sắm tại Mộc Wear trong trường hợp bị lỗi từ nhà sản xuất,
                    giao nhầm hàng, bị hư hỏng trong quá trình vận chuyển.</span>
                </li>
                <li>
                  <span className="font-semibold">Trong trường hợp đổi size, không thích mẫu, màu... Khách hàng chỉ chịu phí ship hàng 1 chiều
                    về kho Mộc Wear, Mộc Wear sẽ chịu chỉ phí ship sản phẩm mới cho Quý Khách hàng
                    (Lưu ý trường hợp này áp dụng cho các đơn hàng mua Online).</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Hướng dẫn chọn size
            </h2>
            <h3 className="text-base font-medium text-center text-gray-600 mb-4">
              Bảng size áo Polo & T-shirt
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                    <th className="px-4 py-2 text-sm font-semibold">SIZE</th>
                    <th className="px-4 py-2 text-sm font-semibold">
                      CHIỀU CAO (CM)
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold">
                      CÂN NẶNG (KG)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "S", height: "160 - 166", weight: "56 - 62" },
                    { size: "M", height: "167 - 172", weight: "63 - 68" },
                    { size: "L", height: "173 - 178", weight: "69 - 74" },
                    { size: "XL", height: "179 - 184", weight: "75 - 80" },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-2 text-sm text-gray-600 font-medium">
                        {row.size}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {row.height}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {row.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <table className="w-full text-center border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700">
                    <th className="px-4 py-2 text-sm font-semibold">SIZE</th>
                    <th className="px-4 py-2 text-sm font-semibold">S</th>
                    <th className="px-4 py-2 text-sm font-semibold">M</th>
                    <th className="px-4 py-2 text-sm font-semibold">L</th>
                    <th className="px-4 py-2 text-sm font-semibold">XL</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "CỔ", values: ["36", "38", "40", "42"] },
                    { label: "VAI", values: ["44", "45", "46", "47"] },
                    {
                      label: "NGỰC",
                      values: ["82-92", "93-96", "97-100", "101-103"],
                    },
                    { label: "EO", values: ["88", "92", "96", "100"] },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-2 text-sm text-gray-600 font-medium">
                        {row.label}
                      </td>
                      {row.values.map((value, i) => (
                        <td key={i} className="px-4 py-2 text-sm text-gray-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProductDetail;
