import React, { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from '../api';
const Declaration = ({ nfcData, orderData, onClose, workshopId }) => {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${apiUrl}/workshops/${workshopId}/activities`);
                setActivities(response.data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            }
        };

        fetchActivities();
    }, [workshopId]);

    const handleTakeCharge = async () => {
        if (!selectedActivity) {
            setError("Veuillez sélectionner une activité avant de prendre en charge.");
            return;
        }
        try {
            console.log("nfc data", nfcData);
            console.log("order Data", orderData);
            // Envoi de la requête pour déclarer la prise en charge
            await axios.post(apiUrl + "/supports", {
                orderId: orderData.id,
                nfcTag: nfcData.nfcId,
                activity: selectedActivity,
            });
            onClose(); // Ferme la modale après le succès
        } catch (err) {
            console.error("Erreur lors de la prise en charge :", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white w-3/4 h-3/4 p-8 rounded-lg shadow-lg relative">
                <h2 className="text-4xl font-bold mb-4">Prise en Charge</h2>
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="mb-4">
                    <p className="text-2xl">
                        <strong>Badge Scanné :</strong> {nfcData.artisan}
                    </p>
                    <p className="text-2xl">
                        <strong>Ordre de Fabrication :</strong> {orderData.id} -{" "}
                        {orderData.product}
                    </p>
                </div>
                <div className="mb-4 h-1/5">
                    <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                        Sélectionnez une activité
                    </label>
                    <select
                        id="activity"
                        value={selectedActivity}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm py-4"
                    >
                        <option value="" className="text-xl">-- Choisir une activité --</option>
                        {activities.map((activity) => (
                            <option className="text-xl" key={activity.id} value={activity.id}> {activity.name}</option>
                        ))}
                    </select>
                    {selectedActivity && (
                    <p className="mt-2 text-sm text-red-600">
                        <strong>Enlevez le chevalet avant de déclarer.</strong>{console.log(selectedActivity)}
                    </p>
                    )}
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold mt-4 py-4 px-4 rounded"
                        onClick={handleTakeCharge}
                    >
                        Prendre en charge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Declaration;
