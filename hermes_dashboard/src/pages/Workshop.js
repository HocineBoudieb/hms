import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * Workshop component fetches and displays workshop, encours, and orders details.
 * 
 * It uses the workshopId from the URL parameters to load the relevant data. 
 * If the workshopId is 0, it fetches all orders. Otherwise, it fetches details for a specific workshop.
 * The component also fetches encours data related to the workshop and trolleys.
 * 
 * State:
 * - workshop: Object containing workshop details.
 * - encours: Object containing encours details.
 * - orders: Array of orders associated with the workshop or all orders if workshopId is 0.
 * - selectedOrder: The ID of the currently selected order.
 * - isModalVisible: Boolean indicating if the modal is visible.
 * - trolley: Array of trolley data.
 * 
 * Effects:
 * - Fetches workshop data based on workshopId.
 * - Fetches encours data when workshop changes.
 * - Fetches trolley data when orders change.
 * 
 * Returns a loading state if data is being fetched, otherwise displays the workshop and encours details.
 * Shows a modal for assigning a trolley to an order when an order is clicked.
 */

const Workshop = () => {
    const { workshopId: id } = useParams();
    const [workshop, setWorkshop] = useState(null);
    const [encours, setEncours] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [trolley, setTrolley] = useState([]);
    const [selectedTrolleyId, setSelectedTrolleyId] = useState(null);


    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                if(parseInt(id) === 0){
                    const response = await axios.get('http://localhost:8081/orders');
                    console.log("data", response.data);
                    setOrders(response.data);
                }else{
                    const response = await axios.get(`http://localhost:8081/workshops/${id}`);
                    setWorkshop(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch workshop:", error);
            }
        };
        fetchWorkshop();
    }, [id]);

    useEffect(() => {
        if (!workshop) {
            return;
        }
        const fetchEncours = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/encours/${workshop.enCoursId}`);
                setEncours(response.data);
            } catch (error) {
                console.error('Failed to fetch encours:', error);
            }
        }
        
        fetchEncours();
    }, [workshop]);

    useEffect(() => {
        const fetchTrolley = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/rfids/trolleys`);
                console.log("trolley", response.data);
                setTrolley(response.data);
            } catch (error) {
                console.error('Failed to fetch trolley:', error);
            }
        }
        
        fetchTrolley();
        
    },[orders]);

    const handleOrderClick = (orderId) => {
        setSelectedOrder(orderId);
        setIsModalVisible(true);
    };

    const handleTrolleyAssign = async () => {
        try {
            console.log("Assigning trolley to order:",selectedTrolleyId, selectedOrder);
            await axios.post(`http://localhost:8081/orders/assign`, {selectedOrder, selectedTrolleyId});
            setIsModalVisible(false);
        } catch (error) {
            console.error('Failed to assign trolley to order:', error);
        }
    };

    if (parseInt(id) !== 0 && (!workshop || !encours)) {
        // Loading or error state
        return <div>Loading...</div>;
    }
    if(parseInt(id) !== 0){
        return (
            <div className="flex flex-col w-full bg-[#f8f8f8] p-8">
                <h1 className="text-4xl font-bold text-center mb-8">{workshop.name}</h1>
                <div className="flex flex-row w-full">
                    <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">OF Atelier</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Map over workshop orders */}
                                
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">OF EnCours</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Map over encours orders */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return(
        <div className="w-full flex">
            {isModalVisible && (   
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Assigner un chariot à l'OF {selectedOrder}</h2>
                <select
                    className="w-full p-2 mb-4 border border-gray-400 rounded"
                    value={selectedTrolleyId || ''}
                    onChange={(e) => setSelectedTrolleyId(e.target.value)}
                    >
                <option value="">Choisissez un chariot</option>
                {trolley.map((t) => (
                    <option key={t.id} value={t.id}>
                    {t.trolley}
                    </option>
                ))}
                </select>
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                    handleTrolleyAssign();
                    setIsModalVisible(false);
                    }}
                >
                    Assigner
                </button>
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 ml-4 rounded"
                    onClick={() => setIsModalVisible(false)}
                >
                    Cancel
                </button>
                </div>
            </div>)}
            <div className="flex flex-col h-full w-full bg-white shadow p-8 m-4 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Ordres de Fabrication Disponibles</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.filter(order => order.status === 0).map(order => (
                            <tr key={order.id} onClick={() => handleOrderClick(order.id)}>
                                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.Product.material} {order.Product.color} {order.Product.option}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
            
        );
    }
};

export default Workshop;



