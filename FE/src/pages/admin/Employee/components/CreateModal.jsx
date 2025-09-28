import React, { useState, useRef, useEffect } from 'react';
import EmployeeService from "../../../../services/EmployeeService";
import UploadFileService from '../../../../services/UploadFileService';
import { toast } from 'react-toastify';

const CreateModal = ({ isOpen, onConfirm, onCancel, fetchEmployees }) => {
    const [newEmployee, setNewEmployee] = useState({
        roleId: '2', // Default role ID for 'Nhân viên'
        fullname: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        photo: '',
        gender: true // Default gender
    });
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const randomString = Math.random().toString(36).substring(2, 10);
            const randomLogin = `${randomString}`;
            setNewEmployee(prev => ({
                ...prev,
                username: randomLogin
            }));
            setAvatar(null);
        }
    }, [isOpen]);

    const handleAvatarUpload = async (file) => {
        if (!file) return;

        try {
            const fileURL = URL.createObjectURL(file);
            setAvatar(fileURL);

            const uploadedImageUrl = await UploadFileService.uploadProductImage(file);
            setNewEmployee(prev => ({ ...prev, photo: uploadedImageUrl }));
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên:", error);
            toast.error("Không thể tải ảnh lên!");
        }
    };

    const handleDoubleClick = () => fileInputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

const handleCreate = async () => {
    try {
        const payload = {
            ...newEmployee,
            roleId: parseInt(newEmployee.roleId, 10),
            gender: newEmployee.gender === "true" || newEmployee.gender === true
        };

        // 🔍 Log dữ liệu gửi đi
        console.log("📤 Request payload:", payload);

        const response = await EmployeeService.add(payload);

        // ✅ Log phản hồi từ server
        console.log("📥 Response:", response);

        toast.success("Thêm mới nhân viên thành công!");
        fetchEmployees();
        onConfirm();
    } catch (error) {
        console.error("❌ Error creating employee:", error);

        toast.error("Thêm mới nhân viên thất bại. Vui lòng thử lại!");
    }
};


    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Thêm mới nhân viên</h3>
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
                        <input type="text" name="fullname" value={newEmployee.fullname} onChange={handleChange} className="input input-bordered w-full" placeholder="Tên nhân viên" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                        <input type="text" name="username" value={newEmployee.username} onChange={handleChange} className="input input-bordered w-full" placeholder="Tên đăng nhập" />
                    </div>
                </div>

                <div className="py-3 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input type="email" name="email" value={newEmployee.email} onChange={handleChange} className="input input-bordered w-full" placeholder="Email" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                        <input type="text" name="phone" value={newEmployee.phone} onChange={handleChange} className="input input-bordered w-full" placeholder="Số điện thoại" />
                    </div>
                </div>

                <div className="py-3 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Vai trò</label>
                        <select name="roleId" value={newEmployee.roleId} onChange={handleChange} className="select select-bordered w-full">
                            <option value="2">Nhân viên</option>
                            <option value="1">Quản trị</option>
                        </select>

                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Giới tính</label>
                        <select name="gender" value={newEmployee.gender} onChange={handleChange} className="select select-bordered w-full">
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </select>

                    </div>
                </div>

                <div className="py-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                        <input type="text" name="address" value={newEmployee.address || ''} onChange={handleChange} className="input input-bordered w-full" />
                    </div>
                </div>

                <div className="modal-action flex justify-end gap-2">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={onCancel}>Hủy</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleCreate}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;