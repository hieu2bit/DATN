import React, { useState } from "react";
import CustomerService from "../../../../services/CustomerService";
import { toast } from "react-toastify";

const UpdatePasswordModal = ({ isOpen, setIsOpen, customer }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await CustomerService.updatePassword(customer.id, {
        newPassword,
        confirmPassword,
      });
      console.log("Response:", response);
      toast.success(response.message || "Cập nhật mật khẩu thành công!");
      setIsOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Cập nhật mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={() => setIsOpen(false)}
          disabled={loading}
        >
          ✖
        </button>
        <h3 className="font-bold text-lg text-blue-600 text-center mb-4">Cập nhật mật khẩu</h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full"
              disabled={loading}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full"
              disabled={loading}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
        </div>

        <div className="modal-action justify-end">
          <button
            className={`btn bg-blue-500 hover:bg-blue-600 text-white ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
