import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginInfoService from "../../services/LoginInfoService";
import AccountService from "../../services/Account";
import GHNService from "../../services/GHNService";

const PersonalPage = () => {
  const { isLoggedIn, role } = useSelector((state) => state.user);
  const [customer, setCustomer] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isPasswordConfirmModalOpen, setIsPasswordConfirmModalOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    customAddress: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.fullname.trim()) {
      toast.error("Họ và tên không được để trống!");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại phải có đúng 10 chữ số!");
      return false;
    }
    if (
      formData.oldPassword ||
      formData.newPassword ||
      formData.confirmNewPassword
    ) {
      if (!formData.oldPassword) {
        toast.error("Vui lòng nhập mật khẩu cũ!");
        return false;
      }
      if (!formData.newPassword) {
        toast.error("Vui lòng nhập mật khẩu mới!");
        return false;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return false;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return false;
      }
    }
    return true;
  };

  const validateNewAddressForm = () => {
    if (!selectedProvince) {
      toast.error("Vui lòng chọn tỉnh/thành phố!");
      return false;
    }
    if (!selectedDistrict) {
      toast.error("Vui lòng chọn quận/huyện!");
      return false;
    }
    if (!selectedWard) {
      toast.error("Vui lòng chọn phường/xã!");
      return false;
    }
    if (!formData.customAddress.trim()) {
      toast.error("Địa chỉ cụ thể không được để trống!");
      return false;
    }
    if (formData.customAddress.length > 255) {
      toast.error("Địa chỉ cụ thể không được vượt quá 255 ký tự!");
      return false;
    }
    if (selectedProvince.label.length > 50) {
      toast.error("Tên tỉnh/thành phố không được vượt quá 50 ký tự!");
      return false;
    }
    if (selectedDistrict.label.length > 50) {
      toast.error("Tên quận/huyện không được vượt quá 50 ký tự!");
      return false;
    }
    if (selectedWard.label.length > 50) {
      toast.error("Tên phường/xã không được vượt quá 50 ký tự!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isLoggedIn || role !== "CUSTOMER") {
        toast.error("Vui lòng đăng nhập với vai trò khách hàng!");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const customerData = await LoginInfoService.getCurrentUser();
        console.log("Dữ liệu khách hàng:", customerData);
        setCustomer(customerData);
        setFormData({
          fullname: customerData.fullname || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          customAddress: "",
        });
        setAvatarPreview(
          customerData.avatar || "/src/assets/user.jpg"
        );

        try {
          const addresses = await AccountService.getCustomerAddresses();
          console.log("Dữ liệu địa chỉ thô:", addresses);
          const formattedAddresses = addresses.map((address) => ({
            value: address.id,
            label: `${address.addressDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
            fullAddress: {
              id: address.id,
              addressDetail: address.addressDetail,
              wardName: address.wardName,
              wardId: address.wardId,
              districtId: address.districtId,
              districtName: address.districtName,
              provinceId: address.provinceId,
              provinceName: address.provinceName,
              isDefault: address.isDefault || false,
            },
          }));
          console.log("Dữ liệu địa chỉ đã định dạng:", formattedAddresses);
          setUserAddresses(formattedAddresses);
          const defaultAddr =
            formattedAddresses.find((addr) => addr.fullAddress.isDefault) ||
            formattedAddresses[0] ||
            null;
          setSelectedAddress(defaultAddr);
        } catch (addressError) {
          console.error("Lỗi khi lấy danh sách địa chỉ:", addressError);
          toast.error(
            addressError.response?.data?.message ||
              "Không thể tải danh sách địa chỉ!"
          );
          setUserAddresses([]);
          setSelectedAddress(null);
        }

        try {
          const provinceData = await GHNService.getProvinces();
          console.log("Dữ liệu tỉnh/thành phố:", provinceData);
          setProvinces(
            (provinceData.data || []).map((province) => ({
              value: province.ProvinceID,
              label: province.ProvinceName,
            }))
          );
        } catch (provinceError) {
          console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", provinceError);
          toast.error("Không thể tải danh sách tỉnh/thành phố!");
          setProvinces([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin khách hàng!"
        );
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [isLoggedIn, role, navigate]);

  const handleProvinceChange = async (selected) => {
    setSelectedProvince(selected);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    if (selected) {
      try {
        const districtData = await GHNService.getDistrictsByProvince(
          selected.value
        );
        console.log("Dữ liệu quận/huyện:", districtData);
        setDistricts(
          (districtData.data || []).map((district) => ({
            value: district.DistrictID,
            label: district.DistrictName,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        toast.error("Lỗi khi lấy danh sách quận/huyện!");
      }
    }
  };

  const handleDistrictChange = async (selected) => {
    setSelectedDistrict(selected);
    setSelectedWard(null);
    setWards([]);
    if (selected) {
      try {
        const wardData = await GHNService.getWardsByDistrict(selected.value);
        console.log("Dữ liệu phường/xã:", wardData);
        setWards(
          (wardData.data || []).map((ward) => ({
            value: ward.WardCode,
            label: ward.WardName,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phường/xã:", error);
        toast.error("Lỗi khi lấy danh sách phường/xã!");
      }
    }
  };

  const handleWardChange = (selected) => {
    setSelectedWard(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh (jpg, png, ...)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được lớn hơn 5MB!");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!isLoggedIn) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        setIsLoading(true);
        const response = await AccountService.deleteAddress(addressId);
        const updatedAddresses = userAddresses.filter(
          (addr) => addr.value !== addressId
        );
        setUserAddresses(updatedAddresses);
        if (selectedAddress && selectedAddress.value === addressId) {
          const newDefault =
            updatedAddresses.find((addr) => addr.fullAddress.isDefault) ||
            updatedAddresses[0] ||
            null;
          setSelectedAddress(newDefault);
        }
        toast.success(response.message || "Xóa địa chỉ thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        const errorMessages = error.response?.data?.data || [];
        if (errorMessages.length > 0) {
          errorMessages.forEach((msg) => toast.error(msg));
        } else if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error(
            error.response?.data?.message || "Địa chỉ không tồn tại!"
          );
        } else {
          toast.error(error.response?.data?.message || "Xóa địa chỉ thất bại!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    const hasProfileChanges =
      formData.fullname !== (customer.fullname || "") ||
      formData.email !== (customer.email || "") ||
      formData.phone !== (customer.phone || "") ||
      avatarFile;

    const hasPasswordChanges =
      formData.oldPassword &&
      formData.newPassword &&
      formData.confirmNewPassword;

    if ((hasProfileChanges || hasPasswordChanges) && !validateForm()) return;

    if (!customer?.id) {
      toast.error("Không tìm thấy ID khách hàng!");
      return;
    }

    try {
      setIsLoading(true);

      if (hasProfileChanges) {
        if (
          formData.fullname !== (customer.fullname || "") ||
          formData.email !== (customer.email || "") ||
          formData.phone !== (customer.phone || "")
        ) {
          const response = await AccountService.updateCustomerInfo({
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
          });
          setCustomer((prev) => ({
            ...prev,
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
          }));
          toast.success(response.message || "Cập nhật thông tin thành công!");
        }

        if (avatarFile) {
          const avatarFormData = new FormData();
          avatarFormData.append("avatar", avatarFile);
          const avatarResponse =
            await LoginInfoService.updateAvatar(avatarFormData);
          if (
            avatarResponse.status === "success" &&
            avatarResponse.data.avatarUrl
          ) {
            setCustomer((prev) => ({
              ...prev,
              avatar: avatarResponse.data.avatarUrl,
            }));
            setAvatarFile(null);
            toast.success("Cập nhật ảnh đại diện thành công!");
          } else {
            toast.warn("Cập nhật ảnh đại diện thất bại!");
          }
        }
      }

      if (hasPasswordChanges) {
        setIsPasswordConfirmModalOpen(true);
        return; // Wait for confirmation
      }

      if (selectedAddress) {
        const currentDefault = userAddresses.find(
          (addr) => addr.fullAddress.isDefault
        );
        if (!currentDefault || currentDefault.value !== selectedAddress.value) {
          const updatedAddresses = userAddresses.map((addr) => ({
            ...addr,
            fullAddress: {
              ...addr.fullAddress,
              isDefault: addr.value === selectedAddress.value,
            },
          }));
          setUserAddresses(updatedAddresses);
          toast.success("Cập nhật địa chỉ mặc định thành công!");
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật thông tin:",
        error.response?.data || error.message
      );
      const errorMessages = error.response?.data?.data || [];
      if (errorMessages.length > 0) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(
          error.response?.data?.message || "Cập nhật thông tin thất bại!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordChange = async () => {
    try {
      setIsLoading(true);
      const response = await AccountService.updateCustomerPassword({
        oldPassword: formData.oldPassword,
        password: formData.newPassword,
      });
      toast.success(response.message || "Cập nhật mật khẩu thành công!");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setIsPasswordConfirmModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      const errorMessages = error.response?.data?.data || [];
      if (errorMessages.length > 0) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Cập nhật mật khẩu thất bại!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!validateNewAddressForm()) return;

    if (!isLoggedIn) {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const newAddress = {
        provinceId: Number(selectedProvince.value),
        provinceName: selectedProvince.label,
        districtId: Number(selectedDistrict.value),
        districtName: selectedDistrict.label,
        wardId: Number(selectedWard.value),
        wardName: selectedWard.label,
        addressDetail: formData.customAddress,
      };
      console.log("Gửi địa chỉ mới:", newAddress);
      const response = await AccountService.createAddress(newAddress);
      const addedAddressData = response.data;
      const addedAddress = {
        value: addedAddressData.id,
        label: `${addedAddressData.addressDetail}, ${addedAddressData.wardName}, ${addedAddressData.districtName}, ${addedAddressData.provinceName}`,
        fullAddress: {
          id: addedAddressData.id,
          addressDetail: addedAddressData.addressDetail,
          wardName: addedAddressData.wardName,
          wardId: addedAddressData.wardId,
          districtId: addedAddressData.districtId,
          districtName: addedAddressData.districtName,
          provinceId: addedAddressData.provinceId,
          provinceName: addedAddressData.provinceName,
          isDefault: userAddresses.length === 0,
        },
      };
      const updatedAddresses = [...userAddresses, addedAddress];
      if (userAddresses.length === 0) {
        setSelectedAddress(addedAddress);
      }
      setUserAddresses(updatedAddresses);
      setIsAddAddressModalOpen(false);
      setFormData({ ...formData, customAddress: "" });
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
      toast.success(response.message || "Thêm địa chỉ thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      const errorMessages = error.response?.data?.data || [];
      if (errorMessages.length > 0) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            "Thông tin địa chỉ không hợp lệ! Vui lòng kiểm tra lại."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Thêm địa chỉ thất bại! Vui lòng thử lại."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn || role !== "CUSTOMER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <p className="text-2xl font-semibold text-red-600 animate-pulse">
          Vui lòng đăng nhập để xem thông tin cá nhân!
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl text-gray-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-12"
        toastClassName="bg-white text-gray-900 rounded-xl shadow-lg p-4 flex items-center"
        progressClassName="bg-blue-600"
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in"></div>

        <div className="bg-white bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-sky-900 to-purple-800 p-8 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="avatar-upload"
                  aria-label="Tải lên ảnh đại diện"
                />
              )}
              <button
                className={`absolute bottom-0 right-0 p-2 rounded-full transition-all duration-300 ${
                  isEditing
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                onClick={() =>
                  isEditing &&
                  document.querySelector('input[type="file"]').click()
                }
                disabled={!isEditing}
                aria-label="Chỉnh sửa ảnh đại diện"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"
                  />
                </svg>
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-white">
                {customer.fullname || "Chưa cập nhật"}
              </h2>
              <p className="text-blue-100 mt-1">
                Mã khách hàng: {customer.customerCode || "Chưa cập nhật"}
              </p>
              <p className="text-blue-100">
                Trạng thái: {customer.status ? "Hoạt động" : "Không hoạt động"}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="bg-white bg-opacity-50 rounded-2xl p-6 mb-8 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên đăng nhập
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {customer.username || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium">
                        {customer.fullname || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                        placeholder="Nhập email"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium">
                        {customer.email || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-medium">
                        {customer.phone || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo tài khoản
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {customer.createDate
                        ? new Date(customer.createDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cập nhật gần nhất
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {customer.updateDate
                        ? new Date(customer.updateDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white bg-opacity-50 rounded-2xl p-6 mb-8 shadow-inner">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Địa chỉ mặc định
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <Select
                    options={userAddresses}
                    value={selectedAddress}
                    onChange={setSelectedAddress}
                    placeholder="Chọn địa chỉ mặc định"
                    className="text-gray-900"
                    isDisabled={isLoading}
                    formatOptionLabel={(option) => (
                      <div className="flex justify-between items-center">
                        <span className="truncate">{option.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(option.value);
                          }}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                          title="Xóa địa chỉ"
                          aria-label={`Xóa địa chỉ ${option.label}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  />
                  <button
                    onClick={() => setIsAddAddressModalOpen(true)}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Thêm địa chỉ mới
                  </button>
                </div>
              ) : selectedAddress ? (
                <p className="text-gray-900 font-medium">
                  {selectedAddress.fullAddress.addressDetail},{" "}
                  {selectedAddress.fullAddress.wardName},{" "}
                  {selectedAddress.fullAddress.districtName},{" "}
                  {selectedAddress.fullAddress.provinceName}
                </p>
              ) : (
                <p className="text-gray-500 italic">Chưa có địa chỉ mặc định</p>
              )}
            </div>

            {/* Password Change Section */}
            {isEditing && (
              <div className="bg-white bg-opacity-50 rounded-2xl p-6 mb-8 shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Đổi mật khẩu
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu cũ
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu cũ"
                      autoComplete="current-password"
                      className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu mới"
                      autoComplete="new-password"
                      className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      placeholder="Xác nhận mật khẩu mới"
                      autoComplete="new-password"
                      className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="bg-white bg-opacity-70 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isLoading}
                    className={`flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {isAddAddressModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500">
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-500 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Thêm địa chỉ mới
                </h3>
                <button
                  onClick={() => {
                    setIsAddAddressModalOpen(false);
                    setFormData({ ...formData, customAddress: "" });
                    setSelectedProvince(null);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                    setDistricts([]);
                    setWards([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition duration-300"
                  aria-label="Đóng modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố
                  </label>
                  <Select
                    options={provinces}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    placeholder="Chọn tỉnh/thành phố"
                    className="mt-1 text-gray-900"
                    isDisabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quận/Huyện
                  </label>
                  <Select
                    options={districts}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Chọn quận/huyện"
                    className="mt-1 text-gray-900"
                    isDisabled={isLoading || !selectedProvince}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phường/Xã
                  </label>
                  <Select
                    options={wards}
                    value={selectedWard}
                    onChange={handleWardChange}
                    placeholder="Chọn phường/xã"
                    className="mt-1 text-gray-900"
                    isDisabled={isLoading || !selectedDistrict}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    type="text"
                    name="customAddress"
                    value={formData.customAddress}
                    onChange={handleInputChange}
                    placeholder="Nhập số nhà, tên đường"
                    className="mt-1 block w-full border border-gray-200 rounded-xl p-3 bg-white bg-opacity-70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm hover:shadow-md"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setIsAddAddressModalOpen(false);
                    setFormData({ ...formData, customAddress: "" });
                    setSelectedProvince(null);
                    setSelectedDistrict(null);
                    setSelectedWard(null);
                    setDistricts([]);
                    setWards([]);
                  }}
                  className="bg-white bg-opacity-70 text-gray-800 px-5 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={isLoading}
                  className={`flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Confirmation Modal */}
        {isPasswordConfirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500">
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-all duration-500 animate-slide-up">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Xác nhận đổi mật khẩu
                </h3>
                <p className="mt-2 text-gray-600">
                  Bạn có chắc chắn muốn đổi mật khẩu?
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsPasswordConfirmModalOpen(false)}
                  className="bg-white bg-opacity-70 text-gray-800 px-5 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmPasswordChange}
                  disabled={isLoading}
                  className={`flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalPage;
