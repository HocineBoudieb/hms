import React, { useEffect, useState } from "react";
import axios from "axios";
import apiUrl from '../api';
//import GanttChart from "components/Gantt";
import GanttChartByProduct from "components/PerfProd";

const PerformanceTracking = () => {
    const [orders, setOrders] = useState([]);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(apiUrl+'/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="flex flex-col w-full bg-[#f8f8f8] p-8 mt-16 ml-64">
            <h1>Performance Tracking</h1>
            <GanttChartByProduct orders={orders} />
        </div>
    );
}

export default PerformanceTracking;