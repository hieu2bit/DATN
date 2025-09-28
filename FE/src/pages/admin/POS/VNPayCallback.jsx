import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SalePOS from "../../../services/POSService"; // Import SalePOS để gọi API nếu cần

const VNPayCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            // Lấy các tham số từ URL callback
            const params = new URLSearchParams(location.search);
            const vnpResponseCode = params.get("vnp_ResponseCode"); // Mã trạng thái giao dịch
            const vnpTxnRef = params.get("vnp_TxnRef"); // orderId từ VNPay (dạng String)

            // Lấy orderId từ localStorage để so sánh
            const pendingOrderId = localStorage.getItem("pendingOrderId");

            // Kiểm tra tính hợp lệ của orderId
            if (!vnpTxnRef || vnpTxnRef !== pendingOrderId) {
                console.error("❌ Không tìm thấy hoặc orderId không khớp!");
                alert("Không tìm thấy ID đơn hàng hoặc ID không khớp!");
                navigate("/pos");
                return;
            }

            try {
                // Kiểm tra trạng thái giao dịch
                if (vnpResponseCode === "00") {
                    // Gọi API để hoàn tất thanh toán và cập nhật tồn kho
                    const paymentData = {
                        customerId: parseInt(localStorage.getItem("pendingCustomerId")) || -1,
                        voucherId: parseInt(localStorage.getItem("pendingVoucherId")) || null,
                    };

                    const response = await SalePOS.completePayment(vnpTxnRef, paymentData);
                    console.log("✅ Thanh toán VNPay thành công:", response);

                    alert("Thanh toán thành công! Đơn hàng của bạn đã được xử lý.");
                } else {
                    console.log(`❌ Thanh toán thất bại cho đơn hàng #${vnpTxnRef}, mã lỗi: ${vnpResponseCode}`);
                    alert(`Thanh toán thất bại: Mã lỗi ${vnpResponseCode}. Vui lòng thử lại.`);
                }
            } catch (error) {
                console.error("❌ Lỗi khi xử lý callback:", error);
                alert("Có lỗi xảy ra khi xử lý thanh toán!");
            } finally {
                // Xóa các giá trị khỏi localStorage
                localStorage.removeItem("pendingOrderId");
                localStorage.removeItem("pendingCustomerId");
                localStorage.removeItem("pendingVoucherId");
                // Chuyển hướng về trang POS
                navigate("/pos");
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Đang xử lý thanh toán...</h2>
                <p>Vui lòng chờ trong giây lát.</p>
            </div>
        </div>
    );
};

export default VNPayCallback;