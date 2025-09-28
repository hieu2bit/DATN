import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyRevenueChart = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getMonthlyRevenue();
                const formattedData = data.map(item => ({
                    month: `Tháng ${item.monthNumber}`,
                    revenue: item.monthlyRevenue || 0,
                }));
                setMonthlyRevenue(formattedData);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải doanh thu tháng:", err);
                setError("Không thể tải dữ liệu doanh thu tháng.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-2">
                <CardContent>
                    <h2 className="text-xl font-bold">Doanh thu theo tháng</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo tháng</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="revenue" fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MonthlyRevenueChart;