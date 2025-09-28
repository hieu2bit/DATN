import React, { useState, useEffect } from 'react';
import OrderService from "../../../../services/OrderService";
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const UpdateModal = ({ isOpen, setUpdateModal, order, fetchOrders }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState(order || {});

    useEffect(() => {
        if (order) {
            setUpdatedOrder(order);
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrder(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await OrderService.updateOrder(order.id, updatedOrder);
            toast.success("Cập nhật đơn hàng thành công!");
            fetchOrders();
            setUpdateModal(false);
        } catch (error) {
            toast.error("Cập nhật thất bại!");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box relative">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={() => setUpdateModal(false)}>✖</button>
                    <h3 className="font-bold text-lg text-blue-600 text-center">Cập nhật đơn hàng</h3>

                    <div className="py-3 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Tên đơn hàng</label>
                            <input type="text" name="orderName" value={updatedOrder.orderName || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                            <select name="status" value={updatedOrder.status || ''} onChange={handleChange} className="select select-bordered w-full">
                                <option value="true">Kích hoạt</option>
                                <option value="false">Không kích hoạt</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-action flex justify-end gap-2">
                        <button className="btn bg-blue-500 hover:bg-blue-600 text-white" onClick={handleUpdate}>Xác nhận</button>
                    </div>
                </div>
            </div>
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleUpdate} message="Bạn có chắc muốn cập nhật đơn hàng không?" />
        </>
    );
};

export default UpdateModal;