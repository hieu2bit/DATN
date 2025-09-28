import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DailyRevenueChart = () => {
    const [dailyRevenue, setDailyRevenue] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getDailyRevenue();
                const formattedData = data.map(item => ({
                    date: `${item.dayNumber}/${item.monthNumber}/${item.yearNumber}`,
                    revenue: item.dailyRevenue || 0,
                }));
                setDailyRevenue(formattedData);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải doanh thu ngày:", err);
                setError("Không thể tải dữ liệu doanh thu ngày.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-3">
                <CardContent>
                    <h2 className="text-xl font-bold">Doanh thu theo ngày</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo ngày</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyRevenue}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DailyRevenueChart;