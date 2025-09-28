import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaFileImage } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import { toast } from "react-toastify";
import ProductDetailService from "../../../../services/ProductDetailService";
import UploadFileService from "../../../../services/UploadFileService";
import { useNavigate } from "react-router-dom";

export default function ProductVariants({ generateData }) {
  const navigate = useNavigate();
  const [variantsList, setVariantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirmSave = () => {
    handleSave();
    handleCloseModal();
  };

  const generateProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ProductDetailService.generateProductDetails(generateData);

      if (response) {
        const productDetails = response?.map((item) => ({
          colorId: item?.color,
          colorName: item?.colorName,
          productName: item?.productName,
          variants: item?.productDetail
        }));

        setVariantsList(productDetails);
      } else {
        setError("Không có dữ liệu chi tiết sản phẩm.");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi tạo chi tiết sản phẩm.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [generateData]);

  useEffect(() => {
    if (generateData && Object.keys(generateData).length > 0) {
      generateProductDetails();
    }
  }, [generateData, generateProductDetails]);

  const handleInputChange = (colorIndex, variantIndex, field, value) => {
    const updatedVariantsList = [...variantsList];

    if (updatedVariantsList[colorIndex]?.variants) {
      updatedVariantsList[colorIndex].variants = updatedVariantsList[colorIndex].variants.map(
        (variant, index) => {
          if (index === variantIndex) {
            return { ...variant, [field]: value };
          }
          return variant;
        }
      );
      setVariantsList(updatedVariantsList);
    }
  };

  const handleRemoveVariant = (colorIndex, variantIndex) => {
    const updatedVariantsList = [...variantsList];
    updatedVariantsList[colorIndex].variants.splice(variantIndex, 1);
    setVariantsList(updatedVariantsList);
  };

  const isVariantsListValid = () => {
    if (!variantsList || variantsList.length === 0) return false;

    return variantsList.every((variantData) =>
      variantData.variants.every(
        (variant) =>
          variant.quantity > 0 &&
          variant.salePrice > 0 &&
          variant.productId &&
          variant.size &&
          variant.color
      )
    );
  };

  const handleImageUpload = async (colorId, file) => {
    if (!file) return;

    try {
      const fileURL = URL.createObjectURL(file);
      setVariantsList((prevList) =>
        prevList.map((item) =>
          item.colorId === colorId
            ? { ...item, previewImage: fileURL }
            : item
        )
      );

      const uploadedImageUrl = await UploadFileService.uploadProductImage(file);

      setVariantsList((prevList) =>
        prevList.map((color) =>
          color.colorId === colorId
            ? {
              ...color,
              variants: color.variants.map((variant) => ({
                ...variant,
                photo: uploadedImageUrl,
              })),
            }
            : color
        )
      );
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
    }
  };

  const handleSave = () => {
    const productDetailData = [];

    variantsList.forEach((variantData) => {
      variantData.variants.forEach((variant) => {
        const newVariant = {
          productId: variant.productId, // ID sản phẩm
          sizeId: variant.size, // ID kích thước
          colorId: variant.color, // ID màu sắc
          collarId: variant.collar, // ID cổ áo
          sleeveId: variant.sleeve, // ID tay áo
          promotionId: variant.promotion, // ID khuyến mãi (nếu có)
          photo: variant.photo || null, // Hình ảnh (nếu có, nếu không để null)
          importPrice: variant.importPrice, // Giá nhập
          salePrice: variant.salePrice, // Giá bán
          quantity: variant.quantity, // Số lượng
          description: variant.description, // Mô tả
        };

        productDetailData.push(newVariant);
      });
    });

    ProductDetailService.createProductDetail(productDetailData)
      .then((response) => {
        console.log("Dữ liệu chi tiết sản phẩm đã được lưu", response);
        toast.success("Dữ liệu chi tiết sản phẩm đã được lưu thành công!");

        const productId = response?.[0]?.product.id;
        if (productId) {
          navigate(`/admin/product/${productId}`);
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lưu chi tiết sản phẩm", error);
        toast.error("Có lỗi xảy ra khi lưu chi tiết sản phẩm.");
      });
  };

  return (
    <div className="border-2 h-full rounded-xl flex flex-col ">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : variantsList.length === 0 ? (
        <div className="col-span-3 h-full border rounded-lg bg-white shadow-lg flex flex-col items-center justify-center text-center">
          <AiFillWarning className="text-5xl text-orange-500" />
          <p className="text-gray-600 mt-4">Sản phẩm đã tồn tại, vui lòng chọn thuộc tính khác</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-6">
          {variantsList.map((variantData, idx) => (
            <div key={variantData.colorId} className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Chi tiết sản phẩm {variantData.productName} màu {variantData.colorName}
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      {["STT", "Sản phẩm", "Giá nhập", "Giá bán", "Số lượng", "Xóa"].map((header) => (
                        <th key={header} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variantData?.variants?.length > 0 ? (
                      variantData.variants.map((variant, index) => (
                        <tr key={`${variant.color}-${variant.size}-${index}`} className="border-b hover:bg-blue-50 transition-colors">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{`${variant.productName} ${variant.brandName} ${variant.colorName} ${variant.collarName} ${variant.sleeveName} size ${variant.size}`}</td>
                          <td className="py-3 px-6">
                            <input
                              type="text"
                              value={variant.importPrice}
                              onChange={(e) => handleInputChange(idx, index, "importPrice", e.target.value)}
                              placeholder="Nhập giá nhập"
                              className="border-2 border-blue-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                          <td className="py-3 px-6">
                            <input
                              type="text"
                              value={variant.salePrice}
                              onChange={(e) => handleInputChange(idx, index, "salePrice", e.target.value)}
                              placeholder="Nhập giá bán"
                              className="border-2 border-blue-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="text"
                              value={variant.quantity}
                              onChange={(e) => handleInputChange(idx, index, "quantity", e.target.value)}
                              placeholder="Nhập số lượng"
                              className="border-2 border-blue-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleRemoveVariant(idx, index)} className="text-red-500 hover:text-red-700">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                          Không có chi tiết sản phẩm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 relative">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(variantData.colorId, e.target.files[0])}
                    className="hidden"
                  />
                  {variantData.previewImage ? (
                    <img
                      src={variantData.previewImage}
                      alt="Ảnh đã chọn"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32">
                      <FaFileImage className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500">
                        Thả hình ảnh của bạn ở đây, hoặc <span className="text-blue-500">duyệt</span>
                      </p>
                      <p className="text-gray-400 text-sm">Hỗ trợ: jpeg, png</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {isVariantsListValid() && (
        <div className="p-6 flex justify-end mt-auto">
          <button onClick={handleOpenModal} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Lưu chi tiết sản phẩm
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-xl shadow-2xl w-[500px] max-w-lg text-center flex flex-col items-center">
            <AiFillWarning className="text-5xl text-orange-500 " />
            <h3 className="text-2xl mt-3 font-semibold text-gray-800">Thông báo</h3>
            <p className="text-gray-600 mt- text-lg">Vui lòng xác nhận trước khi lưu?</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-400 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSave}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-all"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}