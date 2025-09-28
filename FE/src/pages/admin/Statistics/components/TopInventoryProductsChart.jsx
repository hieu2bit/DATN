import React, { useEffect, useState } from "react";
import StatisticsService from "../../../../services/StatisticsService";
import { Card, CardContent } from "./card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TopInventoryProductsChart = () => {
    const [topInventoryProducts, setTopInventoryProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StatisticsService.getTop5InventoryProducts();
                setTopInventoryProducts(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải top sản phẩm tồn kho:", err);
                setError("Không thể tải dữ liệu top sản phẩm tồn kho.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <Card className="col-span-3">
                <CardContent>
                    <h2 className="text-xl font-bold">Top 5 sản phẩm tồn kho nhiều nhất</h2>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-3">
            <CardContent>
                <h2 className="text-xl font-bold">Top 5 sản phẩm tồn kho nhiều nhất</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topInventoryProducts}>
                        <XAxis dataKey="productDetailName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" fill="#82ca9d" name="Số lượng tồn kho" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TopInventoryProductsChart;