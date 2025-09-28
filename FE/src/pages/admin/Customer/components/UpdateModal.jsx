import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import CustomerService from '../../../../services/CustomerService';
import CustomerAddressService from '../../../../services/CustomerAddressService';
import GHNService from '../../../../services/GHNService';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const UpdateModal = ({ isOpen, setUpdateModal, customer, fetchCustomers }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState(customer || {});
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [newAddress, setNewAddress] = useState({
        provinceId: '',
        provinceName: '',
        districtId: '',
        districtName: '',
        wardId: '',
        wardName: '',
        addressDetail: ''
    });

    useEffect(() => {
        setUpdatedCustomer(customer || {});
        if (customer) {
            fetchCustomerAddresses(customer.id);
        }
        fetchProvinces();
    }, [customer]);

    const fetchCustomerAddresses = async (customerId) => {
        try {
            const response = await CustomerAddressService.getByCustomerId(customerId);
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching customer addresses:", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await GHNService.getProvinces();
            setProvinces(response.data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await GHNService.getDistrictsByProvince(provinceId);
            setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await GHNService.getWardsByDistrict(districtId);
            setWards(response.data);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await CustomerService.update(customer.id, updatedCustomer);
            toast.success("Cập nhật khách hàng thành công!");
            fetchCustomers();
            setUpdateModal(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleResetPassword = async () => {
        try {
            await CustomerService.resetPassword(customer.id);
            toast.success("Đặt lại mật khẩu thành công!");
            setIsConfirmOpen(false);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));

        if (name === 'provinceId') {
            const selectedProvince = provinces.find(p => p.ProvinceID == value);
            setNewAddress(prev => ({ ...prev, provinceName: selectedProvince?.ProvinceName || '' }));
            fetchDistricts(value);
        }

        if (name === 'districtId') {
            const selectedDistrict = districts.find(d => d.DistrictID == value);
            setNewAddress(prev => ({ ...prev, districtName: selectedDistrict?.DistrictName || '' }));
            fetchWards(value);
        }

        if (name === 'wardId') {
            const selectedWard = wards.find(w => w.WardCode === value);
            setNewAddress(prev => ({ ...prev, wardName: selectedWard?.WardName || '' }));
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.provinceId || !newAddress.provinceName || !newAddress.districtId || !newAddress.districtName || !newAddress.wardId || !newAddress.wardName || !newAddress.addressDetail) {
            toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
            return;
        }

        try {
            const response = await CustomerAddressService.create({
                customerId: customer.id,
                provinceId: newAddress.provinceId,
                provinceName: newAddress.provinceName,
                districtId: newAddress.districtId,
                districtName: newAddress.districtName,
                wardId: newAddress.wardId,
                wardName: newAddress.wardName,
                addressDetail: newAddress.addressDetail
            });
            setAddresses([...addresses, response.data]);
            toast.success("Thêm địa chỉ mới thành công!");
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    };

    const handleRemoveAddress = async (addressId) => {
        try {
            await CustomerAddressService.delete(addressId);
            setAddresses(addresses.filter(address => address.id !== addressId));
            toast.success("Xóa địa chỉ thành công!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Cập nhật khách hàng</h3>
                    <div className="flex">
                        <div className="w-1/2 pr-4 border-r">
                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Mã khách hàng</label>
                                    <input type="text" name="customerCode" value={updatedCustomer.customerCode || ''} readOnly className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên khách hàng</label>
                                    <input type="text" name="fullname" value={updatedCustomer.fullname || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Tên đăng nhập</label>
                                    <input type="text" name="username" value={updatedCustomer.username || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                    <input type="text" name="phone" value={updatedCustomer.phone || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-3 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <input type="email" name="email" value={updatedCustomer.email || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                                    <input type="date" name="birthdate" value={updatedCustomer.birthdate || ''} onChange={handleChange} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="py-2 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">Giới tính</label>
                                    <select name="gender" value={updatedCustomer.gender || 0} onChange={handleChange} className="select select-bordered w-full">
                                        <option value={0}>Nam</option>
                                        <option value={1}>Nữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="w-1/2 pl-4">
                            <div className="flex gap-2 mt-4">
                                <div className="w-1/3">
                                    <label htmlFor="provinceId" className="text-sm font-medium text-gray-600">Tỉnh/Thành</label>
                                    <select name="provinceId" id="provinceId" value={newAddress.provinceId} onChange={(e) => { handleAddressChange(e); fetchDistricts(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map(province => (
                                            <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="districtId" className="text-sm font-medium text-gray-600">Quận/Huyện</label>
                                    <select name="districtId" id="districtId" value={newAddress.districtId} onChange={(e) => { handleAddressChange(e); fetchWards(e.target.value); }} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map(district => (
                                            <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-1/3">
                                    <label htmlFor="wardId" className="text-sm font-medium text-gray-600">Phường/Xã</label>
                                    <select name="wardId" id="wardId" value={newAddress.wardId} onChange={handleAddressChange} className="select select-bordered w-full mt-2">
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map(ward => (
                                            <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <input type="text" name="addressDetail" value={newAddress.addressDetail} onChange={handleAddressChange} className="input input-bordered w-full mt-2" placeholder="Địa chỉ chi tiết" />

                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full mt-2" onClick={handleAddAddress}>Thêm địa chỉ mới</button>
                            <div className="mt-6 space-y-4">
                                {addresses && addresses.length > 0 ? (
                                    addresses.map((address) => (
                                        <div key={address?.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
                                            <div className="text-sm text-gray-700">
                                                {address?.addressDetail ? address.addressDetail : 'Thông tin chi tiết địa chỉ không có'}
                                                {address?.districtName ? `, ${address.districtName}` : ''}
                                                {address?.provinceName ? `, ${address.provinceName}` : ''}
                                                {address?.wardName ? `, ${address.wardName}` : ''}
                                            </div>
                                            <button className="text-red-500 hover:text-red-600 flex items-center" onClick={() => handleRemoveAddress(address.id)}>
                                                <FaTrashAlt className="mr-2" /> Xóa
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-700">Không có địa chỉ nào</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            onClick={() => setUpdateModal(false)}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            onClick={handleUpdate}
                        >
                            Cập nhập
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateModal;