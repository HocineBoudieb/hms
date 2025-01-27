import React, { useState } from "react";
import axios from "axios";

const Declaration = ({ nfcData, orderData, onClose }) => {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [error, setError] = useState(null);

    const handleTakeCharge = async () => {
        if (!selectedActivity) {
            setError("Veuillez sélectionner une activité avant de prendre en charge.");
            return;
        }

        try {
            // Envoi de la requête pour déclarer la prise en charge
            await axios.post("http://localhost:8081/orders/take-charge", {
                orderId: orderData.id,
                nfcTag: nfcData.nfc,
                activity: selectedActivity,
            });

            alert("Prise en charge déclarée avec succès !");
            onClose(); // Ferme la modale après le succès
        } catch (err) {
            console.error("Erreur lors de la prise en charge :", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white w-1/3 p-8 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Prise en Charge</h2>
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="mb-4">
                    <p>
                        <strong>Badge Scanné :</strong> {nfcData.name}
                    </p>
                    <p>
                        <strong>Ordre de Fabrication :</strong> {orderData.id} -{" "}
                        {orderData.product}
                    </p>
                </div>
                <div className="mb-4">
                    <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                        Sélectionnez une activité
                    </label>
                    <select
                        id="activity"
                        value={selectedActivity}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Choisir une activité --</option>
                        <option value="montage">Montage</option>
                        <option value="assemblage">Assemblage</option>
                        <option value="contrôle qualité">Contrôle Qualité</option>
                        <option value="emballage">Emballage</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
