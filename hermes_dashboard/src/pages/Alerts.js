import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const alertTypeMap = {
    1: "Exist in two localisation",
    2: "Exit an en-cours without support",
    3: "Test"
};

const alertStatusMap = {
    0: "Resolved",
    1: "Active"
};

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [metrics, setMetrics] = useState({
        totalAlerts: 0,
        activeAlerts: 0,
        avgResolutionTime: 0,
        typeDistribution: {}
    });

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get("http://localhost:8081/alerts");
                setAlerts(response.data);
                calculateMetrics(response.data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };
        fetchAlerts();
    }, []);

    

    const calculateMetrics = (alerts) => {
        const totalAlerts = alerts.length;
        const activeAlerts = alerts.filter(a => a.status === 1).length;
        const resolvedAlerts = alerts.filter(a => a.status === 0);
        
        const totalResolutionTime = resolvedAlerts.reduce((sum, alert) => {
            return sum + (new Date(alert.endDate) - new Date(alert.startDate));
        }, 0);
        
        const avgResolutionTime = resolvedAlerts.length > 0 
            ? totalResolutionTime / resolvedAlerts.length / (1000 * 60) // in minutes
            : 0;

        const typeDistribution = alerts.reduce((acc, alert) => {
            const typeName = alertTypeMap[alert.type] || `Unknown (${alert.type})`;
            acc[typeName] = (acc[typeName] || 0) + 1;
            return acc;
        }, {});

        setMetrics({
            totalAlerts,
            activeAlerts,
            avgResolutionTime: avgResolutionTime.toFixed(2),
            typeDistribution
        });
    };

    const chartData = {
        labels: Object.keys(metrics.typeDistribution),
        datasets: [{
            data: Object.values(metrics.typeDistribution),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div className="flex flex-col ml-64 mt-16">
            <h1 className="text-2xl first-letter:text-4xl font-thin tracking-[0.2em] mb-8">ALERTS DASHBOARD</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <MetricCard title="Total Alerts" value={metrics.totalAlerts} />
                    <MetricCard title="Active Alerts" value={metrics.activeAlerts} />
                    <MetricCard title="Avg. Resolution Time" value={`${metrics.avgResolutionTime} min`} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '45%', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
                        <h2 style={{ marginTop: 0 }}>Alert Type Distribution</h2>
                        <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                    
                    <div style={{ width: '50%', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                        <h2 style={{ marginTop: 0 }}>Recent Alerts</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {alerts.slice(0, 5).map((alert) => (
                                <li key={alert.id} style={{ marginBottom: '10px', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                                    <strong>Order ID: {alert.orderId}</strong><br />
                                    Type: {alertTypeMap[alert.type] || `Unknown (${alert.type})`}<br />
                                    Status: {alertStatusMap[alert.status] || `Unknown (${alert.status})`}<br />
                                    Start: {new Date(alert.startDate).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value }) => (
    <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', width: '30%' }}>
        <h3 style={{ margin: 0, color: '#666' }}>{title}</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#333' }}>{value}</p>
    </div>
);

export default Alerts;
