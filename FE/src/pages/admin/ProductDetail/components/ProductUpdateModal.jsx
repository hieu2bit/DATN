import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import ProductDetailService from "../../../../services/ProductDetailService";
import UploadFileService from "../../../../services/UploadFileService";
import PromotionService from "../../../../services/PromotionServices";
import Barcode from "react-barcode";
export default function ProductUpdateModal({
  modalVisible,
  currentProduct,
  onClose,
  onUpdate,
  collars,
  sleeves,
  colors,
  sizes,
  promotions,
}) {
  const [quantity, setQuantity] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [collar, setCollar] = useState(null);
  const [sleeve, setSleeve] = useState(null);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  useEffect(() => {
    if (currentProduct) {
      setQuantity(currentProduct.quantity || "");
      setImportPrice(currentProduct.importPrice || "");
      setSalePrice(currentProduct.salePrice || "");
      setDescription(currentProduct.description || "");
      setPhoto(currentProduct.photo || "");
      setCollar(
        currentProduct.collar
          ? {
              value: currentProduct.collar.id,
              label: currentProduct.collar.name,
            }
          : null
      );
      setSleeve(
        currentProduct.sleeve
          ? {
              value: currentProduct.sleeve.id,
              label: currentProduct.sleeve.sleeveName,
            }
          : null
      );
      setColor(
        currentProduct.color
          ? { value: currentProduct.color.id, label: currentProduct.color.name }
          : null
      );
      setSize(
        currentProduct.size
          ? { value: currentProduct.size.id, label: currentProduct.size.name }
          : null
      );
      setPromotion(
        currentProduct.promotion
          ? {
              value: currentProduct.promotion.id,
              label: currentProduct.promotion.promotionName,
            }
          : null
      );
    }
  }, [currentProduct]);
  const handleUpdateSubmit = async () => {
    const productData = {
      productId: currentProduct.product.id,
      collarId: collar?.value,
      sleeveId: sleeve?.value,
      colorId: color?.value,
      sizeId: size?.value,
      promotionId: promotion?.value,
      quantity: Number(quantity),
      importPrice: Number(importPrice),
      salePrice: Number(salePrice),
      description: description,
      photo: selectedImage || photo,
    };
    try {
      const result = await ProductDetailService.updateProductDetail(
        currentProduct.id,
        productData
      );
      onUpdate(result);
      toast.success("Cập nhật sản phẩm thành công!");
      setPreviewImage("");
      onClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };
  if (!modalVisible) return null;

  const handleImageUpload = async (file) => {
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ định dạng JPEG, PNG!");
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    fileReader.readAsDataURL(file);

    try {
      const uploadedImageUrl = await UploadFileService.uploadProductImage(file);

      setPreviewImage(uploadedImageUrl);
      setSelectedImage(uploadedImageUrl);
    } catch (error) {
      console.error("Lỗi tải ảnh lên Firebase:", error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại!");
    }
  };
  const handleClose = () => {
    setQuantity("");
    setImportPrice("");
    setSalePrice("");
    setDescription("");
    setPhoto("");
    setCollar(null);
    setSleeve(null);
    setColor(null);
    setSize(null);
    setPromotion(null);
    setSelectedImage(null);
    setPreviewImage("");

    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-4/5">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Cập nhật chi tiết sản phẩm
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {/* Thông tin sản phẩm */}
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cổ áo
              </label>
              <Select
                value={collar}
                onChange={(option) => setCollar(option)}
                options={collars.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tay áo
              </label>
              <Select
                value={sleeve}
                onChange={(option) => setSleeve(option)}
                options={sleeves.map((item) => ({
                  value: item.id,
                  label: item.sleeveName,
                }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Màu sắc
              </label>
              <Select
                value={color}
                onChange={(option) => setColor(option)}
                options={colors.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kích thước
              </label>
              <Select
                value={size}
                onChange={(option) => setSize(option)}
                options={sizes.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Khuyến mãi
              </label>
              <Select
                value={promotion}
                onChange={(option) => setPromotion(option)}
                options={promotions
                  .filter((item) => item.status === true)
                  .map((item) => ({
                    value: item.id,
                    label: item.promotionName,
                  }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá nhập
              </label>
              <input
                type="number"
                value={importPrice}
                onChange={(e) => setImportPrice(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Đơn giá
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
          </div>
          {/* Hình ảnh sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Hình ảnh
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300 relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />{" "}
              {previewImage || photo ? (
                <img
                  src={previewImage || photo}
                  className="h-40 w-full object-contain rounded-lg"
                  onError={() =>
                    previewImage ? setPreviewImage(null) : setPhoto(null)
                  }
                  alt="Product Image"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <p className="text-gray-500">
                    Thả hình ảnh vào đây hoặc{" "}
                    <span className="text-blue-500 cursor-pointer">
                      chọn ảnh
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm">Hỗ trợ: jpeg, png</p>
                </div>
              )}
            </div>

            {/* Mã vạch sản phẩm */}
            <div className="mt-6 flex flex-col items-center justify-center  ">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 ">
                Mã vạch sản phẩm
              </h3>
              {currentProduct?.productDetailCode && (
                <Barcode value={currentProduct.productDetailCode} />
              )}
            </div>
          </div>
        </div>
        {/* Nút hành động */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdateSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
