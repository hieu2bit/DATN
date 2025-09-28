import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "../components/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const YearlyRevenueChart = () => {
    const [yearlyRevenue, setYearlyRevenue] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getYearlyRevenue();
                const formattedData = data.map(item => ({
                    yearNumber: item.yearNumber,
                    yearlyRevenue: item.yearlyRevenue || 0,
                }));
                setYearlyRevenue(formattedData);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải doanh thu năm:", err);
                setError("Không thể tải dữ liệu doanh thu năm.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-2">
                <CardContent>
                    <h2 className="text-xl font-bold">Doanh thu theo năm</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo năm</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yearlyRevenue}>
                        <XAxis dataKey="yearNumber" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Bar dataKey="yearlyRevenue" fill="#d88484" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default YearlyRevenueChart;