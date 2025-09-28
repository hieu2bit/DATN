import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "./card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ChannelRevenueChart = () => {
    const [channelRevenue, setChannelRevenue] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getChannelRevenue();
                const formattedData = data.map(item => ({
                    date: `${item.dayNumber}/${item.monthNumber}/${item.yearNumber}`,
                    onlineRevenue: item.onlineRevenue || 0,
                    inStoreRevenue: item.inStoreRevenue || 0,
                }));
                setChannelRevenue(formattedData);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải doanh thu theo kênh:", err);
                setError("Không thể tải dữ liệu doanh thu theo kênh.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-2">
                <CardContent>
                    <h2 className="text-xl font-bold">Doanh thu theo kênh</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardContent>
                <h2 className="text-xl font-bold">Doanh thu theo kênh</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={channelRevenue}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString("vi-VN")} đ`} />
                        <Legend />
                        <Line type="monotone" dataKey="onlineRevenue" stroke="#8884d8" name="Online" />
                        <Line type="monotone" dataKey="inStoreRevenue" stroke="#82ca9d" name="Tại Quầy" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ChannelRevenueChart;