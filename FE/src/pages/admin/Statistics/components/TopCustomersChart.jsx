import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "./card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TopCustomersChart = () => {
    const [topCustomers, setTopCustomers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getTop5Customers();
                setTopCustomers(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải top khách hàng:", err);
                setError("Không thể tải dữ liệu top khách hàng.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-3">
                <CardContent>
                    <h2 className="text-xl font-bold">Top 5 khách hàng mua nhiều nhất</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3">
            <CardContent>
                <h2 className="text-xl font-bold">Top 5 khách hàng mua nhiều nhất</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topCustomers}>
                        <XAxis dataKey="customerName" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Legend />
                        <Bar dataKey="totalSpent" fill="#8884d8" name="Tổng chi tiêu" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TopCustomersChart;