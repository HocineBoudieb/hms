import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Duration } from "luxon";

const Metrics = () => {
    const [products, setProducts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [orders, setOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const productResponse = await axios.get("http://localhost:8081/products");
            const activityResponse = await axios.get("http://localhost:8081/activities");
            setProducts(productResponse.data);
            setActivities(activityResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            setLoading(false);
        }
    };

    const fetchOrdersForActivity = async (activityId) => {
        try {
            const response = await axios.get(`http://localhost:8081/activities/${activityId}`);
            setOrders(prev => ({ ...prev, [`activity-${activityId}`]: response.data }));
        } catch (error) {
            console.error("Erreur lors de la récupération des ordres de fabrication:", error);
        }
    };

    const fetchOrdersForProduct = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8081/products/${productId}`);
            setOrders(prev => ({ ...prev, [`product-${productId}`]: response.data }));
        } catch (error) {
            console.error("Erreur lors de la récupération des ordres de fabrication:", error);
        }
    };

    const handleRowClick = (type, id) => {
        const key = `${type}-${id}`;
        if (expandedRow === key) {
            setExpandedRow(null);
        } else {
            setExpandedRow(key);
            if (!orders[key]) {
                if (type === "activity") fetchOrdersForActivity(id);
                if (type === "product") fetchOrdersForProduct(id);
            }
        }
    };
    
    return (
        <div className="p-6 ml-64 mt-16">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableau de Bord des Métriques</h1>
            {loading ? (
                <p className="text-gray-600">Chargement...</p>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Temps de prise en charge par activité</h2>
                    <TableContainer component={Paper} className="mt-4 shadow-sm rounded-lg border border-gray-100">
                        <Table className="min-w-full">
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold text-gray-700 py-3">Nom de l'activité</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">ID de l'atelier</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Temps moyen de prise en charge (heures)</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Détails</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.map(activity => (
                                    <React.Fragment key={activity.id}>
                                        <TableRow 
                                            onClick={() => handleRowClick("activity", activity.id)} 
                                            className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        >
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{activity.name}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{activity.workshopId}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{activity.averageHandlingTime ? Duration.fromMillis(activity.averageHandlingTime).toFormat("hh:mm:ss") : 'N/A'}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">
                                                {expandedRow === `activity-${activity.id}` ? <ExpandLess className="text-gray-500" /> : <ExpandMore className="text-gray-500" />}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={4} className="p-0">
                                                <Collapse in={expandedRow === `activity-${activity.id}`} timeout="auto" unmountOnExit>
                                                    <TableContainer component={Paper} className="mt-2 shadow-inner rounded-lg border border-gray-100">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow className="bg-orange-50">
                                                                    <TableCell className="font-semibold text-gray-700 py-2">ID de l'Ordre</TableCell>
                                                                    <TableCell className="font-semibold text-gray-700 py-2">Temps de Prise en Charge (heures)</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {(orders[`activity-${activity.id}`] || []).map((order, index) => (
                                                                    <TableRow key={index} className="hover:bg-orange-100 transition-colors duration-200">
                                                                        <TableCell className="py-2 text-gray-600 border-b border-gray-100">{order.id}</TableCell>
                                                                        <TableCell className="py-2 text-gray-600 border-b border-gray-100">
                                                                            {order.traversalTime
                                                                                ? `${Math.floor(order.traversalTime / 1000 / 60 / 60)}h ${Math.floor(order.traversalTime / 1000 / 60) % 60}min`
                                                                                : 'N/A'}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">Temps de traversée par produit</h2>
                    <TableContainer component={Paper} className="mt-4 shadow-sm rounded-lg border border-gray-100">
                        <Table className="min-w-full">
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold text-gray-700 py-3">Matériau du produit</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Couleur</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Option</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Temps de traversée (heures)</TableCell>
                                    <TableCell className="font-semibold text-gray-700 py-3">Détails</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map(product => (
                                    <React.Fragment key={product.id}>
                                        <TableRow 
                                            onClick={() => handleRowClick("product", product.id)} 
                                            className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        >
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{product.material}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{product.color}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{product.option}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">{product.averagePrdDuration ? Duration.fromMillis(product.averagePrdDuration).toFormat("hh:mm:ss") : 'N/A'}</TableCell>
                                            <TableCell className="py-3 text-gray-600 border-b border-gray-100">
                                                {expandedRow === `product-${product.id}` ? <ExpandLess className="text-gray-500" /> : <ExpandMore className="text-gray-500" />}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} className="p-0">
                                                <Collapse in={expandedRow === `product-${product.id}`} timeout="auto" unmountOnExit>
                                                    <TableContainer component={Paper} className="mt-2 shadow-inner rounded-lg border border-gray-100">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow className="bg-orange-50">
                                                                    <TableCell className="font-semibold text-gray-700 py-2">ID de l'Ordre</TableCell>
                                                                    <TableCell className="font-semibold text-gray-700 py-2">Temps de traversée (heures)</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {(orders[`product-${product.id}`] || []).map(order => (
                                                                    <TableRow key={order.id} className="hover:bg-orange-100 transition-colors duration-200">
                                                                        <TableCell className="py-2 text-gray-600 border-b border-gray-100">{order.id}</TableCell>
                                                                        <TableCell className="py-2 text-gray-600 border-b border-gray-100">{order.traversalTime ? Duration.fromMillis(order.traversalTime).toFormat("hh:mm:ss") : 'N/A'}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </div>
    );
};

export default Metrics;