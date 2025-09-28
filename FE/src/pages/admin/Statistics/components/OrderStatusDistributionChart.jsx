import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "./card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const OrderStatusDistributionChart = () => {
    const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getOrderStatusDistribution();
                setOrderStatusDistribution(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải tỷ lệ đơn hàng theo trạng thái:", err);
                setError("Không thể tải dữ liệu tỷ lệ đơn hàng theo trạng thái.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold">Tỷ lệ đơn hàng theo trạng thái</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6347", "#4682B4", "#DAA520"];

    return (
        <Card>
            <CardContent>
                <h2 className="text-xl font-bold">Tỷ lệ đơn hàng theo trạng thái</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={orderStatusDistribution}
                            dataKey="orderCount"
                            nameKey="statusName"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {orderStatusDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default OrderStatusDistributionChart;