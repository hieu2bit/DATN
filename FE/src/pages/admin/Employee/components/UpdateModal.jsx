import React, { useState, useRef, useEffect } from 'react';
import EmployeeService from "../../../../services/EmployeeService";
import UploadFileService from '../../../../services/UploadFileService';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const UpdateModal = ({ isOpen, setUpdateModal, employee, fetchEmployees }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updatedEmployee, setUpdatedEmployee] = useState(employee || {});
    const [avatar, setAvatar] = useState(employee?.photo || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (employee) {
            setUpdatedEmployee({
                ...employee,
                roleId: employee.role?.id || 2,
                photo: employee.photo || null,
            });
            setAvatar(employee.photo || null);
        }
    }, [employee]);

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        const localImageUrl = URL.createObjectURL(file);
        setAvatar(localImageUrl);

        try {
            const uploadedImageUrl = await UploadFileService.uploadProductImage(file);
            setUpdatedEmployee(prev => ({ ...prev, photo: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };


    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            console.log("Dữ liệu gửi đi:", updatedEmployee);

            const response = await EmployeeService.update(employee.id, updatedEmployee); // 👈 Gán vào biến
            console.log("Phản hồi từ server:", response); // 👈 In ra response

            toast.success("Cập nhật nhân viên thành công!");
            fetchEmployees();
            setUpdateModal(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error(error?.response?.data?.message);
        }
    };


    const handleResetPassword = async () => {
        try {
            await EmployeeService.resetPassword(employee.id);
            toast.success("Đặt lại mật khẩu thành công!");
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error("Không thể đặt lại mật khẩu!");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật nhân viên</h3>
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden cursor-pointer" onDoubleClick={handleDoubleClick}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Chưa có ảnh</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleAvatarUpload(e.target.files[0])} />
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Tên nhân viên</label>
                            <input type="text" name="fullname" value={updatedEmployee.fullname || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                            <input type="text" name="username" value={updatedEmployee.username || ''} readOnly className="input input-bordered w-full" />
                        </div>
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input type="email" name="email" value={updatedEmployee.email || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                            <input type="text" name="phone" value={updatedEmployee.phone || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Vai trò</label>
                            <select name="roleId"
                                value={updatedEmployee.roleId || 2}
                                onChange={(e) => setUpdatedEmployee(prev => ({
                                    ...prev,
                                    roleId: e.target.value
                                }))}
                                className="select select-bordered w-full">
                                <option value="2">Nhân viên</option>
                                <option value="1">Quản trị</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Giới tính</label>
                            <select
                                name="gender"
                                value={updatedEmployee.gender !== undefined ? updatedEmployee.gender : true}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                            >
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>

                        </div>
                    </div>

                    <div className="py-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                            <input type="text" name="address" value={updatedEmployee.address || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                    </div>

                    <div className="modal-action flex justify-end gap-2">
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={() => setUpdateModal(false)}>Hủy</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleUpdate}>Xác nhận</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateModal;