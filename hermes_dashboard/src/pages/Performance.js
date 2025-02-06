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
           <div className="flex flex-col">
                <div className="mt-16 ml-64">
                    <h1 className="text-2xl first-letter:text-4xl font-thin tracking-[0.2em] ml-8 mt-8">
                        PERFORMANCES PAR PRODUIT
                    </h1>
                </div>
                <GanttChartByProduct orders={orders} />
            </div>
    );
}

export default PerformanceTracking;