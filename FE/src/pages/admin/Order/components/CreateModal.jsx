import React, { useState } from 'react';
import OrderService from "../../../../services/OrderService";
import { toast } from 'react-toastify';

const CreateModal = ({ isOpen, onConfirm, onCancel, fetchOrders }) => {
    const [newOrder, setNewOrder] = useState({
        orderName: '',
        status: true // Default status
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        try {
            await OrderService.createOrder(newOrder);
            toast.success("Thêm mới đơn hàng thành công!");
            fetchOrders();
            onConfirm();
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Thêm mới đơn hàng thất bại. Vui lòng thử lại!");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={onCancel}>✖</button>
                <h3 className="font-bold text-lg text-blue-600 text-center">Thêm mới đơn hàng</h3>

                <div className="py-3 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Tên đơn hàng</label>
                        <input type="text" name="orderName" value={newOrder.orderName} onChange={handleChange} className="input input-bordered w-full" placeholder="Tên đơn hàng" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                        <select name="status" value={newOrder.status} onChange={handleChange} className="select select-bordered w-full">
                            <option value="true">Kích hoạt</option>
                            <option value="false">Không kích hoạt</option>
                        </select>
                    </div>
                </div>

                <div className="modal-action flex justify-end gap-2">
                    <button className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate}>Xác nhận</button>
                    <button className="btn bg-gray-500 hover:bg-gray-600 text-white" onClick={onCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;