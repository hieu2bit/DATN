// import { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import ProductDetailService from "../../services/ProductDetailService";

// const SearchPage = () => {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("query"); // Lấy từ khóa tìm kiếm từ URL
//   const [sanPhams, setSanPhams] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const params = { search: query }; // Gửi tham số tìm kiếm
//         const data = await ProductDetailService.getAllProductDetails(params);
//         setSanPhams(data || []);
//       } catch (error) {
//         console.error("Lỗi khi tìm kiếm sản phẩm:", error);
//       }
//     };

//     if (query) {
//       fetchProducts();
//     }
//   }, [query]);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-blue-700">
//         Kết quả tìm kiếm cho: "{query}"
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
//         {sanPhams.length > 0 ? (
//           sanPhams.map((sanPham) => (
//             <div
//               key={sanPham.id}
//               onClick={() => navigate(`/san-pham/${sanPham.id}`)}
//               className="cursor-pointer bg-white p-4 shadow-md rounded-lg hover:shadow-xl transition-transform hover:scale-105"
//             >
//               <img
//                 src={sanPham.photo || "/src/assets/default.jpg"}
//                 alt={sanPham.product.productName}
//                 className="w-full h-52 object-cover rounded-lg"
//               />
//               <h3 className="text-lg font-semibold mt-2">
//                 {sanPham.product.productName}
//               </h3>
//               <p className="text-red-600 font-bold">{sanPham.salePrice} VND</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center w-full">
//             Không tìm thấy sản phẩm nào.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
