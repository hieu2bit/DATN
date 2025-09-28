import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import PromotionService from "../../../../../services/PromotionServices";

Modal.setAppElement("#root");

const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const UpdateModal = ({
  isOpen,
  setUpdateModal,
  fetchPromotions,
  selectedPromotion,
}) => {
  const [promotion, setPromotion] = useState({
    promotionName: "",
    promotionPercent: "",
    description: "",
    startDate: "",
    endDate: "",
    status: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedPromotion) {
      setPromotion({
        promotionName: selectedPromotion.promotionName || "",
        promotionPercent: selectedPromotion.promotionPercent || "",
        description: selectedPromotion.description || "",
        startDate: selectedPromotion.startDate
          ? new Date(selectedPromotion.startDate).toISOString().slice(0, 16) // Định dạng yyyy-MM-ddThh:mm cho datetime-local
          : "",
        endDate: selectedPromotion.endDate
          ? new Date(selectedPromotion.endDate).toISOString().slice(0, 16)
          : "",
        status: selectedPromotion.status ?? true,
      });
      setErrors({});
    }
  }, [selectedPromotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!promotion.promotionName.trim()) {
      newErrors.promotionName = "Tên khuyến mãi không được để trống!";
    } else if (promotion.promotionName.length > 255) {
      newErrors.promotionName = "Tên khuyến mãi không được vượt quá 255 ký tự!";
    }

    if (!promotion.promotionPercent) {
      newErrors.promotionPercent = "Phần trăm giảm giá không được để trống!";
    } else {
      const percent = Number(promotion.promotionPercent);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        newErrors.promotionPercent = "Phần trăm giảm giá phải từ 0 đến 100!";
      }
    }

    if (!promotion.description.trim()) {
      newErrors.description = "Mô tả không được để trống!";
    } else if (promotion.description.length > 500) {
      newErrors.description = "Mô tả không được vượt quá 500 ký tự!";
    }

    if (!promotion.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống!";
    } else if (isNaN(new Date(promotion.startDate).getTime())) {
      newErrors.startDate = "Ngày và giờ bắt đầu không hợp lệ!";
    }

    if (!promotion.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống!";
    } else if (isNaN(new Date(promotion.endDate).getTime())) {
      newErrors.endDate = "Ngày và giờ kết thúc không hợp lệ!";
    } else if (promotion.startDate) {
      const start = new Date(promotion.startDate);
      const end = new Date(promotion.endDate);
      if (end <= start) {
        newErrors.endDate = "Ngày và giờ kết thúc phải sau ngày bắt đầu!";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const updatedPromotion = {
        promotionName: promotion.promotionName,
        promotionPercent: parseInt(promotion.promotionPercent),
        description: promotion.description,
        startDate: formatDateTime(new Date(promotion.startDate)),
        endDate: formatDateTime(new Date(promotion.endDate)),
        status: promotion.status,
      };

      console.log("Dữ liệu gửi API:", updatedPromotion);
      await PromotionService.updatePromotion(
        selectedPromotion.id,
        updatedPromotion
      );
      toast.success("Cập nhật khuyến mãi thành công!");
      fetchPromotions();
      setUpdateModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật khuyến mãi:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi không xác định từ server!";
      toast.error(`Lỗi khi cập nhật khuyến mãi: ${errorMessage}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setUpdateModal(false)}
      contentLabel="Cập nhật khuyến mãi"
      className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/5"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Cập Nhật khuyến mãi
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên khuyến mãi
          </label>
          <input
            type="text"
            name="promotionName"
            value={promotion.promotionName}
            onChange={handleChange}
            className={`w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.promotionName ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.promotionName && (
            <p className="text-red-500 text-xs mt-1">{errors.promotionName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phần trăm giảm giá (%)
          </label>
          <input
            type="number"
            name="promotionPercent"
            value={promotion.promotionPercent}
            onChange={handleChange}
            className={`w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.promotionPercent ? "border-red-500" : "border-gray-300"
              }`}
            min="0"
            max="100"
          />
          {errors.promotionPercent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.promotionPercent}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={promotion.description}
            onChange={handleChange}
            className={`w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"
              }`}
            rows="3"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày và giờ bắt đầu
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={promotion.startDate}
              onChange={handleChange}
              className={`w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày và giờ kết thúc
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={promotion.endDate}
              onChange={handleChange}
              className={`w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            name="status"
            value={promotion.status}
            onChange={(e) =>
              setPromotion((prev) => ({
                ...prev,
                status: e.target.value === "true",
              }))
            }
            className="w-full bg-white text-black border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setUpdateModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Cập Nhật
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateModal;
