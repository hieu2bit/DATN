import { useEffect } from "react";
import {
  FaPhoneVolume,
  FaGift,
  FaExchangeAlt,
  FaTag,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  useEffect(() => {
    // Tạo script Rasa Webchat
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js";
    script.async = true;
    script.onload = () => {
      window.WebChat.default(
        {
          initPayload: "/greet",
          customData: { language: "vi" }, // truyền metadata (vd: ngôn ngữ)
          socketUrl: "http://localhost:5005",
          socketPath: "/socket.io/",
          title: "Mộc Wear Chatbot",
          subtitle: "Hỗ trợ khách hàng",
          showFullScreenButton: true,
          showCloseButton: true,
          params: { storage: "local" }, // lưu lịch sử chat
        },
        null
      );
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section className="p-6 mt-4 bg-gray-100 rounded-lg shadow-lg">
      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-300">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
              Chính sách
            </h3>
            <ul className="text-gray-700">
              <li>Chính sách thành viên</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách vận chuyển vào giao nhận</li>
              <li>Bảo mật thông tin cá nhân</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
              Hướng dẫn
            </h3>
            <ul className="text-gray-700">
              <li>Hướng dẫn mua hàng</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Hướng dẫn giao nhận</li>
              <li>Điều khoản dịch vụ</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
              Thông tin liên hệ
            </h3>
            <p className="text-gray-700">
              Công ty TNHH Men's Fashion MộcWear chuyên sản xuất - phân phối -
              bán lẻ thời trang nam.
            </p>
            <p className="text-gray-700">
              Địa chỉ: 70 Lữ Gia, Phường 15, Quận 11, TP.HCM
            </p>
            <p className="text-gray-700">Điện thoại: 1900 6750</p>
            <p className="text-gray-700">Email: support@mocwear.com.vn</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">
              FanPage chúng tôi
            </h3>
            <div className="flex">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fchuyenbanbuonbanlegiarevn&tabs&width=340&height=130&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=false&appId"
                width="340"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="facebook-page"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Mạng xã hội */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-[#1E3A8A] mb-3">Mạng xã hội</h3>
          <div className="flex justify-center space-x-4 text-2xl">
            <a
              href="#"
              className="text-[#1E3A8A] hover:text-[#163172] transition"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-[#1E3A8A] hover:text-[#163172] transition"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="text-[#1E3A8A] hover:text-[#163172] transition"
            >
              <FaTiktok />
            </a>
            <a
              href="#"
              className="text-[#1E3A8A] hover:text-[#163172] transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Tên thương hiệu */}
        <div className="text-center mt-6 text-2xl font-bold text-black">
          Men's<span className="text-[#1E3A8A]">Fashion MộcWear</span>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
