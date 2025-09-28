// import React, { useEffect, useState } from "react";
// import StatisticsService from "../../../../services/StatisticsService";
// import { Card, CardContent } from "./card";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const PaymentMethodDistributionChart = () => {
//     const [paymentMethodDistribution, setPaymentMethodDistribution] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await StatisticsService.getPaymentMethodDistribution();
//                 setPaymentMethodDistribution(data);
//                 setError(null);
//             } catch (err) {
//                 console.error("Lỗi khi tải tỷ lệ thanh toán theo phương thức:", err);
//                 setError("Không thể tải dữ liệu tỷ lệ thanh toán theo phương thức.");
//             }
//         };
//         fetchData();
//     }, []);

//     if (error) {
//         return (
//             <Card>
//                 <CardContent>
//                     <h2 className="text-xl font-bold">Tỷ lệ thanh toán theo phương thức</h2>
//                     <p className="text-red-500">{error}</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     const COLORS = ["#0088FE", "#00C49F"];

//     return (
//         <Card>
//             <CardContent>
//                 <h2 className="text-xl font-bold">Tỷ lệ thanh toán theo phương thức</h2>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                         <Pie
//                             data={paymentMethodDistribution}
//                             dataKey="orderCount"
//                             nameKey="methodName"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                             fill="#8884d8"
//                             label
//                         >
//                             {paymentMethodDistribution.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </CardContent>
//         </Card>
//     );
// };

// export default PaymentMethodDistributionChart;