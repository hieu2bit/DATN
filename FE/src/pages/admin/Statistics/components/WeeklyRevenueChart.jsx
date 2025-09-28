import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WeeklyRevenueChart = () => {
    const [weeklyRevenue, setWeeklyRevenue] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getWeeklyRevenue();
                const formattedData = data.map(item => ({
                    week: `Tuần ${item.weekNumber}`,
                    revenue: item.weeklyRevenue || 0,
                }));
                setWeeklyRevenue(formattedData);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải doanh thu tuần:", err);
                setError("Không thể tải dữ liệu doanh thu tuần.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-2">
                <CardContent>
                    <h2 className="text-xl font-bold">Doanh thu theo tuần</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo tuần</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyRevenue}>
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default WeeklyRevenueChart;