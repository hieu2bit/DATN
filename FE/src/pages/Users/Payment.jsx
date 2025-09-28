import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GHNService from "../../services/GHNService";
import PaymentService from "../../services/PaymentService";
import LoginInfoService from "../../services/LoginInfoService";
import VoucherService from "../../services/VoucherServices";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirmation modal

  const { items, totalAmount, totalItems } = location.state || {};
  if (!items || !totalAmount || !totalItems) {
    useEffect(() => {
      toast.error("Không có thông tin đơn hàng. Vui lòng quay lại giỏ hàng.");
      navigate("/cart");
    }, [navigate]);
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [customAddress, setCustomAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const voucherDiscount = calculateVoucherDiscount();
    const newFinalTotal = totalAmount + shippingFee - voucherDiscount;
    setFinalTotal(newFinalTotal > 0 ? newFinalTotal : 0);
    console.log("Updated finalTotal:", newFinalTotal);
  }, [totalAmount, shippingFee, selectedVoucher]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        let user;
        try {
          user = await LoginInfoService.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Không thể tải thông tin người dùng.");
          return;
        }

        let formattedAddresses = [];
        try {
          const addresses = await LoginInfoService.getCurrentUserAddresses();
          formattedAddresses = addresses.map((address) => ({
            value: address.id,
            label: `${address.addressDetail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
            fullAddress: address,
          }));
          setUserAddresses(formattedAddresses);

          if (formattedAddresses.length > 0) {
            console.log("Thông tin địa chỉ ban đầu của khách hàng:", {
              province: formattedAddresses[0].fullAddress.provinceName,
              district: formattedAddresses[0].fullAddress.districtName,
              ward: formattedAddresses[0].fullAddress.wardName,
            });
          } else {
            console.log("Không có địa chỉ nào được lưu trữ cho khách hàng.");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
          toast.error("Không thể tải danh sách địa chỉ.");
        }

        setFormData({
          fullName: user.fullname ?? "",
          phone: user.phone ?? "",
          email: user.email ?? "",
        });

        let provincesData = [];
        try {
          const response = await GHNService.getProvinces();
          provincesData = response.data.map((province) => ({
            value: province.ProvinceID,
            label: province.ProvinceName,
          }));
          console.log("Danh sách tỉnh/thành từ API:", provincesData);
          setProvinces(provincesData);
        } catch (error) {
          console.error("Error fetching provinces:", error);
          toast.error("Không thể tải danh sách tỉnh/thành phố.");
          return;
        }

        if (formattedAddresses.length > 0) {
          await handleSelectAddress(formattedAddresses[0]);
        }

        const allVouchers = await VoucherService.getAllVouchers();
        const now = new Date();
        const validVouchers = allVouchers.content.filter((voucher) => {
          const startDate = new Date(voucher.startDate);
          const endDate = new Date(voucher.endDate);
          return (
            voucher.status &&
            totalAmount >= voucher.minCondition &&
            now >= startDate &&
            now <= endDate
          );
        });

        const formattedVouchers = validVouchers.map((voucher) => ({
          value: voucher.id,
          label: `${voucher.voucherName} - Giảm ${voucher.reducedPercent}% (Tối đa ${voucher.maxDiscount.toLocaleString()}₫)`,
          ...voucher,
        }));

        setVouchers(formattedVouchers);

        if (formattedVouchers.length > 0) {
          setSelectedVoucher(formattedVouchers[0]);
        }
      } catch (error) {
        console.error("Unexpected error in fetchAllData:", error);
        toast.error("Đã xảy ra lỗi không mong muốn.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [totalAmount]);

  const handleVoucherChange = (selectedOption) => {
    setSelectedVoucher(selectedOption);
  };

  const calculateVoucherDiscount = () => {
    if (!selectedVoucher || totalAmount < selectedVoucher.minCondition) {
      return 0;
    }

    const discountAmount = (totalAmount * selectedVoucher.reducedPercent) / 100;
    return Math.min(discountAmount, selectedVoucher.maxDiscount);
  };

  const handleProvinceChange = async (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    console.log(
      "Thay đổi tỉnh/thành phố:",
      selectedOption ? selectedOption.label : "Không có dữ liệu"
    );
    try {
      const response = await GHNService.getDistrictsByProvince(
        selectedOption.value
      );
      setDistricts(
        response.data.map((district) => ({
          value: district.DistrictID,
          label: district.DistrictName,
        }))
      );
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (selectedOption) => {
    if (selectedDistrict?.value !== selectedOption.value) {
      setSelectedDistrict(selectedOption);
      setSelectedWard(null);
      setWards([]);
      console.log(
        "Thay đổi quận/huyện:",
        selectedOption ? selectedOption.label : "Không có dữ liệu"
      );
      try {
        const response = await GHNService.getWardsByDistrict(
          selectedOption.value
        );
        setWards(
          response.data.map((ward) => ({
            value: ward.WardCode,
            label: ward.WardName,
          }))
        );
      } catch (error) {
        toast.error("Không thể tải danh sách phường/xã");
      }
    }
  };

  const handleSelectAddress = async (selectedOption) => {
    if (!selectedOption || !selectedOption.fullAddress) {
      toast.error("Địa chỉ không hợp lệ.");
      return;
    }
    setSelectedAddress(selectedOption);

    const provinceName = selectedOption.fullAddress.provinceName.replace(
      "Tỉnh ",
      ""
    );
    const province = provinces.find((p) => {
      const provinceLabel = p.label.replace("Tỉnh ", "");
      return provinceLabel === provinceName;
    });

    if (!province) {
      console.log("Danh sách tỉnh/thành hiện tại:", provinces);
      return;
    }

    setSelectedProvince(province);

    console.log("Địa chỉ được chọn để tính phí vận chuyển:", {
      province: selectedOption.fullAddress.provinceName,
      district: selectedOption.fullAddress.districtName,
      ward: selectedOption.fullAddress.wardName,
    });

    try {
      let district = districts.find(
        (d) => d.label === selectedOption.fullAddress.districtName
      );
      if (!district) {
        console.log("Fetching districts for province:", province.label);
        const districtResponse = await GHNService.getDistrictsByProvince(
          province.value
        );
        if (!districtResponse.data || !districtResponse.data.length) {
          throw new Error("Không tìm thấy quận/huyện cho tỉnh này.");
        }
        const newDistricts = districtResponse.data.map((district) => ({
          value: district.DistrictID,
          label: district.DistrictName,
        }));
        setDistricts(newDistricts);
        district = newDistricts.find(
          (d) => d.label === selectedOption.fullAddress.districtName
        );
      }

      if (!district) {
        throw new Error("Không tìm thấy quận/huyện phù hợp.");
      }
      setSelectedDistrict(district);
      console.log("Selected district:", district.label);

      let ward = wards.find(
        (w) => w.label === selectedOption.fullAddress.wardName
      );
      if (!ward) {
        console.log("Fetching wards for district:", district.label);
        const wardResponse = await GHNService.getWardsByDistrict(
          district.value
        );
        if (!wardResponse.data || !wardResponse.data.length) {
          throw new Error("Không tìm thấy phường/xã cho quận/huyện này.");
        }
        const newWards = wardResponse.data.map((ward) => ({
          value: ward.WardCode,
          label: ward.WardName,
        }));
        setWards(newWards);
        ward = newWards.find(
          (w) => w.label === selectedOption.fullAddress.wardName
        );
      }

      if (!ward) {
        throw new Error("Không tìm thấy phường/xã phù hợp.");
      }
      setSelectedWard(ward);
      console.log("Selected ward:", ward.label);

      console.log("Calculating shipping fee for:", {
        districtId: district.value,
        wardCode: ward.value,
      });
      const response = await GHNService.calculateShippingFee({
        toDistrictId: district.value,
        toWardCode: ward.value,
        weight: 1000,
        items: items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
        })),
      });

      setShippingFee(response.data.total);
      console.log("New shipping fee:", response.data.total);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
      setShippingFee(0);
      toast.error("Không thể tính phí vận chuyển: " + error.message);
    }
  };

  const handleWardChange = (selectedOption) => {
    setSelectedWard(selectedOption);
    console.log(
      "Thay đổi phường/xã:",
      selectedOption ? selectedOption.label : "Không có dữ liệu"
    );
  };

  const handleCalculateShippingFee = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Vui lòng chọn đầy đủ tỉnh, quận, phường.");
      return;
    }

    if (!customAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết.");
      return;
    }

    const newAddress = {
      id: Date.now(),
      addressDetail: customAddress.trim(),
      wardName: selectedWard.label,
      districtName: selectedDistrict.label,
      provinceName: selectedProvince.label,
    };

    try {
      console.log("Calculating shipping fee for new address:", {
        districtId: selectedDistrict.value,
        wardCode: selectedWard.value,
      });
      const response = await GHNService.calculateShippingFee({
        toDistrictId: selectedDistrict.value,
        toWardCode: selectedWard.value,
        weight: 1000,
        items: items.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
        })),
      });

      setShippingFee(response.data.total);
      console.log("New shipping fee (new address):", response.data.total);

      const formattedAddress = `${newAddress.addressDetail}, ${newAddress.wardName}, ${newAddress.districtName}, ${newAddress.provinceName}`;

      setUserAddresses((prev) => [
        ...prev,
        {
          value: newAddress.id,
          label: formattedAddress,
          fullAddress: newAddress,
        },
      ]);

      setSelectedAddress({
        value: newAddress.id,
        label: formattedAddress,
        fullAddress: newAddress,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
      toast.error("Không thể tính phí vận chuyển.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone and address
    if (!formData.phone) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Vui lòng chọn hoặc thêm địa chỉ giao hàng.");
      return;
    }

    // Show confirmation modal instead of window.confirm
    setIsConfirmModalOpen(true);
  };

  // Handle confirmation from modal
  const handleConfirmOrder = async () => {
    setIsConfirmModalOpen(false);
    setIsOrdering(true);

    const orderData = {
      phone: formData.phone,
      address: selectedAddress?.fullAddress
        ? `${selectedAddress.fullAddress.addressDetail}, ${selectedAddress.fullAddress.wardName}, ${selectedAddress.fullAddress.districtName}, ${selectedAddress.fullAddress.provinceName}`
        : "",
      voucherId: selectedVoucher ? selectedVoucher.value : null,
      shipfee: shippingFee,
      paymentMethod: paymentMethod === "cod" ? 1 : 2,
      statusOrder: 0,
      orderOnlineDetails: items.map((item) => ({
        productDetailId: item.productDetailId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await PaymentService.createOrder(orderData);
      console.log(response);
      if (response?.data?.id) {
        toast.success("Đặt hàng thành công!");
        if (paymentMethod === "vnpay") {
          const paymentUrl = await PaymentService.createPaymentUrl(
            response?.data?.orderCode
          );
          window.location.href = paymentUrl;
        } else {
          setTimeout(() => navigate("/"), 3000);
        }
      } else {
        toast.error("Đặt hàng thất bại, vui lòng thử lại.");
        setIsOrdering(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại."
      );
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <ToastContainer />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Thông tin khách hàng
                </h2>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["fullName", "email", "phone"].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === "fullName"
                        ? "Họ và tên"
                        : field === "email"
                          ? "Email"
                          : "Số điện thoại"}
                    </label>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "phone"
                            ? "tel"
                            : "text"
                      }
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      readOnly={["fullName", "email"].includes(field)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                      placeholder={`Nhập ${field === "fullName" ? "họ và tên" : field === "email" ? "email" : "số điện thoại"}`}
                      required
                    />
                  </div>
                ))}
              </form>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Địa chỉ giao hàng
              </h2>
              {!selectedAddress && (
                <p className="text-sm text-red-600 mb-4">
                  Vui lòng chọn hoặc thêm địa chỉ giao hàng để tiếp tục.
                </p>
              )}
              {userAddresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {userAddresses.slice(0, 2).map((address, index) => (
                    <label
                      key={index}
                      className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="addressSelection"
                        checked={selectedAddress?.value === address.value}
                        onChange={() => handleSelectAddress(address)}
                        className="h-4 w-4 mt-1 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900 block">
                          {address.label.split(",")[0]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {address.label.split(",").slice(1).join(",")}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <Select
                options={userAddresses}
                value={selectedAddress}
                onChange={handleSelectAddress}
                placeholder="Chọn địa chỉ khác"
                className="mb-4"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-2.5 px-4 flex items-center justify-center w-full bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-medium rounded-md shadow-sm transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
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

            {/* Sản phẩm trong giỏ hàng */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Sản phẩm trong giỏ hàng
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {items.length} sản phẩm
                </span>
              </div>
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const unitPrice = item.discountPrice || item.price;
                  const totalPrice = unitPrice * item.quantity;

                  return (
                    <div key={item.id} className="py-4 flex items-center">
                      <div className="relative">
                        <img
                          src={item.photo}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.productDetailName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Thương hiệu: {item.brandName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Giá:{" "}
                          {item.discountPrice == item.price
                            ? (
                              <>
                                <span className="text-red-500 font-semibold">
                                  {item.discountPrice.toLocaleString()}₫
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-red-500 font-semibold">
                                  {item.discountPrice.toLocaleString()}₫
                                </span>{" "}
                                <span className="line-through text-gray-400 text-xs">
                                  {item.price.toLocaleString()}₫
                                </span>
                              </>
                            )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Số lượng: {item.quantity?.toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Tổng: {totalPrice.toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-900 block">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-xs text-gray-500">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </span>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-900 block">
                      Thanh toán qua VN Pay
                    </span>
                    <span className="text-xs text-gray-500">
                      Hỗ trợ thanh toán an toàn qua VN Pay
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-1">
            {/* Tóm tắt đơn hàng */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-4 py-4 border-t border-b">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">
                    Tạm tính ({items.length} sản phẩm):
                  </span>
                  <span className="text-sm font-medium">
                    {totalAmount.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Phí vận chuyển:</span>
                  <span className="text-sm font-medium">
                    {shippingFee.toLocaleString()}₫
                  </span>
                </div>
                {selectedVoucher && calculateVoucherDiscount() > 0 && (
                  <div className="flex justify-between text-green-600 mt-2">
                    <span className="text-sm">Giảm giá:</span>
                    <span className="text-sm font-medium">
                      -{calculateVoucherDiscount().toLocaleString()}₫
                    </span>
                  </div>
                )}
                {selectedVoucher && (
                  <div className="mt-3 flex items-center bg-green-100 text-green-700 p-3 rounded-md">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      Đã áp dụng mã giảm giá: {selectedVoucher.label}
                    </p>
                  </div>
                )}
                {vouchers.length > 0 && (
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 text-orange-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 14l6-6M15 10l-6-6M3 12h18M3 6h18"
                        />
                      </svg>
                      Khuyến mãi
                    </h3>
                    <div className="flex flex-col gap-3">
                      <Select
                        options={vouchers}
                        value={selectedVoucher}
                        onChange={handleVoucherChange}
                        placeholder="Chọn voucher"
                        className="w-full border-gray-300 rounded-md"
                      />
                      <button className="py-2 px-4 w-full bg-amber-500 text-white rounded-md hover:bg-amber-600 transition">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng thanh toán:
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  {finalTotal.toLocaleString()}₫
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className={`w-full py-3 text-lg font-medium rounded-md transition-colors flex items-center justify-center ${isOrdering
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    }`}
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    "Đặt hàng ngay"
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Bằng cách đặt hàng, bạn đồng ý với
                  <a href="#" className="text-orange-600 hover:underline">
                    {" "}
                    Điều khoản dịch vụ
                  </a>{" "}
                  của chúng tôi.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-xs">Thanh toán bảo mật</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12，这是:1px solid #000000;"
                    >
                      {" "}
                    </path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-xs">100% chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal địa chỉ */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Thêm địa chỉ mới
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố
                  </label>
                  <Select
                    options={provinces}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    placeholder="Chọn tỉnh/thành"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <Select
                    options={districts}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    placeholder="Chọn quận/huyện"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <Select
                    options={wards}
                    value={selectedWard}
                    onChange={handleWardChange}
                    placeholder="Chọn phường/xã"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Nhập số nhà, tên đường"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCalculateShippingFee}
                  className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Xác nhận đặt hàng
                </h2>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
              <div className="space-y-4">
                <p className="text-gray-700">
                  Bạn có chắc chắn muốn đặt đơn hàng với tổng thanh toán{" "}
                  <span className="font-semibold text-orange-600">
                    {finalTotal.toLocaleString()}₫
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
