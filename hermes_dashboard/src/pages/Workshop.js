import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Duration } from 'luxon';
import Declaration from "../components/Declaration";
import apiUrl from '../api';
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
    const [isLoadingNfc, setIsLoadingNfc] = useState(false);
    const [nfcError, setNfcError] = useState(null);
    const [nfcData, setNfcData] = useState(null);


    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                if(parseInt(id) !== 0){
                    const res = await axios.get(`${apiUrl}/workshops/${id}`);
                    setWorkshop(res.data);
                    
                }
                const response = await axios.get(apiUrl+'/orders');
                console.log("data", response.data);
                setOrders(response.data);
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
                const response = await axios.get(`${apiUrl}/encours/${workshop.enCoursId}`);
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
                const response = await axios.get(`${apiUrl}/rfids/trolleys`);
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
            await axios.post(`${apiUrl}/orders/assign`, {selectedOrder, selectedTrolleyId});
            setIsModalVisible(false);
            //reload the page
            window.location.reload();
        } catch (error) {
            console.error('Failed to assign trolley to order:', error);
        }
    };

    const handleSupport = async (orderId) => {
        setSelectedOrder(orderId);
        if (selectedOrder === orderId && isLoadingNfc) {
            setIsLoadingNfc(false);
            setNfcError(null);
            await axios.post(`${apiUrl}/nfc/${id}/stop-scanning`);
            return;
        } 
        setIsLoadingNfc(true);
        setNfcError(null);

        try {
            // Notify the backend to start scanning
            await axios.post(`${apiUrl}/nfc/${id}/start-scanning`);

            const MAX_RETRY_TIME = 30000;
            const POLL_INTERVAL = 1000; // Intervalle de polling (500 ms)
            const startTime = Date.now(); // Heure de départ
            
            const nfcPoll = async () => {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > MAX_RETRY_TIME) {
                    // Arrête le polling et notifie l'utilisateur
                    setIsLoadingNfc(false);
                    setSelectedOrder(null);
                    setNfcError("Timeout: Pas de badge reçu au bout de 30 secondes.");
                    // Arrête le scanning côté backend
                    await axios.post(`${apiUrl}/nfc/${id}/stop-scanning`);
                    return;
                }

                try {
                    const response = await axios.get(`${apiUrl}/nfc/${id}`);

                    if (response.status === 200 && response.data.nfcId) {
                        // open the declare support modal and stop polling
                        setIsLoadingNfc(false);
                        setNfcData(response.data);

                        // Notify the backend to stop scanning
                        await axios.post(`${apiUrl}/nfc/${id}/stop-scanning`);
                        setIsModalVisible(true);
                        console.log("order data",  selectedOrder);
                    } 
                    else {
                        // Retry polling after a short delay
                        setTimeout(nfcPoll, 500);
                    }
                } catch (pollError) {
                    if (pollError.response?.status === 204) {
                        console.log("No content, retrying...");
                        setTimeout(nfcPoll, POLL_INTERVAL); // Retry on no content
                    } else if (pollError.response?.status === 403) {
                        // Unauthorized
                        setIsLoadingNfc(false);
                        setSelectedOrder(null);
                        setNfcError("Sélectionnez un of pour lire le badge.");
                        await axios.post(`${apiUrl}/nfc/${id}/stop-scanning`);
                    }else {
                        throw pollError;
                    }
                }
            };

            // Start polling for NFC
            await nfcPoll();
        } catch (error) {
            setNfcError("Erreur de Lecture du badge");
            console.error("NFC error:", error);
            setIsLoadingNfc(false);

            // Ensure scanning stops on error
            await axios.post(`${apiUrl}/nfc/${id}/stop-scanning`);
        }
    };

    if (parseInt(id) !== 0 && (!workshop || !encours)) {
        // Loading or error state
        return <div>Loading...</div>;
    }
    if(parseInt(id) !== 0){
        return (   
            <div className="flex flex-col w-full bg-[#f8f8f8] p-8">
                {isModalVisible && (
                    <Declaration
                        orderData={orders.find((order) => order.id === selectedOrder)}
                        nfcData={nfcData}
                        onClose={() =>{
                            setIsModalVisible(false);
                            setSelectedOrder(null);
                            setNfcData(null);
                            window.location.reload();
                        }}
                        workshopId={id}
                    />
                )}
                <h1 className="text-4xl font-bold text-center mb-8">{workshop.name}</h1>
                {isLoadingNfc && (
                <div className="flex items-center justify-center mb-4">
                    <div className="text-blue-500 font-semibold">
                        En attente de lecture du badge...
                    </div>
                </div>
                )}
                {nfcError && (
                    <div className="text-red-500 text-center mb-4">{nfcError}</div>
                )}
                <div className="flex flex-row w-full">
                    <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">OF EnCours</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chevalet</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depuis</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Map over encours orders */}
                                {orders.filter(order => order.enCoursId === encours.id).map((order) => (
                                    <tr key={order.id} onClick={() => handleSupport(order.id)}>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.id}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.Product.material} {order.Product.color} {order.Product.option}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.trolley}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{Duration.fromMillis(order.daysSinceCreation).shiftTo('hours').toHuman({ unitDisplay: "short" })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">OF Atelier</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr >
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chevalet</th>
                                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depuis</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Map over workshop orders and filter for workshop id is id*/}
                                {orders.filter(order => order.workshopId === workshop.id).map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.id}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.Product.material}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{order.trolley}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{Duration.fromMillis(order.daysSinceCreation).shiftTo('hours','minutes').toHuman()}</td>
                                    </tr>
                                ))}
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    else{
        //eslint-disable-next-line
        {/* First Workshop View, Assign Orders to Trolley */}
        return(
        <div className="w-full flex">
            {isModalVisible && (   
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Assigner un chevalet à l'OF {selectedOrder}</h2>
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
                        {orders.filter(order => order.rfidOrderId === null).map(order => (
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



